import { Router } from 'express';
import { TradingController } from '../controllers/tradingController';
import { authenticateToken, requireKYC } from '../middleware/auth';
import { validateBody, validateParams, validateQuery } from '../middleware/validation';
import {
  tradeSchema,
  uuidSchema,
  paginationSchema,
} from '../utils/validation-schemas';

const router = Router();

// All trading routes require authentication and KYC
router.use(authenticateToken);
router.use(requireKYC);

// Trading routes
router.post(
  '/markets/:id/trade',
  validateParams(uuidSchema),
  validateBody(tradeSchema),
  TradingController.executeTrade
);

// Portfolio routes
router.get(
  '/positions',
  validateQuery(paginationSchema),
  TradingController.getPositions
);

router.get(
  '/transactions',
  validateQuery(paginationSchema),
  TradingController.getTransactionHistory
);

export { router as tradingRoutes };