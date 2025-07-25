export interface User {
  id: string;
  email: string;
  username: string;
  walletBalance: number;
  kycStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Market {
  id: string;
  title: string;
  description: string;
  marketType: 'binary' | 'categorical' | 'scalar';
  endDate: string;
  resolutionCriteria: string;
  status: 'active' | 'closed' | 'resolved';
  totalVolume: number;
  outcomeCount: number;
  creatorUsername: string;
  createdAt: string;
  outcomes?: MarketOutcome[];
}

export interface MarketOutcome {
  id: string;
  text: string;
  probability: number;
  totalVolume: number;
  totalShares: number;
}

export interface Position {
  id: string;
  marketId: string;
  marketTitle: string;
  marketStatus: string;
  outcomeText: string;
  shares: number;
  avgPrice: number;
  totalInvestment: number;
  currentPrice: number;
  currentValue: number;
  pnl: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  marketId: string;
  marketTitle: string;
  outcomeText: string;
  type: 'buy' | 'sell';
  shares: number;
  price: number;
  amount: number;
  fee: number;
  slippage: number;
  transactionHash: string;
  createdAt: string;
}

export interface TradeRequest {
  outcomeId: string;
  shares: number;
  maxPrice: number;
  tradeType: 'buy' | 'sell';
}

export interface TradeResult {
  transactionId: string;
  transactionHash: string;
  price: number;
  fee: number;
  total: number;
  slippage: number;
  newProbability: number;
}

export interface WSMessage {
  type: string;
  data: any;
  timestamp: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}