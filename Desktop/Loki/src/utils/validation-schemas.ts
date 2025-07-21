import { z } from 'zod';

// User schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// Market schemas
export const createMarketSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be less than 200 characters'),
  description: z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  marketType: z.enum(['binary', 'categorical', 'scalar']),
  endDate: z.string().datetime('Invalid date format'),
  resolutionCriteria: z.string()
    .min(10, 'Resolution criteria must be at least 10 characters')
    .max(1000, 'Resolution criteria must be less than 1000 characters'),
  outcomes: z.array(z.object({
    text: z.string().min(1, 'Outcome text is required').max(100),
  })).min(2, 'Binary markets need exactly 2 outcomes').max(10, 'Maximum 10 outcomes allowed'),
});

export const updateMarketSchema = z.object({
  title: z.string().max(200).optional(),
  description: z.string().max(2000).optional(),
  endDate: z.string().datetime().optional(),
  resolutionCriteria: z.string().max(1000).optional(),
});

// Trading schemas
export const tradeSchema = z.object({
  outcomeId: z.string().uuid('Invalid outcome ID'),
  shares: z.number()
    .positive('Shares must be positive')
    .max(10000, 'Maximum 10,000 shares per trade'),
  maxPrice: z.number()
    .min(0.01, 'Price must be at least 0.01')
    .max(0.99, 'Price must be less than 0.99'),
  tradeType: z.enum(['buy', 'sell']),
});

// Parameter validation schemas
export const uuidSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});

export const paginationSchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform(val => val ? Math.min(parseInt(val, 10), 100) : 20),
  sortBy: z.enum(['created_at', 'volume', 'end_date']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const marketFiltersSchema = z.object({
  status: z.enum(['active', 'closed', 'resolved']).optional(),
  marketType: z.enum(['binary', 'categorical', 'scalar']).optional(),
  creatorId: z.string().uuid().optional(),
  search: z.string().max(100).optional(),
});

// Resolution schemas
export const resolveMarketSchema = z.object({
  winningOutcomeId: z.string().uuid('Invalid outcome ID'),
  resolutionNotes: z.string().max(1000).optional(),
});