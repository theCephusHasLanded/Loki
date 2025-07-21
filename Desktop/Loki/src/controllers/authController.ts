import { Request, Response } from 'express';
import { db } from '../index';
import { sessionService } from '../services/session';
import AuthUtils from '../utils/auth';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, username, password } = req.body;

      // Check if user already exists
      const existingUser = await db('users')
        .where({ email })
        .orWhere({ username })
        .first();

      if (existingUser) {
        return res.status(409).json({
          error: existingUser.email === email 
            ? 'Email already registered' 
            : 'Username already taken'
        });
      }

      // Hash password and create user
      const passwordHash = await AuthUtils.hashPassword(password);
      const userId = AuthUtils.generateId();

      await db('users').insert({
        id: userId,
        email: AuthUtils.sanitizeInput(email),
        username: AuthUtils.sanitizeInput(username),
        password_hash: passwordHash,
        wallet_balance: 1000.00, // Starting balance
        kyc_status: 'pending',
      });

      // Create session
      const clientInfo = AuthUtils.getClientInfo(req);
      const { accessToken, refreshToken } = await sessionService.createSession({
        userId,
        username,
        email,
        ...clientInfo,
      });

      res.status(201).json({
        message: 'User registered successfully',
        user: { id: userId, email, username },
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await db('users')
        .where({ email })
        .andWhere({ is_active: true })
        .first();

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Verify password
      const isValidPassword = await AuthUtils.comparePassword(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Create session
      const clientInfo = AuthUtils.getClientInfo(req);
      const { accessToken, refreshToken } = await sessionService.createSession({
        userId: user.id,
        username: user.username,
        email: user.email,
        ...clientInfo,
      });

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          walletBalance: parseFloat(user.wallet_balance),
          kycStatus: user.kyc_status,
        },
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      const result = await sessionService.refreshAccessToken(refreshToken);
      if (!result) {
        return res.status(403).json({ error: 'Invalid refresh token' });
      }

      res.json({
        accessToken: result.accessToken,
        user: {
          id: result.sessionData.userId,
          email: result.sessionData.email,
          username: result.sessionData.username,
        },
      });
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(500).json({ error: 'Token refresh failed' });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];

      if (token) {
        const sessionData = await sessionService.validateAccessToken(token);
        if (sessionData) {
          // Extract session ID from token and destroy session
          // This is simplified - in production you'd decode the JWT to get sessionId
          await sessionService.destroyAllUserSessions(sessionData.userId);
        }
      }

      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ error: 'Logout failed' });
    }
  }

  static async getProfile(req: any, res: Response) {
    try {
      const user = await db('users')
        .where({ id: req.user.userId })
        .select('id', 'email', 'username', 'wallet_balance', 'kyc_status', 'created_at')
        .first();

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        id: user.id,
        email: user.email,
        username: user.username,
        walletBalance: parseFloat(user.wallet_balance),
        kycStatus: user.kyc_status,
        createdAt: user.created_at,
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Failed to get profile' });
    }
  }
}