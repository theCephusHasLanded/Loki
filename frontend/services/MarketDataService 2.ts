export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high24h: number;
  low24h: number;
  marketCap?: number;
  timestamp: Date;
}

export interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
}

export interface OrderBook {
  symbol: string;
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  spread: number;
  timestamp: Date;
}

export interface Trade {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  price: number;
  size: number;
  timestamp: Date;
  fee: number;
}

export interface Position {
  id: string;
  symbol: string;
  side: 'long' | 'short';
  size: number;
  entryPrice: number;
  currentPrice: number;
  unrealizedPnl: number;
  realizedPnl: number;
  timestamp: Date;
}

export interface Portfolio {
  totalValue: number;
  totalPnl: number;
  totalPnlPercent: number;
  buyingPower: number;
  marginUsed: number;
  positions: Position[];
  trades: Trade[];
}

class MarketDataService {
  private marketData: Map<string, MarketData> = new Map();
  private orderBooks: Map<string, OrderBook> = new Map();
  private subscribers: Set<(data: MarketData[]) => void> = new Set();
  private portfolio: Portfolio;
  private isRunning = false;

  private readonly SYMBOLS = [
    // Major Indices
    { symbol: 'SPY', basePrice: 589.42, volatility: 0.8 },
    { symbol: 'QQQ', basePrice: 512.18, volatility: 1.2 },
    { symbol: 'IWM', basePrice: 234.76, volatility: 1.5 },
    { symbol: 'VIX', basePrice: 18.45, volatility: 3.0 },
    
    // Crypto
    { symbol: 'BTC', basePrice: 98245, volatility: 2.5 },
    { symbol: 'ETH', basePrice: 3876.50, volatility: 3.0 },
    { symbol: 'SOL', basePrice: 245.67, volatility: 4.0 },
    { symbol: 'ADA', basePrice: 1.23, volatility: 5.0 },
    
    // Tech Giants
    { symbol: 'AAPL', basePrice: 234.85, volatility: 1.1 },
    { symbol: 'GOOGL', basePrice: 189.76, volatility: 1.3 },
    { symbol: 'MSFT', basePrice: 456.78, volatility: 1.0 },
    { symbol: 'AMZN', basePrice: 178.90, volatility: 1.4 },
    { symbol: 'NVDA', basePrice: 892.34, volatility: 2.2 },
    { symbol: 'META', basePrice: 567.89, volatility: 1.6 },
    
    // Growth & EV
    { symbol: 'TSLA', basePrice: 345.12, volatility: 2.8 },
    { symbol: 'RIVN', basePrice: 45.67, volatility: 4.5 },
    { symbol: 'LCID', basePrice: 8.45, volatility: 6.0 },
    
    // Financial
    { symbol: 'JPM', basePrice: 234.56, volatility: 1.2 },
    { symbol: 'BAC', basePrice: 45.67, volatility: 1.4 },
    { symbol: 'GS', basePrice: 567.89, volatility: 1.6 },
    
    // Commodities & Energy
    { symbol: 'GLD', basePrice: 234.56, volatility: 0.9 },
    { symbol: 'USO', basePrice: 89.45, volatility: 2.0 },
    { symbol: 'XLE', basePrice: 98.76, volatility: 1.8 },
    
    // International
    { symbol: 'EWJ', basePrice: 67.89, volatility: 1.3 },
    { symbol: 'FXI', basePrice: 34.56, volatility: 2.2 },
    { symbol: 'EWZ', basePrice: 45.67, volatility: 2.5 },
  ];

  constructor() {
    this.portfolio = {
      totalValue: 1000000, // $1M demo account
      totalPnl: 127450,
      totalPnlPercent: 14.6,
      buyingPower: 500000,
      marginUsed: 350000,
      positions: [],
      trades: []
    };

    this.initializeMarketData();
    this.initializeDemoPositions();
  }

  private initializeMarketData() {
    this.SYMBOLS.forEach(({ symbol, basePrice, volatility }) => {
      const randomChange = (Math.random() - 0.5) * volatility * 2;
      const currentPrice = basePrice * (1 + randomChange / 100);
      const change = currentPrice - basePrice;
      const changePercent = (change / basePrice) * 100;

      this.marketData.set(symbol, {
        symbol,
        price: currentPrice,
        change,
        changePercent,
        volume: Math.floor(Math.random() * 10000000) + 1000000,
        high24h: currentPrice * (1 + Math.random() * 0.05),
        low24h: currentPrice * (1 - Math.random() * 0.05),
        marketCap: symbol.includes('BTC') || symbol.includes('ETH') ? 
          Math.floor(Math.random() * 500000000000) + 100000000000 : undefined,
        timestamp: new Date()
      });

      // Initialize order book
      this.generateOrderBook(symbol, currentPrice);
    });
  }

