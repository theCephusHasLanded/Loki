#!/usr/bin/env node
/**
 * Create demo users and initial trading activity for Constellation Markets
 */

const axios = require('axios');
const { performance } = require('perf_hooks');

// Configuration
const BASE_URL = process.env.API_URL || 'http://localhost:3000';
const DEMO_USERS = [
  {
    name: 'Alice Thompson',
    email: 'alice@demo.constellation.com',
    password: 'ConstellationDemo123!',
    profile: 'Optimistic Trader - Believes in positive outcomes',
    initial_balance: 5000,
    trading_style: 'optimistic',
    risk_tolerance: 'medium'
  },
  {
    name: 'Bob Martinez',
    email: 'bob@demo.constellation.com', 
    password: 'ConstellationDemo123!',
    profile: 'Conservative Trader - Risk-averse and analytical',
    initial_balance: 3000,
    trading_style: 'conservative',
    risk_tolerance: 'low'
  },
  {
    name: 'Carol Chen',
    email: 'carol@demo.constellation.com',
    password: 'ConstellationDemo123!',
    profile: 'Day Trader - Active short-term trading',
    initial_balance: 10000,
    trading_style: 'active',
    risk_tolerance: 'high'
  },
  {
    name: 'Dave Wilson',
    email: 'dave@demo.constellation.com',
    password: 'ConstellationDemo123!',
    profile: 'Arbitrageur - Seeks price discrepancies',
    initial_balance: 15000,
    trading_style: 'arbitrage',
    risk_tolerance: 'medium'
  }
];

const DEMO_MARKETS = [
  {
    title: 'Will Bitcoin reach $100,000 by end of 2024?',
    description: 'Market resolves YES if Bitcoin (BTC) reaches or exceeds $100,000 USD on any major exchange (Coinbase, Binance, Kraken) before January 1, 2025 UTC.',
    outcomes: [
      { name: 'Yes', description: 'Bitcoin reaches $100K' },
      { name: 'No', description: 'Bitcoin stays below $100K' }
    ],
    resolution_date: '2024-12-31T23:59:59Z',
    initial_liquidity: 50000,
    category: 'cryptocurrency'
  },
  {
    title: 'Will the next iPhone have a foldable display?',
    description: 'Market resolves YES if Apple announces or releases an iPhone model with a foldable/flexible display before December 31, 2024.',
    outcomes: [
      { name: 'Yes', description: 'iPhone gets foldable display' },
      { name: 'No', description: 'iPhone remains non-foldable' }
    ],
    resolution_date: '2024-12-31T23:59:59Z',
    initial_liquidity: 25000,
    category: 'technology'
  },
  {
    title: 'Will any team score 70+ points in an NFL game this season?',
    description: 'Market resolves YES if any NFL team scores 70 or more points in a single regular season or playoff game during the 2024-25 NFL season.',
    outcomes: [
      { name: 'Yes', description: '70+ points scored' },
      { name: 'No', description: 'No team reaches 70 points' }
    ],
    resolution_date: '2025-02-28T23:59:59Z',
    initial_liquidity: 15000,
    category: 'sports'
  },
  {
    title: 'Will there be a major AI breakthrough announcement in 2024?',
    description: 'Market resolves YES if a major tech company (Google, OpenAI, Microsoft, Meta, Apple) announces a significant AI breakthrough that makes international headlines.',
    outcomes: [
      { name: 'Yes', description: 'Major breakthrough announced' },
      { name: 'No', description: 'No major breakthroughs' }
    ],
    resolution_date: '2024-12-31T23:59:59Z',
    initial_liquidity: 40000,
    category: 'artificial-intelligence'
  },
  {
    title: 'Will SpaceX launch more than 100 Starship missions in 2024?',
    description: 'Market resolves YES if SpaceX successfully completes more than 100 Starship orbital missions in 2024, including test flights and commercial missions.',
    outcomes: [
      { name: 'Yes', description: '100+ Starship launches' },
      { name: 'No', description: 'Fewer than 100 launches' }
    ],
    resolution_date: '2024-12-31T23:59:59Z',
    initial_liquidity: 30000,
    category: 'space'
  }
];

