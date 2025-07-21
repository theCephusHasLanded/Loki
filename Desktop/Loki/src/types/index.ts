export interface User {
  id: string;
  email: string;
  username: string;
  walletBalance: number;
  createdAt: Date;
  kycStatus: 'pending' | 'approved' | 'rejected';
}

export interface Market {
  id: string;
  title: string;
  description: string;
  marketType: 'binary' | 'categorical' | 'scalar';
  endDate: Date;
  resolutionCriteria: string;
  creatorId: string;
  totalVolume: number;
  status: 'active' | 'closed' | 'resolved';
  createdAt: Date;
}

export interface MarketOutcome {
  id: string;
  marketId: string;
  outcomeText: string;
  probability: number;
  totalVolume: number;
  totalShares: number;
}

export interface Position {
  id: string;
  userId: string;
  marketId: string;
  outcomeId: string;
  shares: number;
  avgPrice: number;
  currentValue: number;
  pnl: number;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  marketId: string;
  outcomeId: string;
  transactionType: 'buy' | 'sell';
  amount: number;
  shares: number;
  price: number;
  fee: number;
  createdAt: Date;
}

export interface MarketResolution {
  id: string;
  marketId: string;
  winningOutcomeId: string;
  resolvedAt: Date;
  resolutionData: Record<string, any>;
}

export interface TradeRequest {
  marketId: string;
  outcomeId: string;
  shares: number;
  maxPrice: number;
  tradeType: 'buy' | 'sell';
}

export interface PriceCalculation {
  price: number;
  shares: number;
  fee: number;
  total: number;
  slippage: number;
  newProbability: number;
}

export interface WSMessage {
  type: 'market_update' | 'position_update' | 'new_market' | 'market_resolved';
  data: any;
  timestamp: Date;
}

export interface AstronomicalEvent {
  eventType: string;
  date: Date;
  description: string;
  significance: number;
  celestialBodies: string[];
}

export interface WatsonAnalysis {
  confidence: number;
  predictions: Array<{
    outcome: string;
    probability: number;
    reasoning: string;
  }>;
  patterns: string[];
  timestamp: Date;
}