#pragma once

#include <atomic>
#include <thread>
#include <vector>
#include <memory>
#include <chrono>
#include <x86intrin.h>

namespace constellation::hft {

// Configuration for ultra-low latency trading
struct Config {
    int trading_cpu_core = 0;      // Dedicated CPU core for trading
    int market_data_cpu_core = 1;  // CPU core for market data processing
    int persistence_cpu_core = 2;  // CPU core for persistence
    
    struct PersistenceConfig {
        std::string file_path = "/dev/shm/trading_log";
        size_t file_size = 1024 * 1024 * 1024; // 1GB memory-mapped file
    } persistence_config;
};

// Order structure optimized for cache efficiency
struct alignas(64) Order {
    uint64_t id;
    uint64_t user_id;
    uint64_t market_id;
    uint64_t outcome_id;
    
    enum class Side : uint8_t { BUY = 0, SELL = 1 } side;
    enum class Type : uint8_t { LIMIT = 0, MARKET = 1, IOC = 2, FOK = 3 } type;
    
    uint64_t price;      // Fixed-point price representation
    uint64_t quantity;   // Quantity in smallest unit
    uint64_t timestamp;  // Nanosecond timestamp
    
    // Order flags for fast processing
    union {
        uint32_t flags;
        struct {
            uint32_t is_iceberg : 1;
            uint32_t is_hidden : 1;
            uint32_t allow_partial : 1;
            uint32_t reserved : 29;
        };
    };
};

static_assert(sizeof(Order) == 64, "Order must fit in single cache line");

// Trade execution result
struct Trade {
    uint64_t sequence;
    uint64_t timestamp;
    uint64_t buy_order_id;
    uint64_t sell_order_id;
    uint64_t price;
    uint64_t quantity;
};

// Matching engine result
struct MatchingResult {
    uint64_t sequence;
    uint64_t timestamp;
    std::vector<Trade> trades;
    uint64_t total_matched = 0;
    bool has_trades = false;
};

// Order validation result
struct ValidationResult {
    bool is_valid = true;
    uint32_t error_code = 0;
    const char* error_message = nullptr;
};

// Execution result for API responses
class ExecutionResult {
public:
    static ExecutionResult success(const MatchingResult& result) {
        ExecutionResult r;
        r.success_ = true;
        r.matching_result_ = result;
        return r;
    }
    
    static ExecutionResult rejection(uint32_t error_code) {
        ExecutionResult r;
        r.success_ = false;
        r.error_code_ = error_code;
        return r;
    }
    
    bool success() const { return success_; }
    const MatchingResult& matching_result() const { return matching_result_; }
    uint32_t error_code() const { return error_code_; }

private:
    bool success_ = false;
    MatchingResult matching_result_;
    uint32_t error_code_ = 0;
};

// Forward declarations
class LockFreeOrderBook;
class SequenceGenerator;
class MarketDataPublisher;
class PersistenceEngine;

// Main trading engine class
class TradingEngine {
public:
    using TimePoint = std::chrono::high_resolution_clock::time_point;
    
    explicit TradingEngine(const Config& config);
    ~TradingEngine();
    
    // Engine lifecycle
    void start();
    void stop();
    bool is_running() const { return running_; }
    
    // Order processing (ultra-low latency path)
    ExecutionResult processOrder(const Order& order);
    
    // Market data access
    struct MarketSnapshot {
        uint64_t sequence;
        uint64_t timestamp;
        uint64_t best_bid_price;
        uint64_t best_bid_quantity;
        uint64_t best_offer_price;
        uint64_t best_offer_quantity;
    };
    
    MarketSnapshot getMarketSnapshot() const;
    
    // Performance metrics
    struct PerformanceMetrics {
        uint64_t orders_processed = 0;
        uint64_t trades_executed = 0;
        uint64_t avg_latency_ns = 0;
        uint64_t p99_latency_ns = 0;
        uint64_t p999_latency_ns = 0;
    };
    
    PerformanceMetrics getPerformanceMetrics() const;

private:
    // Configuration
    const Config config_;
    
    // Core components
    std::unique_ptr<LockFreeOrderBook> order_book_;
    std::unique_ptr<SequenceGenerator> sequence_generator_;
    std::unique_ptr<MarketDataPublisher> market_data_publisher_;
    std::unique_ptr<PersistenceEngine> persistence_engine_;
    
    // Threading
    std::atomic<bool> running_;
    std::thread market_data_thread_;
    std::thread persistence_thread_;
    
    // Performance monitoring
    struct LatencyRecord {
        uint64_t timestamp;
        const char* operation;
        uint64_t duration_ns;
    };
    
    static constexpr size_t LATENCY_BUFFER_SIZE = 1024 * 1024;
    alignas(64) std::atomic<size_t> latency_write_index_{0};
    alignas(64) LatencyRecord latency_buffer_[LATENCY_BUFFER_SIZE];
    
    // Internal methods
    void tradingLoop();
    void processMarketData();
    void processPersistence();
    
    ValidationResult validateOrder(const Order& order);
    void updateMarketData(const std::vector<Trade>& trades);
    void updateTradingStatistics(const std::vector<Trade>& trades);
    
    // Performance utilities
    void recordLatency(const TimePoint& start, const char* operation);
    void initializePerformanceCounters();
    
    // CPU optimization utilities
    static inline uint64_t rdtsc();
    static void setCPUAffinity(int cpu_core);
    
    // Lock-free persistence queue
    struct PersistenceEvent {
        uint64_t sequence;
        TimePoint timestamp;
        Order order;
        MatchingResult matching_result;
    };
    
    static constexpr size_t PERSISTENCE_QUEUE_SIZE = 1024 * 1024;
    struct alignas(64) {
        std::atomic<size_t> write_index{0};
        std::atomic<size_t> read_index{0};
        PersistenceEvent events[PERSISTENCE_QUEUE_SIZE];
    } persistence_queue_;
};

// Sequence generator for deterministic ordering
class SequenceGenerator {
private:
    alignas(64) std::atomic<uint64_t> sequence_{0};
    
public:
    uint64_t next() {
        return sequence_.fetch_add(1, std::memory_order_acq_rel);
    }
    
    uint64_t current() const {
        return sequence_.load(std::memory_order_acquire);
    }
};

// Constants for performance optimization
constexpr size_t MAX_PRICE_LEVELS = 1000;
constexpr size_t CACHE_LINE_SIZE = 64;

// Price level in order book
struct alignas(CACHE_LINE_SIZE) PriceLevel {
    uint64_t price;
    uint64_t total_quantity;
    std::vector<Order*> orders;
    std::atomic<PriceLevel*> next{nullptr};
};

} // namespace constellation::hft