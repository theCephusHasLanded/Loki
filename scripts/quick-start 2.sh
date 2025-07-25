#!/bin/bash
# Constellation Markets - One-Command Setup Script

set -e

echo "🚀 Starting Constellation Markets Quick Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check prerequisites
check_prereqs() {
    echo -e "${BLUE}📋 Checking prerequisites...${NC}"
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is required but not installed${NC}"
        echo "Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker is required but not installed${NC}"
        echo "Please install Docker from https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}❌ Docker Compose is required but not installed${NC}"
        echo "Please install Docker Compose"
        exit 1
    fi
    
    echo -e "${GREEN}✅ All prerequisites satisfied${NC}"
}

# Setup environment
setup_environment() {
    echo -e "${BLUE}🔧 Setting up environment...${NC}"
    
    if [ ! -f .env ]; then
        echo "Creating .env file..."
        cat > .env << EOF
# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/constellation_markets
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=constellation-super-secret-jwt-key-$(openssl rand -hex 16)
JWT_REFRESH_SECRET=constellation-refresh-secret-$(openssl rand -hex 16)

# Server Configuration
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:3001

# Demo Configuration
DEMO_MODE=true
AUTO_SEED_DATA=true

# Optional Services (can be configured later)
WATSON_API_KEY=your-watson-api-key-here
STRIPE_SECRET_KEY=sk_test_your-stripe-key-here
PLAID_CLIENT_ID=your-plaid-client-id
PLAID_SECRET=your-plaid-secret

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EOF
        echo -e "${GREEN}✅ Environment file created${NC}"
    else
        echo -e "${YELLOW}ℹ️  Using existing .env file${NC}"
    fi
}

# Start infrastructure services
start_infrastructure() {
    echo -e "${BLUE}🐳 Starting infrastructure services...${NC}"
    
    # Start PostgreSQL
    echo "Starting PostgreSQL..."
    docker run -d --name constellation-postgres \
        -e POSTGRES_PASSWORD=password \
        -e POSTGRES_DB=constellation_markets \
        -p 5432:5432 \
        postgres:15-alpine || echo "PostgreSQL container already exists"
    
    # Start Redis
    echo "Starting Redis..."
    docker run -d --name constellation-redis \
        -p 6379:6379 \
        redis:7-alpine || echo "Redis container already exists"
    
    # Wait for services to be ready
    echo "Waiting for services to be ready..."
    sleep 10
    
    # Test PostgreSQL connection
    max_attempts=30
    attempt=1
    while [ $attempt -le $max_attempts ]; do
        if docker exec constellation-postgres pg_isready -U postgres &>/dev/null; then
            echo -e "${GREEN}✅ PostgreSQL is ready${NC}"
            break
        fi
        echo "Waiting for PostgreSQL... (attempt $attempt/$max_attempts)"
        sleep 2
        ((attempt++))
    done
    
    if [ $attempt -gt $max_attempts ]; then
        echo -e "${RED}❌ PostgreSQL failed to start${NC}"
        exit 1
    fi
    
    # Test Redis connection
    if docker exec constellation-redis redis-cli ping | grep -q PONG; then
        echo -e "${GREEN}✅ Redis is ready${NC}"
    else
        echo -e "${RED}❌ Redis failed to start${NC}"
        exit 1
    fi
}

# Install dependencies and setup backend
setup_backend() {
    echo -e "${BLUE}📦 Setting up backend...${NC}"
    
    # Install dependencies
    echo "Installing backend dependencies..."
    npm install
    
    # Run database migrations
    echo "Running database migrations..."
    npm run db:migrate
    
    # Seed demo data
    echo "Seeding demo data..."
    npm run db:seed
    
    echo -e "${GREEN}✅ Backend setup complete${NC}"
}

# Setup frontend
setup_frontend() {
    echo -e "${BLUE}🎨 Setting up frontend...${NC}"
    
    cd frontend
    
    # Install dependencies
    echo "Installing frontend dependencies..."
    npm install
    
    cd ..
    echo -e "${GREEN}✅ Frontend setup complete${NC}"
}

# Start services
start_services() {
    echo -e "${BLUE}🚀 Starting application services...${NC}"
    
    # Start backend in background
    echo "Starting backend server..."
    npm run dev &
    BACKEND_PID=$!
    
    # Wait for backend to start
    sleep 5
    
    # Start frontend in background  
    echo "Starting frontend server..."
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    # Store PIDs for cleanup
    echo $BACKEND_PID > .backend.pid
    echo $FRONTEND_PID > .frontend.pid
    
    echo -e "${GREEN}✅ Services started${NC}"
}