  private initializeDemoPositions() {
    const samplePositions: Position[] = [
      {
        id: '1',
        symbol: 'BTC',
        side: 'long',
        size: 2.5,
        entryPrice: 95000,
        currentPrice: this.marketData.get('BTC')?.price || 98245,
        unrealizedPnl: 0,
        realizedPnl: 0,
        timestamp: new Date(Date.now() - 86400000) // 1 day ago
      },
      {
        id: '2',
        symbol: 'ETH',
        side: 'long',
        size: 15.0,
        entryPrice: 3700,
        currentPrice: this.marketData.get('ETH')?.price || 3876,
        unrealizedPnl: 0,
        realizedPnl: 0,
        timestamp: new Date(Date.now() - 172800000) // 2 days ago
      },
      {
        id: '3',
        symbol: 'AAPL',
        side: 'short',
        size: 100,
        entryPrice: 240,
        currentPrice: this.marketData.get('AAPL')?.price || 234,
        unrealizedPnl: 0,
        realizedPnl: 0,
        timestamp: new Date(Date.now() - 259200000) // 3 days ago
      },
      {
        id: '4',
        symbol: 'TSLA',
        side: 'long',
        size: 50,
        entryPrice: 320,
        currentPrice: this.marketData.get('TSLA')?.price || 345,
        unrealizedPnl: 0,
        realizedPnl: 0,
        timestamp: new Date(Date.now() - 432000000) // 5 days ago
      },
      {
        id: '5',
        symbol: 'SPY',
        side: 'long',
        size: 200,
        entryPrice: 580,
        currentPrice: this.marketData.get('SPY')?.price || 589,
        unrealizedPnl: 0,
        realizedPnl: 0,
        timestamp: new Date(Date.now() - 604800000) // 1 week ago
      }
    ];

    // Calculate unrealized PnL for each position
    samplePositions.forEach(position => {
      const marketPrice = this.marketData.get(position.symbol)?.price || position.currentPrice;
      position.currentPrice = marketPrice;
      
      if (position.side === 'long') {
        position.unrealizedPnl = (marketPrice - position.entryPrice) * position.size;
      } else {
        position.unrealizedPnl = (position.entryPrice - marketPrice) * position.size;
      }
    });

    this.portfolio.positions = samplePositions;

    // Calculate total PnL
    const totalUnrealizedPnl = samplePositions.reduce((sum, pos) => sum + pos.unrealizedPnl, 0);
    this.portfolio.totalPnl = totalUnrealizedPnl + 50000; // Add some realized PnL
    this.portfolio.totalPnlPercent = (this.portfolio.totalPnl / (this.portfolio.totalValue - this.portfolio.totalPnl)) * 100;
  }

  private generateOrderBook(symbol: string, currentPrice: number) {
    const bids: OrderBookEntry[] = [];
    const asks: OrderBookEntry[] = [];
    
    // Generate 10 bid levels
    for (let i = 0; i < 10; i++) {
      const price = currentPrice - (i + 1) * (currentPrice * 0.001);
      const size = Math.random() * 10 + 1;
      const total = bids.reduce((sum, bid) => sum + bid.size, 0) + size;
      bids.push({ price, size, total });
    }

    // Generate 10 ask levels
    for (let i = 0; i < 10; i++) {
      const price = currentPrice + (i + 1) * (currentPrice * 0.001);
      const size = Math.random() * 10 + 1;
      const total = asks.reduce((sum, ask) => sum + ask.size, 0) + size;
      asks.push({ price, size, total });
    }

    const spread = asks[0].price - bids[0].price;

    this.orderBooks.set(symbol, {
      symbol,
      bids,
      asks,
      spread,
      timestamp: new Date()
    });
  }

  public subscribe(callback: (data: MarketData[]) => void) {
    this.subscribers.add(callback);
    // Send initial data
    callback(Array.from(this.marketData.values()));
  }

  public unsubscribe(callback: (data: MarketData[]) => void) {
    this.subscribers.delete(callback);
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;

    // Update market data every 2 seconds
    setInterval(() => {
      this.updateMarketData();
      this.notifySubscribers();
    }, 2000);

    // Update order books every 500ms
    setInterval(() => {
      this.updateOrderBooks();
    }, 500);

    // Update positions every 1 second
    setInterval(() => {
      this.updatePositions();
    }, 1000);
  }

