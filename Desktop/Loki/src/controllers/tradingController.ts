import { Request, Response } from 'express';
import { db, io } from '../index';
import { cacheService } from '../services/cache';
import AuthUtils from '../utils/auth';

export class TradingController {
  static async executeTrade(req: any, res: Response) {
    const trx = await db.transaction();
    
    try {
      const { id: marketId } = req.params;
      const { outcomeId, shares, maxPrice, tradeType } = req.body;
      const userId = req.user.userId;

      // Validate market and outcome
      const market = await trx('markets')
        .where({ id: marketId, status: 'active' })
        .first();

      if (!market) {
        await trx.rollback();
        return res.status(404).json({ error: 'Market not found or not active' });
      }

      const outcome = await trx('market_outcomes')
        .where({ id: outcomeId, market_id: marketId })
        .first();

      if (!outcome) {
        await trx.rollback();
        return res.status(404).json({ error: 'Outcome not found' });
      }

      // Get user balance
      const user = await trx('users').where({ id: userId }).first();
      if (!user) {
        await trx.rollback();
        return res.status(404).json({ error: 'User not found' });
      }

      // Calculate trade using simplified CPMM
      const tradeResult = await this.calculateTrade(
        trx,
        marketId,
        outcomeId,
        shares,
        tradeType
      );

      if (!tradeResult) {
        await trx.rollback();
        return res.status(400).json({ error: 'Unable to calculate trade' });
      }

      // Check price limits
      if (tradeResult.price > maxPrice) {
        await trx.rollback();
        return res.status(400).json({ 
          error: 'Trade exceeds maximum price',
          calculatedPrice: tradeResult.price,
          maxPrice,
        });
      }

      // Check user balance for buy orders
      if (tradeType === 'buy' && user.wallet_balance < tradeResult.total) {
        await trx.rollback();
        return res.status(400).json({ error: 'Insufficient balance' });
      }

      // Check user position for sell orders
      if (tradeType === 'sell') {
        const position = await trx('positions')
          .where({ user_id: userId, market_id: marketId, outcome_id: outcomeId })
          .first();

        if (!position || position.shares < shares) {
          await trx.rollback();
          return res.status(400).json({ error: 'Insufficient shares to sell' });
        }
      }

      // Execute trade
      const transactionId = AuthUtils.generateId();
      const transactionHash = AuthUtils.generateTransactionHash();

      // Create transaction record
      await trx('transactions').insert({
        id: transactionId,
        user_id: userId,
        market_id: marketId,
        outcome_id: outcomeId,
        transaction_type: tradeType,
        amount: tradeResult.total,
        shares,
        price: tradeResult.price,
        fee: tradeResult.fee,
        slippage: tradeResult.slippage,
        transaction_hash: transactionHash,
      });

      // Update user balance
      const balanceChange = tradeType === 'buy' ? -tradeResult.total : tradeResult.total;
      await trx('users')
        .where({ id: userId })
        .increment('wallet_balance', balanceChange);

      // Update position
      await this.updatePosition(trx, userId, marketId, outcomeId, shares, tradeResult.price, tradeType);

      // Update market outcomes (liquidity shares)
      await this.updateMarketLiquidity(trx, marketId, outcomeId, shares, tradeType);

      // Update market volume
      await trx('markets')
        .where({ id: marketId })
        .increment('total_volume', tradeResult.amount);

      await trx.commit();

      // Emit real-time update
      io.to(`market_${marketId}`).emit('trade_executed', {
        marketId,
        outcomeId,
        tradeType,
        shares,
        price: tradeResult.price,
        newProbability: tradeResult.newProbability,
        timestamp: new Date(),
      });

      // Invalidate cache
      await cacheService.invalidateMarketCache(marketId);
      await cacheService.invalidateUserCache(userId);

      res.json({
        message: 'Trade executed successfully',
        transactionId,
        transactionHash,
        price: tradeResult.price,
        fee: tradeResult.fee,
        total: tradeResult.total,
        slippage: tradeResult.slippage,
        newProbability: tradeResult.newProbability,
      });
    } catch (error) {
      await trx.rollback();
      console.error('Execute trade error:', error);
      res.status(500).json({ error: 'Failed to execute trade' });
    }
  }

  private static async calculateTrade(
    trx: any,
    marketId: string,
    outcomeId: string,
    shares: number,
    tradeType: 'buy' | 'sell'
  ) {
    try {
      // Get current liquidity shares for all outcomes
      const outcomes = await trx('market_outcomes')
        .where({ market_id: marketId })
        .orderBy('created_at');

      const targetOutcome = outcomes.find((o: any) => o.id === outcomeId);
      if (!targetOutcome) return null;

      // Simplified CPMM calculation
      const currentShares = parseFloat(targetOutcome.liquidity_shares);
      const k = 10000; // Constant product
      
      // Calculate new shares after trade
      const sharesDelta = tradeType === 'buy' ? shares : -shares;
      const newShares = Math.max(currentShares + sharesDelta, 0.01);
      
      // Calculate price based on new probability
      const totalShares = outcomes.reduce((sum: number, o: any) => 
        sum + (o.id === outcomeId ? newShares : parseFloat(o.liquidity_shares)), 0);
      
      const newProbability = newShares / totalShares;
      const oldProbability = parseFloat(targetOutcome.probability);
      
      // Price is based on probability change
      const avgPrice = (newProbability + oldProbability) / 2;
      const fee = shares * 0.005; // 0.5% fee
      const amount = shares * avgPrice;
      const total = amount + fee;
      
      const slippage = Math.abs(avgPrice - oldProbability) / oldProbability;

      return {
        price: avgPrice,
        amount,
        fee,
        total,
        slippage,
        newProbability,
      };
    } catch (error) {
      console.error('Calculate trade error:', error);
      return null;
    }
  }

