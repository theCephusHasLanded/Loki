import { Router } from 'express';
import { MarketController } from '../controllers/marketController';
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/auth';
import { validateBody, validateParams, validateQuery } from '../middleware/validation';
import {
  createMarketSchema,
  updateMarketSchema,
  uuidSchema,
  paginationSchema,
  marketFiltersSchema,
  resolveMarketSchema,
} from '../utils/validation-schemas';

const router = Router();

// Public routes (with optional auth for personalization)
router.get(
  '/',
  optionalAuth,
  validateQuery(paginationSchema.merge(marketFiltersSchema)),
  MarketController.getMarkets
);

router.get(
  '/:id',
  optionalAuth,
  validateParams(uuidSchema),
  MarketController.getMarketById
);

// Protected routes
router.post(
  '/',
  authenticateToken,
  validateBody(createMarketSchema),
  MarketController.createMarket
);

// Admin routes
router.put(
  '/:id/resolve',
  authenticateToken,
  requireAdmin,
  validateParams(uuidSchema),
  validateBody(resolveMarketSchema),
  MarketController.resolveMarket
);

export { router as marketRoutes };