class DemoDataCreator {
  constructor() {
    this.userTokens = new Map();
    this.createdMarkets = [];
    this.activeOrders = [];
  }

  async createDemoData() {
    console.log('🚀 Creating Constellation Markets demo data...\n');
    
    try {
      // Step 1: Create demo users
      await this.createDemoUsers();
      
      // Step 2: Create demo markets  
      await this.createDemoMarkets();
      
      // Step 3: Generate initial trading activity
      await this.generateTradingActivity();
      
      // Step 4: Create realistic market conditions
      await this.setupMarketConditions();
      
      console.log('\n✅ Demo data creation complete!');
      this.printSummary();
      
    } catch (error) {
      console.error('❌ Error creating demo data:', error.message);
      process.exit(1);
    }
  }

  async createDemoUsers() {
    console.log('👥 Creating demo users...');
    
    for (const userData of DEMO_USERS) {
      try {
        // Register user
        const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, {
          name: userData.name,
          email: userData.email,
          password: userData.password
        });
        
        console.log(`   ✅ Created user: ${userData.name}`);
        
        // Login to get token
        const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
          email: userData.email,
          password: userData.password
        });
        
        const token = loginResponse.data.token;
        this.userTokens.set(userData.email, token);
        
        // Add initial balance
        await axios.post(`${BASE_URL}/api/users/me/balance`, {
          amount: userData.initial_balance,
          currency: 'USD'
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log(`   💰 Added $${userData.initial_balance} balance`);
        
      } catch (error) {
        if (error.response?.status === 409) {
          console.log(`   ℹ️  User ${userData.name} already exists`);
          
          // Try to login existing user
          try {
            const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
              email: userData.email,
              password: userData.password
            });
            
            this.userTokens.set(userData.email, loginResponse.data.token);
          } catch (loginError) {
            console.log(`   ⚠️  Could not login existing user ${userData.name}`);
          }
        } else {
          console.error(`   ❌ Error creating user ${userData.name}:`, error.message);
        }
      }
    }
    
    console.log(`\n✅ Demo users setup complete (${this.userTokens.size} users ready)\n`);
  }

  async createDemoMarkets() {
    console.log('📊 Creating demo markets...');
    
    // Use Alice's token for market creation (first user)
    const creatorToken = this.userTokens.get('alice@demo.constellation.com');
    
    if (!creatorToken) {
      console.error('❌ No creator token available');
      return;
    }
    
    for (const marketData of DEMO_MARKETS) {
      try {
        const response = await axios.post(`${BASE_URL}/api/markets`, marketData, {
          headers: { Authorization: `Bearer ${creatorToken}` }
        });
        
        this.createdMarkets.push({
          id: response.data.id,
          title: marketData.title,
          outcomes: response.data.outcomes
        });
        
        console.log(`   ✅ Created market: ${marketData.title}`);
        
      } catch (error) {
        console.error(`   ❌ Error creating market "${marketData.title}":`, error.message);
      }
    }
    
    console.log(`\n✅ Demo markets created (${this.createdMarkets.length} markets)\n`);
  }

  async generateTradingActivity() {
    console.log('💹 Generating initial trading activity...');
    
    const userEmails = Array.from(this.userTokens.keys());
    const tradingStrategies = {
      'alice@demo.constellation.com': { bias: 0.6, volatility: 0.3 }, // Optimistic
      'bob@demo.constellation.com': { bias: 0.4, volatility: 0.1 },   // Conservative  
      'carol@demo.constellation.com': { bias: 0.5, volatility: 0.8 }, // Active trader
      'dave@demo.constellation.com': { bias: 0.5, volatility: 0.4 }   // Arbitrageur
    };
    
    // Generate 50 random trades across all markets
    for (let i = 0; i < 50; i++) {
      const userEmail = userEmails[Math.floor(Math.random() * userEmails.length)];
      const market = this.createdMarkets[Math.floor(Math.random() * this.createdMarkets.length)];
      const token = this.userTokens.get(userEmail);
      const strategy = tradingStrategies[userEmail];
      
      if (!token || !market) continue;
      
      try {
        const outcome = market.outcomes[Math.floor(Math.random() * market.outcomes.length)];
        const side = Math.random() < strategy.bias ? 'buy' : 'sell';
        const basePrice = 0.5;
        const priceVariation = (Math.random() - 0.5) * strategy.volatility * 0.3;
        const price = Math.max(0.01, Math.min(0.99, basePrice + priceVariation));
        const quantity = Math.floor(Math.random() * 500) + 50;
        
        const tradeData = {
          market_id: market.id,
          outcome_id: outcome.id,
          side: side,
          quantity: quantity,
          price: Number(price.toFixed(2)),
          order_type: 'limit'
        };
        
        await axios.post(`${BASE_URL}/api/trades`, tradeData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log(`   📈 ${userEmail.split('@')[0]} ${side} ${quantity} @ $${price.toFixed(2)} - ${market.title.substring(0, 30)}...`);
        
        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        // Silently continue on trade errors (might be balance/validation issues)
        continue;
      }
    }
    
    console.log('\n✅ Initial trading activity generated\n');
  }

  async setupMarketConditions() {
    console.log('🎯 Setting up realistic market conditions...');
    
    // Create some pending orders at various price levels
    const userEmails = Array.from(this.userTokens.keys());
    
    for (const market of this.createdMarkets) {
      // Create bid/ask spread with pending orders
      for (let i = 0; i < 5; i++) {
        const userEmail = userEmails[Math.floor(Math.random() * userEmails.length)];
        const token = this.userTokens.get(userEmail);
        
        if (!token) continue;
        
        try {
          const outcome = market.outcomes[0]; // Focus on first outcome
          const bidPrice = 0.45 + (i * 0.02); // Increasing bid prices
          const askPrice = 0.55 + (i * 0.02); // Increasing ask prices
          
          // Place bid order
          await axios.post(`${BASE_URL}/api/trades`, {
            market_id: market.id,
            outcome_id: outcome.id,
            side: 'buy',
            quantity: 100 + (i * 50),
            price: bidPrice,
            order_type: 'limit'
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // Place ask order (from different user if possible)
          const otherUserEmail = userEmails.find(email => email !== userEmail);
          const otherToken = this.userTokens.get(otherUserEmail);
          
          if (otherToken) {
            await axios.post(`${BASE_URL}/api/trades`, {
              market_id: market.id,
              outcome_id: outcome.id,
              side: 'sell',
              quantity: 100 + (i * 50),
              price: askPrice,
              order_type: 'limit'
            }, {
              headers: { Authorization: `Bearer ${otherToken}` }
            });
          }
          
        } catch (error) {
          // Continue on errors
          continue;
        }
      }
      
      console.log(`   ✅ Setup order book for: ${market.title.substring(0, 40)}...`);
    }
    
    console.log('\n✅ Market conditions established\n');
  }

  printSummary() {
    console.log('📋 Demo Data Summary');
    console.log('===================');
    console.log(`👥 Users created: ${this.userTokens.size}`);
    console.log(`📊 Markets created: ${this.createdMarkets.length}`);
    console.log(`💹 Trading activity: Active order books with bid/ask spreads`);
    console.log('\n🎯 Demo User Accounts:');
    
    DEMO_USERS.forEach(user => {
      console.log(`   📧 ${user.email} / ${user.password}`);
      console.log(`      ${user.name} - ${user.profile}`);
      console.log(`      Balance: $${user.initial_balance.toLocaleString()}`);
      console.log('');
    });
    
    console.log('🌐 Demo Markets Created:');
    this.createdMarkets.forEach((market, index) => {
      console.log(`   ${index + 1}. ${market.title}`);
    });
    
    console.log('\n🚀 Ready for demo! Visit http://localhost:3001 to start trading.');
  }
}

// Run the demo data creation
async function main() {
  const creator = new DemoDataCreator();
  await creator.createDemoData();
}

if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { DemoDataCreator };