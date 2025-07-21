#!/usr/bin/env node
/**
 * Simulate realistic trading activity for Constellation Markets demo
 */

const axios = require('axios');
const WebSocket = require('ws');

// Configuration
const BASE_URL = process.env.API_URL || 'http://localhost:3000';
const WS_URL = process.env.WS_URL || 'ws://localhost:3000';

class TradingSimulator {
  constructor() {
    this.userTokens = new Map();
    this.markets = [];
    this.isRunning = false;
    this.ws = null;
    this.tradeCount = 0;
    this.startTime = Date.now();
  }

  async startSimulation() {
    console.log('🎮 Starting Constellation Markets Trading Simulation...\n');
    
    try {
      // Setup
      await this.loadExistingData();
      await this.connectWebSocket();
      
      // Start simulation
      this.isRunning = true;
      console.log('🚀 Simulation started - Press Ctrl+C to stop\n');
      
      // Run multiple trading strategies concurrently
      await Promise.all([
        this.runMarketMakingStrategy(),
        this.runTrendFollowingStrategy(),
        this.runArbitrageStrategy(),
        this.runRandomWalkStrategy(),
        this.printStats()
      ]);
      
    } catch (error) {
      console.error('❌ Simulation error:', error.message);
      process.exit(1);
    }
  }