  public stop() {
    this.isRunning = false;
  }

  private updateMarketData() {
    this.SYMBOLS.forEach(({ symbol, volatility }) => {
      const current = this.marketData.get(symbol);
      if (!current) return;

      // Random price movement
      const randomChange = (Math.random() - 0.5) * volatility * 0.5;
      const newPrice = current.price * (1 + randomChange / 100);
      
      // Ensure price doesn't go negative
      const price = Math.max(0.01, newPrice);
      const change = price - (current.price - current.change); // Relative to original base price
      const changePercent = (change / (current.price - current.change)) * 100;

      // Update volume occasionally
      const volume = Math.random() < 0.1 ? 
        Math.floor(Math.random() * 5000000) + current.volume :
        current.volume;

      this.marketData.set(symbol, {
        ...current,
        price,
        change,
        changePercent,
        volume,
        high24h: Math.max(current.high24h, price),
        low24h: Math.min(current.low24h, price),
        timestamp: new Date()
      });
    });
  }

  private updateOrderBooks() {
    this.marketData.forEach((data, symbol) => {
      this.generateOrderBook(symbol, data.price);
    });
  }

  private updatePositions() {
    this.portfolio.positions.forEach(position => {
      const marketData = this.marketData.get(position.symbol);
      if (!marketData) return;

      position.currentPrice = marketData.price;
      
      if (position.side === 'long') {
        position.unrealizedPnl = (marketData.price - position.entryPrice) * position.size;
      } else {
        position.unrealizedPnl = (position.entryPrice - marketData.price) * position.size;
      }
    });

    // Update portfolio totals
    const totalUnrealizedPnl = this.portfolio.positions.reduce((sum, pos) => sum + pos.unrealizedPnl, 0);
    this.portfolio.totalPnl = totalUnrealizedPnl + 50000; // Add realized PnL
    this.portfolio.totalPnlPercent = (this.portfolio.totalPnl / (this.portfolio.totalValue - this.portfolio.totalPnl)) * 100;
  }

  private notifySubscribers() {
    const data = Array.from(this.marketData.values());
    this.subscribers.forEach(callback => callback(data));
  }

  public getMarketData(symbol?: string): MarketData | MarketData[] | null {
    if (symbol) {
      return this.marketData.get(symbol) || null;
    }
    return Array.from(this.marketData.values());
  }

  public getOrderBook(symbol: string): OrderBook | null {
    return this.orderBooks.get(symbol) || null;
  }

  public getPortfolio(): Portfolio {
    return { ...this.portfolio };
  }

  public placeDemoOrder(symbol: string, side: 'buy' | 'sell', size: number, price?: number): boolean {
    const marketData = this.marketData.get(symbol);
    if (!marketData) return false;

    const executionPrice = price || marketData.price;
    const orderValue = executionPrice * size;
    
    // Check buying power for buys
    if (side === 'buy' && orderValue > this.portfolio.buyingPower) {
      return false;
    }

    // Create trade record
    const trade: Trade = {
      id: Date.now().toString(),
      symbol,
      side,
      price: executionPrice,
      size,
      timestamp: new Date(),
      fee: orderValue * 0.001 // 0.1% fee
    };

    this.portfolio.trades.unshift(trade);

    // Update or create position
    const existingPosition = this.portfolio.positions.find(p => p.symbol === symbol);
    
    if (existingPosition) {
      if (side === 'buy') {
        const totalValue = (existingPosition.entryPrice * existingPosition.size) + (executionPrice * size);
        const totalSize = existingPosition.size + size;
        existingPosition.entryPrice = totalValue / totalSize;
        existingPosition.size = totalSize;
      } else {
        existingPosition.size = Math.max(0, existingPosition.size - size);
        if (existingPosition.size === 0) {
          this.portfolio.positions = this.portfolio.positions.filter(p => p.id !== existingPosition.id);
        }
      }
    } else if (side === 'buy') {
      const newPosition: Position = {
        id: Date.now().toString(),
        symbol,
        side: 'long',
        size,
        entryPrice: executionPrice,
        currentPrice: executionPrice,
        unrealizedPnl: 0,
        realizedPnl: 0,
        timestamp: new Date()
      };
      this.portfolio.positions.push(newPosition);
    }

    // Update buying power
    if (side === 'buy') {
      this.portfolio.buyingPower -= orderValue;
      this.portfolio.marginUsed += orderValue;
    } else {
      this.portfolio.buyingPower += orderValue;
      this.portfolio.marginUsed -= orderValue;
    }

    return true;
  }
}

export const marketDataService = new MarketDataService();