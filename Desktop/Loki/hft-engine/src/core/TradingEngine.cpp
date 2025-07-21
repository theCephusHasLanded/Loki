#include "TradingEngine.h"
#include <chrono>
#include <immintrin.h>
#include <numa.h>
#include <sched.h>

namespace constellation::hft {

TradingEngine::TradingEngine(const Config& config) 
    : config_(config)
    , order_book_(std::make_unique<LockFreeOrderBook>())
    , sequence_generator_(std::make_unique<SequenceGenerator>())
    , market_data_publisher_(std::make_unique<MarketDataPublisher>())
    , persistence_engine_(std::make_unique<PersistenceEngine>(config.persistence_config))
    , running_(false) {
    
    // Initialize NUMA-aware memory allocation
    if (numa_available() == 0) {
        numa_set_localalloc();
        numa_set_bind_policy(1);
    }
    
    // Set CPU affinity for trading thread
    cpu_set_t cpuset;
    CPU_ZERO(&cpuset);
    CPU_SET(config_.trading_cpu_core, &cpuset);
    pthread_setaffinity_np(pthread_self(), sizeof(cpu_set_t), &cpuset);
    
    // Configure real-time scheduling
    struct sched_param param;
    param.sched_priority = 99; // Highest priority
    sched_setscheduler(0, SCHED_FIFO, &param);
    
    // Initialize performance counters
    initializePerformanceCounters();
}

TradingEngine::~TradingEngine() {
    stop();
}

void TradingEngine::start() {
    running_ = true;
    
    // Start processing threads with CPU affinity
    market_data_thread_ = std::thread([this] { 
        setCPUAffinity(config_.market_data_cpu_core);
        processMarketData(); 
    });
    
    persistence_thread_ = std::thread([this] { 
        setCPUAffinity(config_.persistence_cpu_core);
        processPersistence(); 
    });
    
    // Main trading loop runs on current thread
    tradingLoop();
}

void TradingEngine::stop() {
    running_ = false;
    
    if (market_data_thread_.joinable()) {
        market_data_thread_.join();
    }
    
    if (persistence_thread_.joinable()) {
        persistence_thread_.join();
    }
}

// Ultra-low latency order processing with nanosecond precision
ExecutionResult TradingEngine::processOrder(const Order& order) {
    // Record entry timestamp with nanosecond precision
    auto start_time = std::chrono::high_resolution_clock::now();
    
    // Generate sequence number atomically
    uint64_t sequence = sequence_generator_->next();
    
    // Validate order with minimal branching
    ValidationResult validation = validateOrder(order);
    if (unlikely(!validation.is_valid)) {
        recordLatency(start_time, "order_validation_failed");
        return ExecutionResult::rejection(validation.error_code);
    }
    
    // Process order through matching engine
    MatchingResult matching_result = order_book_->matchOrder(order, sequence);
    
    // Update market data with lock-free operations
    if (matching_result.has_trades) {
        updateMarketData(matching_result.trades);
    }
    
    // Queue for persistence (async)
    PersistenceEvent event{
        .sequence = sequence,
        .timestamp = start_time,
        .order = order,
        .matching_result = matching_result
    };
    
    persistence_queue_.push(event);
    
    // Record end-to-end latency
    recordLatency(start_time, "order_processing_complete");
    
    return ExecutionResult::success(matching_result);
}

// Lock-free order book implementation for concurrent access
class LockFreeOrderBook {
private:
    // Use atomic operations for price levels
    std::atomic<PriceLevel*> bid_levels_[MAX_PRICE_LEVELS];
    std::atomic<PriceLevel*> ask_levels_[MAX_PRICE_LEVELS];
    
    // Memory pool for order allocation
    alignas(64) OrderPool order_pool_;
    
