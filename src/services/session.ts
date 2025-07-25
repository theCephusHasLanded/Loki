import redis from '../config/redis';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export interface SessionData {
  userId: string;
  username: string;
  email: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  expiresAt: Date;
}

export class SessionService {
  private readonly ACCESS_TOKEN_TTL = 15 * 60; // 15 minutes
  private readonly REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60; // 7 days
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'default-secret';
  private readonly REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';

  async createSession(sessionData: Omit<SessionData, 'createdAt' | 'expiresAt'>): Promise<{
    accessToken: string;
    refreshToken: string;
    sessionId: string;
  }> {
    const sessionId = uuidv4();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.REFRESH_TOKEN_TTL * 1000);

    const fullSessionData: SessionData = {
      ...sessionData,
      createdAt: now,
      expiresAt,
    };

    // Store session in Redis
    await redis.setex(
      `session:${sessionId}`,
      this.REFRESH_TOKEN_TTL,
      JSON.stringify(fullSessionData)
    );

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: sessionData.userId, sessionId },
      this.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: sessionData.userId, sessionId },
      this.REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Store refresh token mapping
    await redis.setex(
      `refresh:${refreshToken}`,
      this.REFRESH_TOKEN_TTL,
      sessionId
    );

    return { accessToken, refreshToken, sessionId };
  }

  async validateAccessToken(token: string): Promise<SessionData | null> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as any;
      const sessionData = await this.getSession(decoded.sessionId);
      
      if (!sessionData || new Date() > new Date(sessionData.expiresAt)) {
        return null;
      }

      return sessionData;
    } catch (error) {
      return null;
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    sessionData: SessionData;
  } | null> {
    try {
      // Verify refresh token
      jwt.verify(refreshToken, this.REFRESH_SECRET);
      
      // Get session ID from refresh token
      const sessionId = await redis.get(`refresh:${refreshToken}`);
      if (!sessionId) return null;

      // Get session data
      const sessionData = await this.getSession(sessionId);
      if (!sessionData || new Date() > new Date(sessionData.expiresAt)) {
        return null;
      }

      // Generate new access token
      const accessToken = jwt.sign(
        { userId: sessionData.userId, sessionId },
        this.JWT_SECRET,
        { expiresIn: '15m' }
      );

      return { accessToken, sessionData };
    } catch (error) {
      return null;
    }
  }

  async getSession(sessionId: string): Promise<SessionData | null> {
    try {
      const sessionJson = await redis.get(`session:${sessionId}`);
      return sessionJson ? JSON.parse(sessionJson) : null;
    } catch (error) {
      return null;
    }
  }

  async destroySession(sessionId: string): Promise<boolean> {
    try {
      // Get session to find refresh tokens
      const sessionData = await this.getSession(sessionId);
      if (!sessionData) return false;

      // Remove session
      await redis.del(`session:${sessionId}`);

      // Find and remove all refresh tokens for this session
      const keys = await redis.keys(`refresh:*`);
      for (const key of keys) {
        const storedSessionId = await redis.get(key);
        if (storedSessionId === sessionId) {
          await redis.del(key);
        }
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  async destroyAllUserSessions(userId: string): Promise<void> {
    try {
      const keys = await redis.keys(`session:*`);
      
      for (const key of keys) {
        const sessionJson = await redis.get(key);
        if (sessionJson) {
          const session = JSON.parse(sessionJson);
          if (session.userId === userId) {
            const sessionId = key.replace('session:', '');
            await this.destroySession(sessionId);
          }
        }
      }
    } catch (error) {
      console.error('Error destroying user sessions:', error);
    }
  }

  async cleanExpiredSessions(): Promise<void> {
    try {
      const keys = await redis.keys(`session:*`);
      const now = new Date();
      
      for (const key of keys) {
        const sessionJson = await redis.get(key);
        if (sessionJson) {
          const session = JSON.parse(sessionJson);
          if (new Date(session.expiresAt) <= now) {
            const sessionId = key.replace('session:', '');
            await this.destroySession(sessionId);
          }
        }
      }
    } catch (error) {
      console.error('Error cleaning expired sessions:', error);
    }
  }
}

export const sessionService = new SessionService();