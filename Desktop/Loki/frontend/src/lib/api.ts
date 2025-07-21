import axios from 'axios';
import { AuthTokens } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class ApiClient {
  private client;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/api/v1`,
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const tokens = localStorage.getItem('constellation_tokens');
          if (tokens) {
            const { accessToken } = JSON.parse(tokens);
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 403 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshed = await this.refreshToken();
            if (refreshed) {
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            this.logout();
            window.location.href = '/login';
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth methods
  async register(email: string, username: string, password: string) {
    const response = await this.client.post('/auth/register', {
      email,
      username,
      password,
    });
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', {
      email,
      password,
    });

    if (response.data.accessToken && response.data.refreshToken) {
      this.storeTokens({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      });
    }

    return response.data;
  }

  async refreshToken() {
    if (typeof window === 'undefined') return false;

    const tokens = localStorage.getItem('constellation_tokens');
    if (!tokens) return false;

    const { refreshToken } = JSON.parse(tokens);
    
    try {
      const response = await this.client.post('/auth/refresh', {
        refreshToken,
      });

      this.storeTokens({
        accessToken: response.data.accessToken,
        refreshToken,
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  async logout() {
    try {
      await this.client.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('constellation_tokens');
      }
    }
  }

  async getProfile() {
    const response = await this.client.get('/auth/profile');
    return response.data;
  }

  // Market methods
  async getMarkets(params = {}) {
    const response = await this.client.get('/markets', { params });
    return response.data;
  }

  async getMarket(id: string) {
    const response = await this.client.get(`/markets/${id}`);
    return response.data;
  }

  async createMarket(marketData: any) {
    const response = await this.client.post('/markets', marketData);
    return response.data;
  }

  // Trading methods
  async executeTrade(marketId: string, tradeData: any) {
    const response = await this.client.post(`/trading/markets/${marketId}/trade`, tradeData);
    return response.data;
  }

  async getPositions(params = {}) {
    const response = await this.client.get('/trading/positions', { params });
    return response.data;
  }

  async getTransactions(params = {}) {
    const response = await this.client.get('/trading/transactions', { params });
    return response.data;
  }

  // Utility methods
  private storeTokens(tokens: AuthTokens) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('constellation_tokens', JSON.stringify(tokens));
    }
  }

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const tokens = localStorage.getItem('constellation_tokens');
    return !!tokens;
  }

  getStoredTokens(): AuthTokens | null {
    if (typeof window === 'undefined') return null;
    const tokens = localStorage.getItem('constellation_tokens');
    return tokens ? JSON.parse(tokens) : null;
  }
}

export const apiClient = new ApiClient();
export default apiClient;