    // Sequence-based ordering for deterministic matching
    std::atomic<uint64_t> last_sequence_{0};

public:
    MatchingResult matchOrder(const Order& order, uint64_t sequence) {
        MatchingResult result;
        result.sequence = sequence;
        result.timestamp = rdtsc(); // Use CPU timestamp counter
        
        if (order.side == OrderSide::BUY) {
            result = matchBuyOrder(order, sequence);
        } else {
            result = matchSellOrder(order, sequence);
        }
        
        // Update last processed sequence
        last_sequence_.store(sequence, std::memory_order_release);
        
        return result;
    }
    
private:
    MatchingResult matchBuyOrder(const Order& order, uint64_t sequence) {
        MatchingResult result;
        
        // Pro-rata FIFO matching algorithm
        for (int level = 0; level < MAX_PRICE_LEVELS; ++level) {
            PriceLevel* ask_level = ask_levels_[level].load(std::memory_order_acquire);
            
            if (!ask_level || ask_level->price > order.price) {
                break; // No more matching prices
            }
            
            // Match orders at this price level
            uint64_t remaining_quantity = order.quantity;
            
            for (Order* ask_order : ask_level->orders) {
                if (remaining_quantity == 0) break;
                
                uint64_t match_quantity = std::min(remaining_quantity, ask_order->quantity);
                
                // Create trade
                Trade trade{
                    .sequence = sequence,
                    .timestamp = rdtsc(),
                    .buy_order_id = order.id,
                    .sell_order_id = ask_order->id,
                    .price = ask_level->price,
                    .quantity = match_quantity
                };
                
                result.trades.push_back(trade);
                result.total_matched += match_quantity;
                
                // Update order quantities
                ask_order->quantity -= match_quantity;
                remaining_quantity -= match_quantity;
                
                if (ask_order->quantity == 0) {
                    // Remove filled order from book
                    removeOrder(ask_order);
                }
            }
            
            if (remaining_quantity == 0) {
                break; // Order fully matched
            }
        }
        
        // Add remaining quantity to book if not fully matched
        if (order.quantity > result.total_matched) {
            addOrderToBook(order, order.quantity - result.total_matched);
        }
        
        result.has_trades = !result.trades.empty();
        return result;
    }
};

// High-performance market data distribution
void TradingEngine::updateMarketData(const std::vector<Trade>& trades) {
    MarketDataUpdate update;
    update.timestamp = rdtsc();
    update.sequence = sequence_generator_->current();
    
    // Calculate new best bid/offer
    update.best_bid = order_book_->getBestBid();
    update.best_offer = order_book_->getBestOffer();
    
    // Add trade information
    for (const auto& trade : trades) {
        update.trades.push_back(trade);
    }
    
    // Publish via UDP multicast for minimal latency
    market_data_publisher_->publish(update);
    
    // Update internal statistics
    updateTradingStatistics(trades);
}

// Memory-mapped persistence for minimal I/O latency
class PersistenceEngine {
private:
    MemoryMappedFile mmf_;
    std::atomic<uint64_t> write_position_{0};
    
public:
    explicit PersistenceEngine(const PersistenceConfig& config)
        : mmf_(config.file_path, config.file_size) {
    }
    
    void persist(const PersistenceEvent& event) {
        // Calculate serialized size
        size_t serialized_size = calculateSerializedSize(event);
        
        // Get write position atomically
        uint64_t position = write_position_.fetch_add(serialized_size, std::memory_order_acq_rel);
        
        // Serialize directly to memory-mapped region
        char* buffer = mmf_.data() + position;
        serializeEvent(event, buffer, serialized_size);
        
        // Ensure write is visible (memory barrier)
        _mm_sfence();
    }
};

// Performance monitoring with minimal overhead
void TradingEngine::recordLatency(const TimePoint& start, const char* operation) {
    auto end = std::chrono::high_resolution_clock::now();
    auto duration = std::chrono::duration_cast<std::chrono::nanoseconds>(end - start).count();
    
    // Use lock-free circular buffer for latency recording
    LatencyRecord record{
        .timestamp = std::chrono::duration_cast<std::chrono::nanoseconds>(start.time_since_epoch()).count(),
        .operation = operation,
        .duration_ns = duration
    };
    
    latency_buffer_.push(record);
}

// CPU-specific optimizations
inline uint64_t TradingEngine::rdtsc() {
    return __rdtsc(); // Use CPU timestamp counter for minimal overhead
}

void TradingEngine::setCPUAffinity(int cpu_core) {
    cpu_set_t cpuset;
    CPU_ZERO(&cpuset);
    CPU_SET(cpu_core, &cpuset);
    pthread_setaffinity_np(pthread_self(), sizeof(cpu_set_t), &cpuset);
}

// Branch prediction hints for performance
#define likely(x)   __builtin_expect((x), 1)
#define unlikely(x) __builtin_expect((x), 0)

} // namespace constellation::hft