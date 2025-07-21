#!/bin/bash
# View logs for Constellation Markets services

echo "📋 Constellation Markets - Service Logs"
echo "========================================"

# Check if Docker containers are running
if docker ps | grep -q constellation-postgres; then
    echo "🐘 PostgreSQL Logs:"
    docker logs --tail 50 constellation-postgres
    echo ""
fi

if docker ps | grep -q constellation-redis; then
    echo "🗂️  Redis Logs:"  
    docker logs --tail 50 constellation-redis
    echo ""
fi

# Show Node.js logs if available
if [ -f logs/backend.log ]; then
    echo "🖥️  Backend Logs:"
    tail -50 logs/backend.log
    echo ""
fi

if [ -f logs/frontend.log ]; then
    echo "🎨 Frontend Logs:"
    tail -50 logs/frontend.log
    echo ""
fi

echo "💡 Tip: Run 'docker-compose logs -f' for real-time logs"