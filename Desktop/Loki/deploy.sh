#!/bin/bash

# 🚀 LOKI 2032 - Deployment Script
# Deploy Frontend to Vercel & Backend to Railway

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 LOKI 2032 Deployment Starting...${NC}"

# Check if required tools are installed
check_dependencies() {
    echo -e "${YELLOW}📋 Checking dependencies...${NC}"
    
    if ! command -v vercel &> /dev/null; then
        echo -e "${RED}❌ Vercel CLI not found. Installing...${NC}"
        npm install -g vercel
    fi
    
    if ! command -v railway &> /dev/null; then
        echo -e "${RED}❌ Railway CLI not found. Installing...${NC}"
        curl -fsSL https://railway.app/install.sh | sh
    fi
    
    echo -e "${GREEN}✅ Dependencies checked${NC}"
}

# Build and deploy frontend to Vercel
deploy_frontend() {
    echo -e "${YELLOW}🎨 Deploying Frontend to Vercel...${NC}"
    
    cd frontend
    
    # Install dependencies
    echo "📦 Installing frontend dependencies..."
    npm install
    
    # Build the application
    echo "🔨 Building frontend..."
    npm run build
    
    # Deploy to Vercel
    echo "🚀 Deploying to Vercel..."
    vercel --prod --yes
    
    cd ..
    echo -e "${GREEN}✅ Frontend deployed to Vercel${NC}"
}

# Deploy backend to Railway
deploy_backend() {
    echo -e "${YELLOW}🔧 Deploying Backend to Railway...${NC}"
    
    # Install dependencies
    echo "📦 Installing backend dependencies..."
    npm install
    
    # Build the application
    echo "🔨 Building backend..."
    npm run build
    
    # Deploy to Railway
    echo "🚀 Deploying to Railway..."
    railway up --detach
    
    echo -e "${GREEN}✅ Backend deployed to Railway${NC}"
}

# Configure environment variables
setup_env_vars() {
    echo -e "${YELLOW}⚙️  Setting up environment variables...${NC}"
    
    # Check if .env files exist
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}⚠️  No .env file found in root. Creating template...${NC}"
        cat > .env << EOF
# Database
DATABASE_URL=postgresql://username:password@hostname:port/database
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secret-jwt-key
BCRYPT_ROUNDS=12

# External APIs
WATSON_API_KEY=your-watson-api-key
WATSON_URL=https://api.us-south.assistant.watson.cloud.ibm.com

# Server
PORT=3000
NODE_ENV=production

# CORS
FRONTEND_URL=https://your-vercel-app.vercel.app
EOF
        echo -e "${YELLOW}📝 Please update .env with your actual values${NC}"
    fi
    
    if [ ! -f "frontend/.env.local" ]; then
        echo -e "${YELLOW}⚠️  No .env.local file found in frontend. Creating template...${NC}"
        cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app
NEXT_PUBLIC_WS_URL=wss://your-railway-app.railway.app
EOF
        echo -e "${YELLOW}📝 Please update frontend/.env.local with your actual values${NC}"
    fi
    
    echo -e "${GREEN}✅ Environment templates created${NC}"
}

# Test deployment
test_deployment() {
    echo -e "${YELLOW}🧪 Testing deployments...${NC}"
    
    # Get Railway URL
    if command -v railway &> /dev/null; then
        RAILWAY_URL=$(railway status --json | grep -o '"url":"[^"]*' | cut -d'"' -f4)
        if [ ! -z "$RAILWAY_URL" ]; then
            echo "🔧 Testing backend at: $RAILWAY_URL"
            curl -f "$RAILWAY_URL/health" || echo "⚠️  Backend health check failed"
        fi
    fi
    
    # Test Vercel deployment
    if [ -f "frontend/.vercel/project.json" ]; then
        VERCEL_URL=$(cat frontend/.vercel/project.json | grep -o '"alias":\["[^"]*' | cut -d'"' -f4)
        if [ ! -z "$VERCEL_URL" ]; then
            echo "🎨 Testing frontend at: https://$VERCEL_URL"
            curl -f "https://$VERCEL_URL" || echo "⚠️  Frontend health check failed"
        fi
    fi
    
    echo -e "${GREEN}✅ Deployment testing completed${NC}"
}

# Main deployment flow
main() {
    echo -e "${BLUE}🌟 LOKI 2032 Constellation Markets Deployment${NC}"
    echo -e "${BLUE}=============================================${NC}"
    
    # Check dependencies
    check_dependencies
    
    # Setup environment variables
    setup_env_vars
    
    # Deploy backend first
    deploy_backend
    
    # Deploy frontend
    deploy_frontend
    
    # Test deployments
    test_deployment
    
    echo -e "${GREEN}🎉 Deployment Complete!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}Frontend: Check Vercel dashboard${NC}"
    echo -e "${GREEN}Backend: Check Railway dashboard${NC}"
    echo -e "${YELLOW}⚠️  Don't forget to update environment variables!${NC}"
}

# Handle script arguments
case "$1" in
    "frontend"|"fe")
        deploy_frontend
        ;;
    "backend"|"be")
        deploy_backend
        ;;
    "env")
        setup_env_vars
        ;;
    "test")
        test_deployment
        ;;
    *)
        main
        ;;
esac