# Health checks
health_checks() {
    echo -e "${BLUE}🏥 Running health checks...${NC}"
    
    # Wait a bit for services to fully start
    sleep 10
    
    # Check backend health
    if curl -sf http://localhost:3000/health &>/dev/null; then
        echo -e "${GREEN}✅ Backend is healthy${NC}"
    else
        echo -e "${YELLOW}⚠️  Backend health check failed - may still be starting${NC}"
    fi
    
    # Check if frontend is accessible
    if curl -sf http://localhost:3001 &>/dev/null; then
        echo -e "${GREEN}✅ Frontend is accessible${NC}"
    else
        echo -e "${YELLOW}⚠️  Frontend may still be starting${NC}"
    fi
}

# Create demo data
create_demo_data() {
    echo -e "${BLUE}🎭 Creating demo data...${NC}"
    
    # Wait for backend to be fully ready
    max_attempts=30
    attempt=1
    while [ $attempt -le $max_attempts ]; do
        if curl -sf http://localhost:3000/health &>/dev/null; then
            break
        fi
        echo "Waiting for backend... (attempt $attempt/$max_attempts)"
        sleep 2
        ((attempt++))
    done
    
    if [ $attempt -le $max_attempts ]; then
        echo "Creating demo users and markets..."
        node scripts/create-demo-users.js || echo "Demo users script not found - will create manually"
        echo -e "${GREEN}✅ Demo data created${NC}"
    else
        echo -e "${YELLOW}⚠️  Backend not ready, skipping demo data${NC}"
    fi
}

# Print success message and instructions
print_success() {
    echo ""
    echo -e "${GREEN}🎉 Constellation Markets is now running!${NC}"
    echo ""
    echo -e "${BLUE}📱 Access Points:${NC}"
    echo -e "   Frontend:  ${YELLOW}http://localhost:3001${NC}"
    echo -e "   Backend:   ${YELLOW}http://localhost:3000${NC}"
    echo -e "   API Docs:  ${YELLOW}http://localhost:3000/api-docs${NC}"
    echo ""
    echo -e "${BLUE}🎯 Demo Scenarios:${NC}"
    echo -e "   1. Visit ${YELLOW}http://localhost:3001${NC} to browse markets"
    echo -e "   2. Sign up with: ${YELLOW}demo@constellation.com${NC} / ${YELLOW}ConstellationDemo123!${NC}"
    echo -e "   3. Create your first prediction market"
    echo -e "   4. Place trades and watch real-time updates"
    echo ""
    echo -e "${BLUE}🛠️  Management Commands:${NC}"
    echo -e "   Stop services:    ${YELLOW}./scripts/stop.sh${NC}"
    echo -e "   View logs:        ${YELLOW}./scripts/logs.sh${NC}"
    echo -e "   Reset database:   ${YELLOW}npm run db:reset${NC}"
    echo ""
    echo -e "${BLUE}📖 Next Steps:${NC}"
    echo -e "   • Read the full README.md for detailed instructions"
    echo -e "   • Check out the API documentation at /api-docs"
    echo -e "   • Join our Discord community (coming soon)"
    echo ""
    echo -e "${GREEN}Happy trading! 🚀${NC}"
}

# Cleanup function
cleanup() {
    echo -e "${YELLOW}🧹 Cleaning up...${NC}"
    
    # Kill background processes
    if [ -f .backend.pid ]; then
        kill $(cat .backend.pid) 2>/dev/null || true
        rm .backend.pid
    fi
    
    if [ -f .frontend.pid ]; then
        kill $(cat .frontend.pid) 2>/dev/null || true
        rm .frontend.pid
    fi
    
    exit 1
}

# Trap cleanup on script exit
trap cleanup INT TERM

# Main execution
main() {
    echo -e "${GREEN}🌟 Constellation Markets - Quick Start${NC}"
    echo -e "${BLUE}   Next-generation prediction trading platform${NC}"
    echo ""
    
    check_prereqs
    setup_environment
    start_infrastructure
    setup_backend
    setup_frontend
    start_services
    health_checks
    create_demo_data
    print_success
    
    # Keep script running to maintain services
    echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
    while true; do
        sleep 10
    done
}

# Run main function
main "$@"