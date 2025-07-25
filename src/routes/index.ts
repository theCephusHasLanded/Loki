import { Router } from 'express';
import { authRoutes } from './auth';
import { marketRoutes } from './markets';
import { tradingRoutes } from './trading';

const router = Router();

// API version prefix
const API_VERSION = '/api/v1';

// Route mounting
router.use(`${API_VERSION}/auth`, authRoutes);
router.use(`${API_VERSION}/markets`, marketRoutes);
router.use(`${API_VERSION}/trading`, tradingRoutes);

// Health check
router.get(`${API_VERSION}/health`, (req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

export { router as apiRoutes };