  async loadExistingData() {
    console.log('📊 Loading existing markets and users...');
    
    // Load demo user tokens
    const demoUsers = [
      'alice@demo.constellation.com',
      'bob@demo.constellation.com', 
      'carol@demo.constellation.com',
      'dave@demo.constellation.com'
    ];
    
    for (const email of demoUsers) {
      try {
        const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
          email: email,
          password: 'ConstellationDemo123!'
        });
        
        this.userTokens.set(email, loginResponse.data.token);
        console.log(`   ✅ Loaded user: ${email.split('@')[0]}`);
        
      } catch (error) {
        console.log(`   ⚠️  Could not load user: ${email.split('@')[0]}`);
      }
    }
    
    // Load available markets
    try {
      const marketsResponse = await axios.get(`${BASE_URL}/api/markets`);
      this.markets = marketsResponse.data.filter(market => market.status === 'active');
      console.log(`   ✅ Loaded ${this.markets.length} active markets`);
      
    } catch (error) {
      console.error('   ❌ Could not load markets');
      throw error;
    }
    
    console.log('');
  }

  async connectWebSocket() {
    console.log('🔗 Connecting to WebSocket...');
    
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(`${WS_URL}/ws`);
      
      this.ws.on('open', () => {
        console.log('   ✅ WebSocket connected');
        
        // Subscribe to all market updates
        this.markets.forEach(market => {
          this.ws.send(JSON.stringify({
            type: 'subscribe',
            channel: 'market_data',
            market_id: market.id
          }));
        });
        
        console.log('');
        resolve();
      });
      
      this.ws.on('message', (data) => {
        try {
          const message = JSON.parse(data);
          if (message.type === 'trade') {
            this.onTradeUpdate(message);
          } else if (message.type === 'orderbook') {
            this.onOrderBookUpdate(message);
          }
        } catch (error) {
          // Ignore parsing errors
        }
      });
      
      this.ws.on('error', (error) => {
        console.error('WebSocket error:', error.message);
        reject(error);
      });
      
      setTimeout(() => {
        reject(new Error('WebSocket connection timeout'));
      }, 10000);
    });
  }

  onTradeUpdate(trade) {
    console.log(`📈 TRADE: ${trade.quantity}@$${trade.price} in ${trade.market_title?.substring(0, 30)}...`);
    this.tradeCount++;
  }

  onOrderBookUpdate(orderbook) {
    const spread = orderbook.asks[0]?.price - orderbook.bids[0]?.price;
    if (spread) {
      console.log(`📊 SPREAD: $${spread.toFixed(3)} in ${orderbook.market_title?.substring(0, 30)}...`);
    }
  }

  // Market making strategy - provides liquidity
  async runMarketMakingStrategy() {
    const userEmail = 'alice@demo.constellation.com';
    const token = this.userTokens.get(userEmail);
    
    if (!token) return;
    
    while (this.isRunning) {
      try {
        for (const market of this.markets.slice(0, 2)) { // Focus on 2 markets
          const outcome = market.outcomes[0]; // First outcome
          
          // Get current market data
          const marketDataResponse = await axios.get(`${BASE_URL}/api/markets/${market.id}/data`);
          const currentPrice = marketDataResponse.data.last_price || 0.50;
          
          // Place orders around current price
          const spread = 0.02; // 2 cent spread
          const bidPrice = Math.max(0.01, currentPrice - spread);
          const askPrice = Math.min(0.99, currentPrice + spread);
          const quantity = 50 + Math.floor(Math.random() * 50);
          
          // Place bid
          await this.placeOrder(token, market.id, outcome.id, 'buy', quantity, bidPrice);
          
          // Place ask
          await this.placeOrder(token, market.id, outcome.id, 'sell', quantity, askPrice);
          
          console.log(`🏪 MM: Placed ${quantity}@$${bidPrice.toFixed(2)}/$${askPrice.toFixed(2)} in ${market.title.substring(0, 25)}...`);
        }
        
        // Wait before next market making cycle
        await this.sleep(5000 + Math.random() * 5000);
        
      } catch (error) {
        // Continue on errors
        await this.sleep(1000);
      }
    }
  }

  // Trend following strategy - follows price movements
  async runTrendFollowingStrategy() {
    const userEmail = 'carol@demo.constellation.com';
    const token = this.userTokens.get(userEmail);
    
    if (!token) return;
    
    const priceHistory = new Map(); // Track price history
    
    while (this.isRunning) {
      try {
        for (const market of this.markets) {
          const outcome = market.outcomes[0];
          
          // Get current price
          const marketDataResponse = await axios.get(`${BASE_URL}/api/markets/${market.id}/data`);
          const currentPrice = marketDataResponse.data.last_price || 0.50;
          
          // Initialize or update price history
          if (!priceHistory.has(market.id)) {
            priceHistory.set(market.id, [currentPrice]);
            continue;
          }
          
          const history = priceHistory.get(market.id);
          history.push(currentPrice);
          
          // Keep only last 10 prices
          if (history.length > 10) {
            history.shift();
          }
          
          // Calculate trend
          if (history.length >= 5) {
            const recentAvg = history.slice(-3).reduce((a, b) => a + b) / 3;
            const olderAvg = history.slice(0, 3).reduce((a, b) => a + b) / 3;
            
            const trend = recentAvg - olderAvg;
            
            if (Math.abs(trend) > 0.01) { // Significant trend
              const side = trend > 0 ? 'buy' : 'sell';
              const quantity = 30 + Math.floor(Math.random() * 40);
              const price = side === 'buy' ? 
                Math.min(0.99, currentPrice + 0.01) : 
                Math.max(0.01, currentPrice - 0.01);
              
              await this.placeOrder(token, market.id, outcome.id, side, quantity, price);
              console.log(`📈 TREND: ${side} ${quantity}@$${price.toFixed(2)} (trend: ${trend > 0 ? '+' : ''}${trend.toFixed(3)}) in ${market.title.substring(0, 25)}...`);
            }
          }
        }
        
        await this.sleep(3000 + Math.random() * 7000);
        
      } catch (error) {
        await this.sleep(1000);
      }
    }
  }

  // Arbitrage strategy - looks for price discrepancies
  async runArbitrageStrategy() {
    const userEmail = 'dave@demo.constellation.com';
    const token = this.userTokens.get(userEmail);
    
    if (!token) return;
    
    while (this.isRunning) {
      try {
        // Look for arbitrage opportunities across outcomes
        for (const market of this.markets) {
          if (market.outcomes.length < 2) continue;
          
          const outcome1 = market.outcomes[0];
          const outcome2 = market.outcomes[1];
          
          // Get order books for both outcomes
          const book1Response = await axios.get(`${BASE_URL}/api/markets/${market.id}/orderbook?outcome_id=${outcome1.id}`);
          const book2Response = await axios.get(`${BASE_URL}/api/markets/${market.id}/orderbook?outcome_id=${outcome2.id}`);
          
          const book1 = book1Response.data;
          const book2 = book2Response.data;
          
          if (book1.bids.length > 0 && book1.asks.length > 0 && 
              book2.bids.length > 0 && book2.asks.length > 0) {
            
            // Check if prices don't add up to ~1.0 (arbitrage opportunity)
            const price1 = (book1.bids[0].price + book1.asks[0].price) / 2;
            const price2 = (book2.bids[0].price + book2.asks[0].price) / 2;
            const totalPrice = price1 + price2;
            
            if (Math.abs(totalPrice - 1.0) > 0.05) { // 5 cent arbitrage opportunity
              const quantity = 20 + Math.floor(Math.random() * 30);
              
              if (totalPrice > 1.05) {
                // Sell both outcomes
                await this.placeOrder(token, market.id, outcome1.id, 'sell', quantity, price1 - 0.01);
                await this.placeOrder(token, market.id, outcome2.id, 'sell', quantity, price2 - 0.01);
                console.log(`⚖️  ARB: Sell both outcomes (total: $${totalPrice.toFixed(3)}) in ${market.title.substring(0, 25)}...`);
              } else if (totalPrice < 0.95) {
                // Buy both outcomes  
                await this.placeOrder(token, market.id, outcome1.id, 'buy', quantity, price1 + 0.01);
                await this.placeOrder(token, market.id, outcome2.id, 'buy', quantity, price2 + 0.01);
                console.log(`⚖️  ARB: Buy both outcomes (total: $${totalPrice.toFixed(3)}) in ${market.title.substring(0, 25)}...`);
              }
            }
          }
        }
        
        await this.sleep(8000 + Math.random() * 12000);
        
      } catch (error) {
        await this.sleep(2000);
      }
    }
  }

  // Random walk strategy - provides random market activity
  async runRandomWalkStrategy() {
    const userEmail = 'bob@demo.constellation.com';
    const token = this.userTokens.get(userEmail);
    
    if (!token) return;
    
    while (this.isRunning) {
      try {
        const market = this.markets[Math.floor(Math.random() * this.markets.length)];
        const outcome = market.outcomes[Math.floor(Math.random() * market.outcomes.length)];
        
        const side = Math.random() < 0.5 ? 'buy' : 'sell';
        const basePrice = 0.3 + Math.random() * 0.4; // Random price between 0.3-0.7
        const price = Math.max(0.01, Math.min(0.99, basePrice));
        const quantity = 10 + Math.floor(Math.random() * 40);
        
        await this.placeOrder(token, market.id, outcome.id, side, quantity, price);
        console.log(`🎲 RANDOM: ${side} ${quantity}@$${price.toFixed(2)} in ${market.title.substring(0, 25)}...`);
        
        await this.sleep(2000 + Math.random() * 8000);
        
      } catch (error) {
        await this.sleep(1000);
      }
    }
  }

  async placeOrder(token, marketId, outcomeId, side, quantity, price) {
    try {
      await axios.post(`${BASE_URL}/api/trades`, {
        market_id: marketId,
        outcome_id: outcomeId,
        side: side,
        quantity: quantity,
        price: Number(price.toFixed(2)),
        order_type: 'limit'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
    } catch (error) {
      // Silently handle order errors (balance, validation, etc.)
    }
  }

  async printStats() {
    while (this.isRunning) {
      await this.sleep(30000); // Every 30 seconds
      
      const elapsed = (Date.now() - this.startTime) / 1000;
      const tradesPerSecond = this.tradeCount / elapsed;
      
      console.log(`\n📊 SIMULATION STATS:`);
      console.log(`   Runtime: ${Math.floor(elapsed)}s`);
      console.log(`   Total trades: ${this.tradeCount}`);
      console.log(`   Trades/sec: ${tradesPerSecond.toFixed(2)}`);
      console.log(`   Active markets: ${this.markets.length}`);
      console.log(`   Active users: ${this.userTokens.size}`);
      console.log('');
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  stop() {
    console.log('\n🛑 Stopping simulation...');
    this.isRunning = false;
    
    if (this.ws) {
      this.ws.close();
    }
    
    console.log('✅ Simulation stopped');
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  if (global.simulator) {
    global.simulator.stop();
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  if (global.simulator) {
    global.simulator.stop();
  }
  process.exit(0);
});

// Run simulation
async function main() {
  global.simulator = new TradingSimulator();
  await global.simulator.startSimulation();
}

if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { TradingSimulator };