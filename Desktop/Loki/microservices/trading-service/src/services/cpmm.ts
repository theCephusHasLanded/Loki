import Decimal from 'decimal.js';
import { logger } from '../utils/logger';

export interface MarketOutcome {
  id: string;
  marketId: string;
  outcomeText: string;
  liquidityShares: Decimal;
  totalShares: Decimal;
  probability: Decimal;
}

export interface TradeCalculation {
  price: Decimal;
  fee: Decimal;
  total: Decimal;
  slippage: Decimal;
  newProbability: Decimal;
  priceImpact: Decimal;
}

export class CPMMEngine {
  private readonly FEE_RATE = new Decimal(0.005); // 0.5%
  private readonly MIN_LIQUIDITY = new Decimal(0.01);
  private readonly MAX_SLIPPAGE = new Decimal(0.10); // 10%

  /**
   * Calculate trade using Constant Product Market Maker formula
   * Uses the formula: x * y = k (constant product)
   * Where x and y are the liquidity shares of different outcomes
   */
  calculateTrade(
    outcomes: MarketOutcome[],
    targetOutcomeId: string,
    shares: Decimal,
    tradeType: 'buy' | 'sell'
  ): TradeCalculation | null {
    try {
      const targetOutcome = outcomes.find(o => o.id === targetOutcomeId);
      if (!targetOutcome) {
        throw new Error('Target outcome not found');
      }

      // Get current state
      const currentShares = targetOutcome.liquidityShares;
      const currentProbability = targetOutcome.probability;

      // Calculate constant product (k)
      const k = this.calculateConstantProduct(outcomes);
      
      // Calculate new shares after trade
      let newShares: Decimal;
      if (tradeType === 'buy') {
        newShares = currentShares.plus(shares);
      } else {
        if (currentShares.lessThanOrEqualTo(shares)) {
          throw new Error('Insufficient liquidity for sell order');
        }
        newShares = currentShares.minus(shares);
      }

      // Ensure minimum liquidity
      if (newShares.lessThan(this.MIN_LIQUIDITY)) {
        throw new Error('Trade would result in insufficient liquidity');
      }

      // Calculate new probabilities based on new share distribution
      const totalLiquidity = outcomes.reduce((sum, outcome) => {
        if (outcome.id === targetOutcomeId) {
          return sum.plus(newShares);
        }
        return sum.plus(outcome.liquidityShares);
      }, new Decimal(0));

      const newProbability = newShares.dividedBy(totalLiquidity);

      // Calculate average price (area under the curve)
      const avgPrice = this.calculateAveragePrice(currentProbability, newProbability);
      
      // Calculate total cost before fees
      const cost = shares.times(avgPrice);
      
      // Calculate fees
      const fee = cost.times(this.FEE_RATE);
      
      // Calculate total cost including fees
      const total = tradeType === 'buy' ? cost.plus(fee) : cost.minus(fee);

      // Calculate slippage
      const slippage = newProbability.minus(currentProbability).dividedBy(currentProbability).abs();
      
      // Check slippage limits
      if (slippage.greaterThan(this.MAX_SLIPPAGE)) {
        throw new Error('Trade exceeds maximum allowed slippage');
      }

      // Calculate price impact
      const priceImpact = avgPrice.minus(currentProbability).dividedBy(currentProbability).abs();

      return {
        price: avgPrice,
        fee,
        total,
        slippage,
        newProbability,
        priceImpact
      };

    } catch (error) {
      logger.error('CPMM calculation error:', error);
      return null;
    }
  }

  /**
   * Calculate the constant product (k) for the market
   */
  private calculateConstantProduct(outcomes: MarketOutcome[]): Decimal {
    return outcomes.reduce((product, outcome) => {
      return product.times(outcome.liquidityShares);
    }, new Decimal(1));
  }

  /**
   * Calculate average price over the trade range
   * This represents the area under the price curve
   */
  private calculateAveragePrice(oldProbability: Decimal, newProbability: Decimal): Decimal {
    // Simple linear approximation for now
    // In production, this could use more sophisticated integration
    return oldProbability.plus(newProbability).dividedBy(2);
  }

  /**
   * Update market liquidity after a trade
   */
  updateMarketLiquidity(
    outcomes: MarketOutcome[],
    targetOutcomeId: string,
    sharesChange: Decimal,
    operation: 'add' | 'remove'
  ): MarketOutcome[] {
    const updatedOutcomes = outcomes.map(outcome => {
      if (outcome.id === targetOutcomeId) {
        let newLiquidityShares: Decimal;
        
        if (operation === 'add') {
          newLiquidityShares = outcome.liquidityShares.plus(sharesChange);
        } else {
          newLiquidityShares = outcome.liquidityShares.minus(sharesChange);
          if (newLiquidityShares.lessThan(this.MIN_LIQUIDITY)) {
            newLiquidityShares = this.MIN_LIQUIDITY;
          }
        }

        return {
          ...outcome,
          liquidityShares: newLiquidityShares,
          totalShares: outcome.totalShares.plus(sharesChange.abs())
        };
      }
      return outcome;
    });

    // Recalculate probabilities
    const totalLiquidity = updatedOutcomes.reduce((sum, outcome) => 
      sum.plus(outcome.liquidityShares), new Decimal(0));

    return updatedOutcomes.map(outcome => ({
      ...outcome,
      probability: outcome.liquidityShares.dividedBy(totalLiquidity)
    }));
  }

  /**
   * Validate trade parameters
   */
  validateTrade(
    shares: Decimal,
    maxPrice: Decimal,
    tradeType: 'buy' | 'sell'
  ): { valid: boolean; error?: string } {
    if (shares.lessThanOrEqualTo(0)) {
      return { valid: false, error: 'Shares must be positive' };
    }

    if (shares.greaterThan(10000)) {
      return { valid: false, error: 'Trade size exceeds maximum limit' };
    }

    if (maxPrice.lessThanOrEqualTo(0) || maxPrice.greaterThanOrEqualTo(1)) {
      return { valid: false, error: 'Price must be between 0 and 1' };
    }

    return { valid: true };
  }

  /**
   * Calculate position value based on current market probability
   */
  calculatePositionValue(shares: Decimal, currentProbability: Decimal): Decimal {
    return shares.times(currentProbability);
  }

  /**
   * Calculate profit and loss for a position
   */
  calculatePnL(
    shares: Decimal,
    avgPrice: Decimal,
    currentProbability: Decimal,
    totalInvestment: Decimal
  ): Decimal {
    const currentValue = this.calculatePositionValue(shares, currentProbability);
    return currentValue.minus(totalInvestment);
  }
}