  private static async updatePosition(
    trx: any,
    userId: string,
    marketId: string,
    outcomeId: string,
    shares: number,
    price: number,
    tradeType: 'buy' | 'sell'
  ) {
    const existingPosition = await trx('positions')
      .where({ user_id: userId, market_id: marketId, outcome_id: outcomeId })
      .first();

    if (existingPosition) {
      if (tradeType === 'buy') {
        // Update existing position
        const newShares = parseFloat(existingPosition.shares) + shares;
        const totalInvestment = parseFloat(existingPosition.total_investment) + (shares * price);
        const newAvgPrice = totalInvestment / newShares;

        await trx('positions')
          .where({ user_id: userId, market_id: marketId, outcome_id: outcomeId })
          .update({
            shares: newShares,
            avg_price: newAvgPrice,
            total_investment: totalInvestment,
          });
      } else {
        // Sell - reduce position
        const newShares = parseFloat(existingPosition.shares) - shares;
        if (newShares <= 0) {
          await trx('positions')
            .where({ user_id: userId, market_id: marketId, outcome_id: outcomeId })
            .del();
        } else {
          await trx('positions')
            .where({ user_id: userId, market_id: marketId, outcome_id: outcomeId })
            .update({ shares: newShares });
        }
      }
    } else if (tradeType === 'buy') {
      // Create new position
      await trx('positions').insert({
        id: AuthUtils.generateId(),
        user_id: userId,
        market_id: marketId,
        outcome_id: outcomeId,
        shares,
        avg_price: price,
        total_investment: shares * price,
      });
    }
  }

  private static async updateMarketLiquidity(
    trx: any,
    marketId: string,
    outcomeId: string,
    shares: number,
    tradeType: 'buy' | 'sell'
  ) {
    const sharesChange = tradeType === 'buy' ? shares : -shares;
    
    await trx('market_outcomes')
      .where({ market_id: marketId, id: outcomeId })
      .increment('liquidity_shares', sharesChange)
      .increment('total_shares', Math.abs(sharesChange))
      .increment('total_volume', shares * 0.5); // Approximate volume

    // Recalculate probabilities for all outcomes
    const outcomes = await trx('market_outcomes')
      .where({ market_id: marketId });

    const totalLiquidity = outcomes.reduce((sum: number, o: any) => 
      sum + parseFloat(o.liquidity_shares), 0);

    for (const outcome of outcomes) {
      const newProbability = parseFloat(outcome.liquidity_shares) / totalLiquidity;
      await trx('market_outcomes')
        .where({ id: outcome.id })
        .update({ probability: newProbability });
    }
  }

  static async getPositions(req: any, res: Response) {
    try {
      const userId = req.user.userId;
      const { page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;

      const positions = await db('positions')
        .join('markets', 'positions.market_id', 'markets.id')
        .join('market_outcomes', 'positions.outcome_id', 'market_outcomes.id')
        .where('positions.user_id', userId)
        .select(
          'positions.*',
          'markets.title as market_title',
          'markets.status as market_status',
          'market_outcomes.outcome_text',
          'market_outcomes.probability'
        )
        .orderBy('positions.created_at', 'desc')
        .limit(limit)
        .offset(offset);

      const formattedPositions = positions.map(position => ({
        id: position.id,
        marketId: position.market_id,
        marketTitle: position.market_title,
        marketStatus: position.market_status,
        outcomeText: position.outcome_text,
        shares: parseFloat(position.shares),
        avgPrice: parseFloat(position.avg_price),
        totalInvestment: parseFloat(position.total_investment),
        currentPrice: parseFloat(position.probability),
        currentValue: parseFloat(position.shares) * parseFloat(position.probability),
        pnl: (parseFloat(position.shares) * parseFloat(position.probability)) - parseFloat(position.total_investment),
        createdAt: position.created_at,
      }));

      res.json({ positions: formattedPositions });
    } catch (error) {
      console.error('Get positions error:', error);
      res.status(500).json({ error: 'Failed to get positions' });
    }
  }

  static async getTransactionHistory(req: any, res: Response) {
    try {
      const userId = req.user.userId;
      const { page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;

      const transactions = await db('transactions')
        .join('markets', 'transactions.market_id', 'markets.id')
        .join('market_outcomes', 'transactions.outcome_id', 'market_outcomes.id')
        .where('transactions.user_id', userId)
        .select(
          'transactions.*',
          'markets.title as market_title',
          'market_outcomes.outcome_text'
        )
        .orderBy('transactions.created_at', 'desc')
        .limit(limit)
        .offset(offset);

      const formattedTransactions = transactions.map(tx => ({
        id: tx.id,
        marketId: tx.market_id,
        marketTitle: tx.market_title,
        outcomeText: tx.outcome_text,
        type: tx.transaction_type,
        shares: parseFloat(tx.shares),
        price: parseFloat(tx.price),
        amount: parseFloat(tx.amount),
        fee: parseFloat(tx.fee),
        slippage: parseFloat(tx.slippage),
        transactionHash: tx.transaction_hash,
        createdAt: tx.created_at,
      }));

      res.json({ transactions: formattedTransactions });
    } catch (error) {
      console.error('Get transactions error:', error);
      res.status(500).json({ error: 'Failed to get transactions' });
    }
  }
}