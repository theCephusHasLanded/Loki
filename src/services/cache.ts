import redis from '../config/redis';

export class CacheService {
  private readonly DEFAULT_TTL = 3600; // 1 hour

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttl: number = this.DEFAULT_TTL): Promise<boolean> {
    try {
      const serialized = JSON.stringify(value);
      const result = await redis.setex(key, ttl, serialized);
      return result === 'OK';
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      const result = await redis.del(key);
      return result === 1;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  async getMarketPrices(marketId: string) {
    return this.get(`market:${marketId}:prices`);
  }

  async setMarketPrices(marketId: string, prices: any, ttl = 60) {
    return this.set(`market:${marketId}:prices`, prices, ttl);
  }

  async getUserPositions(userId: string) {
    return this.get(`user:${userId}:positions`);
  }

  async setUserPositions(userId: string, positions: any, ttl = 300) {
    return this.set(`user:${userId}:positions`, positions, ttl);
  }

  async invalidateUserCache(userId: string) {
    const keys = [
      `user:${userId}:positions`,
      `user:${userId}:transactions`,
      `user:${userId}:balance`
    ];
    
    for (const key of keys) {
      await this.del(key);
    }
  }

  async invalidateMarketCache(marketId: string) {
    const keys = [
      `market:${marketId}:prices`,
      `market:${marketId}:volume`,
      `market:${marketId}:outcomes`
    ];
    
    for (const key of keys) {
      await this.del(key);
    }
  }
}

export const cacheService = new CacheService();