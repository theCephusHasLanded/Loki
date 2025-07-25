# Constellation Markets - Prediction Trading Platform

A next-generation prediction market platform with ultra-low latency trading, AI-powered insights, and global edge computing. Built for institutional-grade performance with consumer-friendly interfaces.

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm/yarn
- **Docker** and Docker Compose
- **PostgreSQL** 15+ 
- **Redis** 7+
- **Git**

### One-Command Setup (Local Development)
```bash
# Clone and start the full stack
git clone https://github.com/theCephusHasLanded/Loki.git
cd Loki
chmod +x scripts/quick-start.sh
./scripts/quick-start.sh
```

## 📋 Manual Setup Instructions

### 1. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Required environment variables:
echo "
DATABASE_URL=postgresql://postgres:password@localhost:5432/constellation_markets
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key
WATSON_API_KEY=your-watson-api-key (optional)
STRIPE_SECRET_KEY=your-stripe-key (for payments)
" > .env
```

### 2. Database Setup
```bash
# Start PostgreSQL (via Docker)
docker run --name constellation-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=constellation_markets -p 5432:5432 -d postgres:15-alpine

# Run database migrations
npm run db:migrate

# Seed with demo data
npm run db:seed
```

### 3. Backend Services
```bash
# Install dependencies
npm install

# Start the backend API
npm run dev

# Backend will be available at http://localhost:3000
```

### 4. Frontend Application
```bash
# Navigate to frontend directory
cd frontend

# Install frontend dependencies
npm install

# Start development server
npm run dev

# Frontend will be available at http://localhost:3001
```

### 5. Redis Cache
```bash
# Start Redis
docker run --name constellation-redis -p 6379:6379 -d redis:7-alpine
```

## 🎯 Demo Scenarios & Dogfooding

### Scenario 1: Create and Trade on Your First Market

#### Step 1: User Registration & Login
```bash
# Visit http://localhost:3001
# Click "Sign Up" and create account with:
Email: demo@constellation.com
Password: ConstellationDemo123!

# Or use the demo API endpoint:
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@constellation.com",
    "password": "ConstellationDemo123!",
    "name": "Demo User"
  }'
```

#### Step 2: Create Your First Prediction Market
```bash
# Via API (returns market_id for next steps):
curl -X POST http://localhost:3000/api/markets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Will Bitcoin reach $100,000 by end of 2024?",
    "description": "Market resolves YES if Bitcoin (BTC) reaches or exceeds $100,000 USD on any major exchange before January 1, 2025.",
    "outcomes": [
      {"name": "Yes", "description": "Bitcoin reaches $100K"},
      {"name": "No", "description": "Bitcoin stays below $100K"}
    ],
    "resolution_date": "2024-12-31T23:59:59Z",
    "initial_liquidity": 10000
  }'

# Or create via the web interface at http://localhost:3001/create-market
```

#### Step 3: Fund Your Account
```bash
# Add demo balance via API:
curl -X POST http://localhost:3000/api/users/me/balance \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 1000,
    "currency": "USD"
  }'

# Check your balance:
curl -X GET http://localhost:3000/api/users/me/balance \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Step 4: Place Your First Trade
```bash
# Buy "Yes" shares at $0.65 per share
curl -X POST http://localhost:3000/api/trades \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "market_id": 1,
    "outcome_id": 1,
    "side": "buy",
    "quantity": 100,
    "price": 0.65,
    "order_type": "limit"
  }'

# Check your positions:
curl -X GET http://localhost:3000/api/users/me/positions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Step 5: Monitor Market Activity
```bash
# Get real-time market data:
curl -X GET http://localhost:3000/api/markets/1/data

# View order book:
curl -X GET http://localhost:3000/api/markets/1/orderbook

# Watch live updates via WebSocket:
# Connect to ws://localhost:3000/ws and subscribe to market updates
```

### Scenario 2: Multi-User Trading Simulation

#### Create Multiple Demo Users
```bash
# Run the demo user creation script:
node scripts/create-demo-users.js

