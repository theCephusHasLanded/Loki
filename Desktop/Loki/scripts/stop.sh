#!/bin/bash
# Stop Constellation Markets services

echo "🛑 Stopping Constellation Markets..."

# Kill Node.js processes
echo "Stopping Node.js processes..."
pkill -f "node.*constellation" || true
pkill -f "npm.*dev" || true

# Stop Docker containers
echo "Stopping Docker containers..."
docker stop constellation-postgres 2>/dev/null || true
docker stop constellation-redis 2>/dev/null || true

# Remove containers (optional - comment out to keep data)
# docker rm constellation-postgres 2>/dev/null || true
# docker rm constellation-redis 2>/dev/null || true

# Clean up PID files
rm -f .backend.pid .frontend.pid

echo "✅ All services stopped"