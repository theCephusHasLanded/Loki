import { Request, Response } from 'express';
import { db } from '../index';
import { cacheService } from '../services/cache';
import AuthUtils from '../utils/auth';

export class MarketController {
  static async createMarket(req: any, res: Response) {
    const trx = await db.transaction();
    
    try {
      const { title, description, marketType, endDate, resolutionCriteria, outcomes } = req.body;
      const marketId = AuthUtils.generateId();

      // Create market
      await trx('markets').insert({
        id: marketId,
        title: AuthUtils.sanitizeInput(title),
        description: AuthUtils.sanitizeInput(description),
        market_type: marketType,
        end_date: new Date(endDate),
        resolution_criteria: AuthUtils.sanitizeInput(resolutionCriteria),
        creator_id: req.user.userId,
        status: 'active',
      });

      // Create market outcomes
      const outcomePromises = outcomes.map((outcome: any, index: number) => {
        return trx('market_outcomes').insert({
          id: AuthUtils.generateId(),
          market_id: marketId,
          outcome_text: AuthUtils.sanitizeInput(outcome.text),
          probability: marketType === 'binary' ? 0.5 : (1 / outcomes.length),
          liquidity_shares: 100,
        });
      });

      await Promise.all(outcomePromises);
      await trx.commit();

      // Invalidate cache
      await cacheService.del('markets:active');

      res.status(201).json({
        message: 'Market created successfully',
        marketId,
      });
    } catch (error) {
      await trx.rollback();
      console.error('Create market error:', error);
      res.status(500).json({ error: 'Failed to create market' });
    }
  }

  static async getMarkets(req: Request, res: Response) {
    try {
      const { page = 1, limit = 20, status, marketType, search, sortBy = 'created_at', sortOrder = 'desc' } = req.query as any;
      const offset = (page - 1) * limit;

      // Try cache first
      const cacheKey = `markets:${JSON.stringify(req.query)}`;
      const cachedMarkets = await cacheService.get(cacheKey);
      if (cachedMarkets) {
        return res.json(cachedMarkets);
      }

      let query = db('markets')
        .leftJoin('users', 'markets.creator_id', 'users.id')
        .select(
          'markets.*',
          'users.username as creator_username',
          db.raw('(SELECT COUNT(*) FROM market_outcomes WHERE market_id = markets.id) as outcome_count')
        );

      // Apply filters
      if (status) {
        query = query.where('markets.status', status);
      }
      if (marketType) {
        query = query.where('markets.market_type', marketType);
      }
      if (search) {
        query = query.where(function() {
          this.whereILike('markets.title', `%${search}%`)
              .orWhereILike('markets.description', `%${search}%`);
        });
      }

      // Apply sorting
      const validSortFields = ['created_at', 'total_volume', 'end_date'];
      const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
      query = query.orderBy(`markets.${sortField}`, sortOrder);

      // Apply pagination
      const markets = await query.limit(limit).offset(offset);

      // Get total count
      const [{ count }] = await db('markets')
        .count('* as count')
        .modify(qb => {
          if (status) qb.where('status', status);
          if (marketType) qb.where('market_type', marketType);
          if (search) {
            qb.where(function() {
              this.whereILike('title', `%${search}%`)
                  .orWhereILike('description', `%${search}%`);
            });
          }
        });

      const result = {
        markets: markets.map(market => ({
          id: market.id,
          title: market.title,
          description: market.description,
          marketType: market.market_type,
          endDate: market.end_date,
          status: market.status,
          totalVolume: parseFloat(market.total_volume),
          outcomeCount: parseInt(market.outcome_count),
          creatorUsername: market.creator_username,
          createdAt: market.created_at,
        })),
        pagination: {
          page,
          limit,
          totalItems: parseInt(count),
          totalPages: Math.ceil(parseInt(count) / limit),
        },
      };

      // Cache for 5 minutes
      await cacheService.set(cacheKey, result, 300);

      res.json(result);
    } catch (error) {
      console.error('Get markets error:', error);
      res.status(500).json({ error: 'Failed to get markets' });
    }
  }

  static async getMarketById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Try cache first
      const cacheKey = `market:${id}`;
      const cachedMarket = await cacheService.get(cacheKey);
      if (cachedMarket) {
        return res.json(cachedMarket);
      }

      const market = await db('markets')
        .leftJoin('users', 'markets.creator_id', 'users.id')
        .where('markets.id', id)
        .select(
          'markets.*',
          'users.username as creator_username'
        )
        .first();

      if (!market) {
        return res.status(404).json({ error: 'Market not found' });
      }

      // Get market outcomes
      const outcomes = await db('market_outcomes')
        .where('market_id', id)
        .orderBy('created_at');

      const result = {
        id: market.id,
        title: market.title,
        description: market.description,
        marketType: market.market_type,
        endDate: market.end_date,
        resolutionCriteria: market.resolution_criteria,
        status: market.status,
        totalVolume: parseFloat(market.total_volume),
        liquidityParameter: parseFloat(market.liquidity_parameter),
        creatorUsername: market.creator_username,
        createdAt: market.created_at,
        outcomes: outcomes.map(outcome => ({
          id: outcome.id,
          text: outcome.outcome_text,
          probability: parseFloat(outcome.probability),
          totalVolume: parseFloat(outcome.total_volume),
          totalShares: parseFloat(outcome.total_shares),
        })),
      };

      // Cache for 1 minute
      await cacheService.set(cacheKey, result, 60);

      res.json(result);
    } catch (error) {
      console.error('Get market error:', error);
      res.status(500).json({ error: 'Failed to get market' });
    }
  }

  static async resolveMarket(req: any, res: Response) {
    const trx = await db.transaction();
    
    try {
      const { id } = req.params;
      const { winningOutcomeId, resolutionNotes } = req.body;

      // Check if market exists and is resolvable
      const market = await trx('markets').where({ id }).first();
      if (!market) {
        await trx.rollback();
        return res.status(404).json({ error: 'Market not found' });
      }

      if (market.status !== 'closed') {
        await trx.rollback();
        return res.status(400).json({ error: 'Market must be closed before resolution' });
      }

      // Verify winning outcome exists
      const winningOutcome = await trx('market_outcomes')
        .where({ id: winningOutcomeId, market_id: id })
        .first();

      if (!winningOutcome) {
        await trx.rollback();
        return res.status(400).json({ error: 'Invalid winning outcome' });
      }

      // Update market status
      await trx('markets')
        .where({ id })
        .update({ status: 'resolved' });

      // Create resolution record
      await trx('market_resolutions').insert({
        id: AuthUtils.generateId(),
        market_id: id,
        winning_outcome_id: winningOutcomeId,
        resolved_by: req.user.userId,
        resolution_notes: resolutionNotes,
      });

      // Process payouts (simplified - in production would be more complex)
      const positions = await trx('positions')
        .where({ market_id: id, outcome_id: winningOutcomeId });

      for (const position of positions) {
        const payout = parseFloat(position.shares);
        await trx('users')
          .where({ id: position.user_id })
          .increment('wallet_balance', payout);
      }

      await trx.commit();

      // Invalidate cache
      await cacheService.invalidateMarketCache(id);

      res.json({ message: 'Market resolved successfully' });
    } catch (error) {
      await trx.rollback();
      console.error('Resolve market error:', error);
      res.status(500).json({ error: 'Failed to resolve market' });
    }
  }
}