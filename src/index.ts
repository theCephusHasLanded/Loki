import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import knex from 'knex';
import config from './config/database';
import redis from './config/redis';
import { apiRoutes } from './routes/index';
import WebSocketService from './services/websocket';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});

const db = knex(config);
const PORT = process.env.PORT || 3000;

// Initialize WebSocket service
const wsService = new WebSocketService(io);

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '3600000'),
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  message: 'Too many requests from this IP',
});

app.use(helmet());
app.use(cors());
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount API routes
app.use(apiRoutes);

// Legacy health check (the main one is in routes/index.ts)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// WebSocket handling is now managed by WebSocketService
// Connection cleanup job
setInterval(() => {
  wsService.cleanupConnections();
}, 300000); // Run every 5 minutes

const startServer = async () => {
  try {
    // Start server first, then initialize dependencies
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Prediction Market Platform initialized`);
    });
    
    // Initialize database migrations in background
    try {
      await db.migrate.latest();
      console.log('Database migrations completed');
    } catch (migrationError) {
      console.warn('Database migration failed, continuing:', migrationError);
    }
    
    // Initialize Redis connection in background
    try {
      await redis.ping();
      console.log('Redis connection established');
    } catch (redisError) {
      console.warn('Redis connection failed, continuing:', redisError);
    }
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export { app, db, io, redis, wsService };