# This creates:
# - Alice (Optimistic Trader)
# - Bob (Conservative Trader)  
# - Carol (Day Trader)
# - Dave (Arbitrageur)
```

#### Simulate Market Activity
```bash
# Run the market simulation script:
node scripts/simulate-trading.js

# This will:
# 1. Create 5 different prediction markets
# 2. Generate realistic trading activity
# 3. Show price discovery in action
# 4. Demonstrate market making algorithms
```

#### Monitor Performance
```bash
# Check trading metrics:
curl -X GET http://localhost:3000/api/analytics/metrics

# View leaderboard:
curl -X GET http://localhost:3000/api/users/leaderboard

# Get market statistics:
curl -X GET http://localhost:3000/api/markets/stats
```

### Scenario 3: AI-Powered Market Analysis

#### Enable Watson Integration (Optional)
```bash
# Add Watson API key to .env:
echo "WATSON_NLU_API_KEY=your-watson-key" >> .env
echo "WATSON_VR_API_KEY=your-visual-recognition-key" >> .env

# Restart backend to enable AI features:
npm run dev
```

#### Test AI Market Analysis
```bash
# Get AI sentiment analysis for a market:
curl -X GET http://localhost:3000/api/markets/1/ai-analysis \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Generate trading recommendations:
curl -X GET http://localhost:3000/api/ai/recommendations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📊 Feature Status

### ✅ Fully Operational (Ready for Demo)

#### Core Trading Platform
- **User Management**: Registration, login, JWT authentication
- **Market Creation**: Create custom prediction markets with outcomes
- **Order Matching**: CPMM (Constant Product Market Maker) algorithm
- **Real-time Trading**: WebSocket-powered live order book updates
- **Position Management**: Track shares, P&L, and portfolio performance
- **Database Layer**: PostgreSQL with 10 migration files, full schema

#### API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication  
- `GET /api/markets` - List all markets
- `POST /api/markets` - Create new market
- `GET /api/markets/:id` - Get market details
- `POST /api/trades` - Place trading order
- `GET /api/users/me/positions` - Get user positions
- `GET /api/users/me/balance` - Get account balance
- `WebSocket /ws` - Real-time market data

#### Frontend Application
- **Market Browser**: Browse and search prediction markets
- **Trading Interface**: Place buy/sell orders with real-time pricing
- **Portfolio Dashboard**: View positions, P&L, and trading history
- **Market Creation**: User-friendly market creation wizard
- **Responsive Design**: Mobile-friendly Pico.css styling

#### Infrastructure
- **Docker Support**: Full containerization with docker-compose
- **Database Migrations**: Automated schema management
- **Redis Caching**: Order book and session caching
- **Error Handling**: Comprehensive error responses
- **Logging**: Structured logging with Winston

### 🚧 In Development (Coming Soon)

#### Phase 2: Microservices Architecture
- **Kong API Gateway**: Service mesh and rate limiting
- **Kafka Event Streaming**: Event-driven architecture
- **gRPC Services**: High-performance inter-service communication
- **Service Discovery**: Consul-based service registry
- **Advanced Analytics**: ClickHouse OLAP database

#### Phase 2: AI Integration
- **Watson NLU**: Natural language processing for market analysis
- **Watson Visual Recognition**: Image-based market insights
- **Watson Discovery**: Document analysis and sentiment tracking
- **ML Trading Algorithms**: Automated market making bots
- **Risk Assessment**: AI-powered risk scoring

#### Phase 2: Advanced Features
- **Payment Processing**: Stripe integration for real money
- **Email Notifications**: Automated trade confirmations
- **SMS Alerts**: Twilio integration for price alerts
- **Social Features**: Market discussions and user following
- **Mobile App**: React Native mobile application

### 🔬 Experimental (Phase 3)

#### Ultra-High Performance Trading
- **C++ Trading Engine**: Sub-millisecond order processing
- **Custom Binary Protocols**: Zero-copy serialization
- **Global Edge Network**: AWS Wavelength + Cloudflare Workers
- **Multi-Region Active-Active**: Cross-region replication
- **Time-Series Optimization**: Gorilla compression algorithm

