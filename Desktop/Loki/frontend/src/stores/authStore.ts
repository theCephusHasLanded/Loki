import { create } from 'zustand';
import { User } from '../types';
import apiClient from '../lib/api';
import wsClient from '../lib/websocket';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiClient.login(email, password);
      
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });

      // Connect WebSocket with authentication
      wsClient.connect(response.accessToken);
      
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Login failed',
        isLoading: false,
      });
      return false;
    }
  },

  register: async (email: string, username: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiClient.register(email, username, password);
      
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });

      // Connect WebSocket with authentication
      wsClient.connect(response.accessToken);
      
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Registration failed',
        isLoading: false,
      });
      return false;
    }
  },

  logout: () => {
    apiClient.logout();
    wsClient.disconnect();
    
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  loadUser: async () => {
    if (!apiClient.isAuthenticated()) {
      return;
    }

    set({ isLoading: true });
    
    try {
      const user = await apiClient.getProfile();
      
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      // Connect WebSocket if not already connected
      if (!wsClient.isConnectedToSocket()) {
        const tokens = apiClient.getStoredTokens();
        if (tokens) {
          wsClient.connect(tokens.accessToken);
        }
      }
    } catch (error) {
      // Token might be invalid, clear auth state
      apiClient.logout();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));