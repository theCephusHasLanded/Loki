import { create } from 'zustand';
import { Market, Position, Transaction } from '../types';
import apiClient from '../lib/api';
import wsClient from '../lib/websocket';

interface MarketState {
  markets: Market[];
  currentMarket: Market | null;
  positions: Position[];
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadMarkets: (filters?: any) => Promise<void>;
  loadMarket: (id: string) => Promise<void>;
  loadPositions: () => Promise<void>;
  loadTransactions: () => Promise<void>;
  executeTrade: (marketId: string, tradeData: any) => Promise<boolean>;
  createMarket: (marketData: any) => Promise<boolean>;
  clearError: () => void;
  
  // Real-time updates
  subscribeToMarket: (marketId: string) => void;
  unsubscribeFromMarket: (marketId: string) => void;
}

export const useMarketStore = create<MarketState>((set, get) => ({
  markets: [],
  currentMarket: null,
  positions: [],
  transactions: [],
  isLoading: false,
  error: null,

  loadMarkets: async (filters = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiClient.getMarkets(filters);
      set({
        markets: response.markets,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to load markets',
        isLoading: false,
      });
    }
  },

  loadMarket: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const market = await apiClient.getMarket(id);
      set({
        currentMarket: market,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to load market',
        isLoading: false,
      });
    }
  },

  loadPositions: async () => {
    try {
      const response = await apiClient.getPositions();
      set({ positions: response.positions });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to load positions',
      });
    }
  },

  loadTransactions: async () => {
    try {
      const response = await apiClient.getTransactions();
      set({ transactions: response.transactions });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to load transactions',
      });
    }
  },

  executeTrade: async (marketId: string, tradeData: any) => {
    set({ isLoading: true, error: null });
    
    try {
      await apiClient.executeTrade(marketId, tradeData);
      
      // Reload positions and current market
      await get().loadPositions();
      if (get().currentMarket?.id === marketId) {
        await get().loadMarket(marketId);
      }
      
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Trade execution failed',
        isLoading: false,
      });
      return false;
    }
  },

  createMarket: async (marketData: any) => {
    set({ isLoading: true, error: null });
    
    try {
      await apiClient.createMarket(marketData);
      
      // Reload markets list
      await get().loadMarkets();
      
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Market creation failed',
        isLoading: false,
      });
      return false;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  subscribeToMarket: (marketId: string) => {
    wsClient.joinMarket(marketId);
    
    // Set up real-time market update listeners
    wsClient.on('market_update', (data: any) => {
      if (data.marketId === marketId) {
        const { currentMarket } = get();
        if (currentMarket && currentMarket.id === marketId) {
          // Update current market with new data
          set({
            currentMarket: {
              ...currentMarket,
              // Update based on data type
              outcomes: currentMarket.outcomes?.map(outcome => 
                outcome.id === data.outcomeId 
                  ? { ...outcome, probability: data.newProbability }
                  : outcome
              ),
            },
          });
        }
      }
    });

    wsClient.on('trade_executed', (data: any) => {
      if (data.marketId === marketId) {
        // Refresh market data after trade
        get().loadMarket(marketId);
      }
    });
  },

  unsubscribeFromMarket: (marketId: string) => {
    wsClient.leaveMarket(marketId);
  },
}));