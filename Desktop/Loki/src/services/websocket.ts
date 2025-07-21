import { Server } from 'socket.io';
import { sessionService } from './session';
import { db } from '../index';

export class WebSocketService {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    // Authentication middleware for WebSocket connections
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth?.token;
        if (!token) {
          return next();  // Allow anonymous connections for public market data
        }

        const sessionData = await sessionService.validateAccessToken(token);
        if (sessionData) {
          socket.data.user = sessionData;
        }
        next();
      } catch (error) {
        console.error('WebSocket auth error:', error);
        next();
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`WebSocket connected: ${socket.id}`, socket.data.user?.username || 'anonymous');

      // Market room management
      socket.on('join_market', (marketId: string) => {
        socket.join(`market_${marketId}`);
        console.log(`User ${socket.id} joined market ${marketId}`);
      });

      socket.on('leave_market', (marketId: string) => {
        socket.leave(`market_${marketId}`);
        console.log(`User ${socket.id} left market ${marketId}`);
      });

      // User-specific room (for portfolio updates)
      if (socket.data.user) {
        socket.join(`user_${socket.data.user.userId}`);
        
        socket.on('join_portfolio', () => {
          socket.join(`portfolio_${socket.data.user.userId}`);
        });
      }

      // Heartbeat for connection health
      socket.on('ping', () => {
        socket.emit('pong', { timestamp: new Date().toISOString() });
      });

      socket.on('disconnect', (reason) => {
        console.log(`WebSocket disconnected: ${socket.id}, reason: ${reason}`);
      });
    });
  }

  // Market update broadcasts
  async broadcastMarketUpdate(marketId: string, data: {
    type: 'price_update' | 'trade' | 'volume_update';
    marketId: string;
    outcomeId?: string;
    newPrice?: number;
    newProbability?: number;
    volume?: number;
    tradeInfo?: {
      type: 'buy' | 'sell';
      shares: number;
      price: number;
      userId?: string;
    };
    timestamp: Date;
  }) {
    this.io.to(`market_${marketId}`).emit('market_update', data);
  }

  // User-specific updates
  async notifyUser(userId: string, data: {
    type: 'balance_update' | 'position_update' | 'trade_executed' | 'market_resolved';
    data: any;
    timestamp: Date;
  }) {
    this.io.to(`user_${userId}`).emit('user_notification', data);
  }

  // Portfolio updates
  async broadcastPortfolioUpdate(userId: string, data: {
    totalValue: number;
    pnl: number;
    positions: any[];
    timestamp: Date;
  }) {
    this.io.to(`portfolio_${userId}`).emit('portfolio_update', data);
  }

  // System-wide announcements
  async broadcastSystemMessage(data: {
    type: 'maintenance' | 'announcement' | 'market_created';
    message: string;
    data?: any;
    timestamp: Date;
  }) {
    this.io.emit('system_message', data);
  }

  // Market resolution notifications
  async broadcastMarketResolution(marketId: string, data: {
    marketId: string;
    marketTitle: string;
    winningOutcome: string;
    resolutionNotes?: string;
    payouts?: Array<{
      userId: string;
      amount: number;
    }>;
    timestamp: Date;
  }) {
    // Notify all users in the market room
    this.io.to(`market_${marketId}`).emit('market_resolved', data);

    // Notify specific users who had positions
    if (data.payouts) {
      for (const payout of data.payouts) {
        this.io.to(`user_${payout.userId}`).emit('payout_received', {
          marketId,
          marketTitle: data.marketTitle,
          amount: payout.amount,
          timestamp: data.timestamp,
        });
      }
    }
  }

  // Real-time market statistics
  async broadcastMarketStats(marketId: string, stats: {
    activeTraders: number;
    volumeLast24h: number;
    priceChange24h: number;
    timestamp: Date;
  }) {
    this.io.to(`market_${marketId}`).emit('market_stats', stats);
  }

  // Connection statistics
  getConnectionStats() {
    const connectedSockets = this.io.sockets.sockets.size;
    const rooms = this.io.sockets.adapter.rooms;
    const marketRooms = Array.from(rooms.keys()).filter(room => room.startsWith('market_'));
    
    return {
      totalConnections: connectedSockets,
      marketRooms: marketRooms.length,
      authenticatedUsers: Array.from(this.io.sockets.sockets.values())
        .filter(socket => socket.data.user).length,
    };
  }

  // Clean up inactive connections
  async cleanupConnections() {
    const sockets = await this.io.fetchSockets();
    const now = Date.now();
    
    for (const socket of sockets) {
      // Disconnect sockets that haven't sent a heartbeat in 5 minutes
      const lastSeen = socket.data.lastHeartbeat || socket.handshake.time;
      if (now - lastSeen > 300000) { // 5 minutes
        socket.disconnect(true);
      }
    }
  }
}

export default WebSocketService;