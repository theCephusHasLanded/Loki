import { Request, Response, NextFunction } from 'express';
import { sessionService, SessionData } from '../backend-services/session';

export interface AuthenticatedRequest extends Request {
  user?: SessionData;
  sessionId?: string;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Access token required' 
      });
    }

    const sessionData = await sessionService.validateAccessToken(token);
    
    if (!sessionData) {
      return res.status(403).json({ 
        error: 'Invalid or expired token' 
      });
    }

    req.user = sessionData;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const sessionData = await sessionService.validateAccessToken(token);
      req.user = sessionData || undefined;
    }

    next();
  } catch (error) {
    console.error('Optional auth error:', error);
    next();
  }
};

export const requireKYC = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Note: We'd need to fetch full user data from DB to check KYC status
  // This is a simplified version
  next();
};

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Note: We'd need to add admin role to user data
  // This is a placeholder for admin check
  next();
};