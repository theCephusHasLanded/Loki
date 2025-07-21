import { io, Socket } from 'socket.io-client';
import { WSMessage } from '../types';

class WebSocketClient {
  private socket: Socket | null = null;
  private isConnected = false;
  private listeners = new Map<string, Function[]>();

  connect(token?: string) {
    if (this.socket?.connected) return;

    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000';

    this.socket = io(WS_URL, {
      auth: token ? { token } : {},
      transports: ['websocket', 'polling'],
      upgrade: true,
      rememberUpgrade: true,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.isConnected = true;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    // Set up message listeners
    this.socket.on('market_update', (data: WSMessage) => {
      this.emit('market_update', data);
    });

    this.socket.on('user_notification', (data: WSMessage) => {
      this.emit('user_notification', data);
    });

    this.socket.on('portfolio_update', (data: WSMessage) => {
      this.emit('portfolio_update', data);
    });

    this.socket.on('system_message', (data: WSMessage) => {
      this.emit('system_message', data);
    });

    this.socket.on('market_resolved', (data: WSMessage) => {
      this.emit('market_resolved', data);
    });

    this.socket.on('trade_executed', (data: WSMessage) => {
      this.emit('trade_executed', data);
    });

    this.socket.on('payout_received', (data: WSMessage) => {
      this.emit('payout_received', data);
    });

    // Heartbeat
    setInterval(() => {
      if (this.socket?.connected) {
        this.socket.emit('ping');
      }
    }, 30000);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Market room management
  joinMarket(marketId: string) {
    if (this.socket?.connected) {
      this.socket.emit('join_market', marketId);
    }
  }

  leaveMarket(marketId: string) {
    if (this.socket?.connected) {
      this.socket.emit('leave_market', marketId);
    }
  }

  // Portfolio updates
  joinPortfolio() {
    if (this.socket?.connected) {
      this.socket.emit('join_portfolio');
    }
  }

  // Event listener management
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  off(event: string, callback: Function) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  // Utility methods
  isConnectedToSocket(): boolean {
    return this.isConnected && !!this.socket?.connected;
  }

  getConnectionId(): string | undefined {
    return this.socket?.id;
  }
}

export const wsClient = new WebSocketClient();
export default wsClient;