#### Advanced Infrastructure  
- **Blockchain Integration**: DeFi connectivity and smart contracts
- **Quantum-Inspired Algorithms**: Advanced optimization techniques
- **Institutional Infrastructure**: Prime brokerage integration
- **Enterprise Analytics**: Business intelligence dashboard
- **API Marketplace**: Developer ecosystem platform

## 📱 Web Interface Guide

### Main Dashboard (`/`)
- Market overview with trending predictions
- Quick stats: Total volume, active markets, users online
- Featured markets with current odds
- Recent trading activity feed

### Market Browser (`/markets`)
- Filter markets by category, date, volume
- Search functionality
- Market cards showing key metrics
- Sort by volume, creation date, or activity

### Trading Interface (`/markets/:id`)
- Real-time order book with bid/ask spread
- Price chart with historical data
- One-click trading with price preview
- Position tracker and P&L calculator

### Portfolio (`/portfolio`) 
- Current positions across all markets
- Unrealized and realized P&L
- Trading history with filters
- Performance analytics

### Create Market (`/create`)
- Step-by-step market creation wizard
- Outcome configuration
- Resolution criteria setup
- Initial liquidity settings

## 🔧 Development & Testing

### Running Tests
```bash
# Backend tests
npm test

# Frontend tests  
cd frontend && npm test

# Integration tests
npm run test:integration

# Load testing
npm run test:load
```

### Database Management
```bash
# Create new migration
npm run db:migration:create migration_name

# Run migrations
npm run db:migrate

# Rollback migration
npm run db:migrate:down

# Reset database
npm run db:reset
```

### Monitoring & Debugging
```bash
# View application logs
docker-compose logs -f backend

# Monitor Redis
docker exec -it constellation-redis redis-cli monitor

# Database debugging
docker exec -it constellation-postgres psql -U postgres -d constellation_markets
```

## 🚀 Production Deployment

### Docker Compose (Recommended)
```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d

# With microservices (Phase 2)
docker-compose -f docker-compose.microservices.yml up -d
```

### Manual Deployment
```bash
# Build for production
npm run build
cd frontend && npm run build

# Set production environment
export NODE_ENV=production

# Start with PM2
npm install -g pm2
pm2 start ecosystem.config.js
```

### Environment Variables (Production)
```bash
DATABASE_URL=postgresql://user:pass@prod-host:5432/constellation
REDIS_URL=redis://prod-redis:6379
JWT_SECRET=production-super-secret-key
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://constellation-markets.com
```

## 📈 Performance Metrics

### Current Benchmarks (Phase 1)
- **Order Processing**: ~1,000 orders/second
- **WebSocket Updates**: <10ms latency
- **API Response Time**: ~50ms average
- **Database Queries**: ~5ms average
- **Memory Usage**: ~200MB per service

### Target Performance (Phase 3)
- **Order Processing**: >200,000 orders/second
- **Global Latency**: <10ms worldwide
- **Uptime**: 99.999% availability
- **Throughput**: 10M+ requests/second
- **Recovery Time**: <30 seconds

## 📞 Support & Contributing

### Getting Help
- **Documentation**: [docs.constellation.com](coming-soon)
- **API Reference**: http://localhost:3000/api-docs
- **Discord Community**: [Join our Discord](coming-soon)
- **Email Support**: support@constellation.com

### Contributing
```bash
# Fork the repository
git clone https://github.com/your-username/Loki.git

# Create feature branch
git checkout -b feature/your-feature

# Make changes and test
npm test

# Submit pull request
git push origin feature/your-feature
```

### Development Guidelines
- Follow TypeScript strict mode
- Write tests for new features
- Update documentation
- Use conventional commits
- Ensure Docker builds pass

---

**Built with ❤️ by the Constellation Team**

*Ready to revolutionize prediction markets with institutional-grade performance and consumer-friendly interfaces.*