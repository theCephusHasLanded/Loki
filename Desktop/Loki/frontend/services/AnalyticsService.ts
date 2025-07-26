export interface PerformanceMetric {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  trend: number[]; // For sparkline charts
}

export interface RiskMetric {
  sharpeRatio: number;
  maxDrawdown: number;
  volatility: number;
  beta: number;
  var95: number; // Value at Risk 95%
  winRate: number;
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  symbol?: string;
  isRead: boolean;
}

export interface TimeSeriesData {
  timestamp: Date;
  value: number;
}

export interface AnalyticsData {
  performanceMetrics: PerformanceMetric[];
  riskMetrics: RiskMetric;
  alerts: Alert[];
  portfolioTimeSeries: TimeSeriesData[];
  correlationMatrix: { [symbol: string]: { [symbol: string]: number } };
}

class AnalyticsService {
  private alerts: Alert[] = [];
  private portfolioHistory: TimeSeriesData[] = [];
  private correlationData: { [symbol: string]: { [symbol: string]: number } } = {};

  constructor() {
    this.initializeData();
    this.generateAlerts();
  }

  private initializeData() {
    // Generate 30 days of portfolio history
    const now = new Date();
    const startValue = 850000; // Starting portfolio value
    let currentValue = startValue;

    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      
      // Add some realistic volatility
      const dailyReturn = (Math.random() - 0.48) * 0.03; // Slightly positive bias
      currentValue *= (1 + dailyReturn);
      
      this.portfolioHistory.push({
        timestamp: date,
        value: currentValue
      });
    }

    // Generate correlation matrix for major assets
    const symbols = ['BTC', 'ETH', 'SPY', 'QQQ', 'AAPL', 'TSLA', 'NVDA', 'MSFT'];
    symbols.forEach(symbol1 => {
      this.correlationData[symbol1] = {};
      symbols.forEach(symbol2 => {
        if (symbol1 === symbol2) {
          this.correlationData[symbol1][symbol2] = 1.0;
        } else {
          // Generate realistic correlations
          let correlation = Math.random() * 0.6 + 0.2; // 0.2 to 0.8
          
          // Higher correlations for similar asset classes
          if ((symbol1.includes('BTC') || symbol1.includes('ETH')) && 
              (symbol2.includes('BTC') || symbol2.includes('ETH'))) {
            correlation = Math.random() * 0.3 + 0.6; // 0.6 to 0.9
          }
          
          if (['SPY', 'QQQ', 'AAPL', 'MSFT', 'NVDA'].includes(symbol1) &&
              ['SPY', 'QQQ', 'AAPL', 'MSFT', 'NVDA'].includes(symbol2)) {
            correlation = Math.random() * 0.3 + 0.5; // 0.5 to 0.8
          }

          this.correlationData[symbol1][symbol2] = Number(correlation.toFixed(3));
        }
      });
    });
  }

  private generateAlerts() {
    const alertTemplates = [
      {
        type: 'critical' as const,
        title: 'Position Risk Alert',
        message: 'BTC position approaching stop loss at $92,000',
        symbol: 'BTC'
      },
      {
        type: 'warning' as const,
        title: 'Correlation Warning',
        message: 'High correlation detected between AAPL and MSFT positions (0.847)',
        symbol: 'AAPL'
      },
      {
        type: 'critical' as const,
        title: 'Margin Alert',
        message: 'Margin utilization above 70% threshold',
        symbol: undefined
      },
      {
        type: 'info' as const,
        title: 'Market Opportunity',
        message: 'SOL showing strong momentum with low RSI divergence',
        symbol: 'SOL'
      },
      {
        type: 'warning' as const,
        title: 'Volatility Alert',
        message: 'VIX spike detected - market volatility increasing',
        symbol: 'VIX'
      },
      {
        type: 'info' as const,
        title: 'Rebalancing Complete',
        message: 'Portfolio rebalancing completed successfully',
        symbol: undefined
      },
      {
        type: 'warning' as const,
        title: 'Drawdown Alert',
        message: 'Portfolio drawdown exceeding 5% threshold',
        symbol: undefined
      },
      {
        type: 'critical' as const,
        title: 'Risk Exposure',
        message: 'Single asset exposure above 25% limit (NVDA: 28%)',
        symbol: 'NVDA'
      },
      {
        type: 'info' as const,
        title: 'Profit Target',
        message: 'ETH position reached 15% profit target',
        symbol: 'ETH'
      },
      {
        type: 'warning' as const,
        title: 'Liquidity Warning',
        message: 'Low liquidity detected in RIVN market depth',
        symbol: 'RIVN'
      }
    ];

    // Generate recent alerts
    this.alerts = alertTemplates.map((template, index) => ({
      id: `alert-${index}`,
      ...template,
      timestamp: new Date(Date.now() - (index * 1800000)), // 30 min intervals
      isRead: Math.random() > 0.6 // 40% read rate
    }));

    // Sort by timestamp (newest first)
    this.alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  public getPerformanceMetrics(): PerformanceMetric[] {
    const latest = this.portfolioHistory[this.portfolioHistory.length - 1];
    const previous = this.portfolioHistory[this.portfolioHistory.length - 8]; // 1 week ago
    const monthAgo = this.portfolioHistory[0];

    const weeklyReturn = ((latest.value - previous.value) / previous.value) * 100;
    const monthlyReturn = ((latest.value - monthAgo.value) / monthAgo.value) * 100;

    // Generate trend data (last 10 points)
    const recentTrend = this.portfolioHistory.slice(-10).map(p => p.value);
    const normalizeTrend = (data: number[]) => {
      const min = Math.min(...data);
      const max = Math.max(...data);
      return data.map(v => ((v - min) / (max - min)) * 100);
    };

    return [
      {
        label: 'Total P&L',
        value: '$127.4K',
        change: '+12.5%',
        isPositive: true,
        trend: normalizeTrend(recentTrend)
      },
      {
        label: 'Weekly Return',
        value: `${weeklyReturn.toFixed(1)}%`,
        change: weeklyReturn > 0 ? `+${Math.abs(weeklyReturn - 2).toFixed(1)}%` : `-${Math.abs(weeklyReturn + 1).toFixed(1)}%`,
        isPositive: weeklyReturn > 0,
        trend: normalizeTrend(this.portfolioHistory.slice(-7).map(p => p.value))
      },
      {
        label: 'Monthly Return',
        value: `${monthlyReturn.toFixed(1)}%`,
        change: monthlyReturn > 0 ? `+${Math.abs(monthlyReturn - 5).toFixed(1)}%` : `-${Math.abs(monthlyReturn + 2).toFixed(1)}%`,
        isPositive: monthlyReturn > 0,
        trend: normalizeTrend(this.portfolioHistory.map(p => p.value))
      },
      {
        label: 'Win Rate',
        value: '68.2%',
        change: '+2.1%',
        isPositive: true,
        trend: [45, 52, 48, 61, 59, 65, 62, 68, 66, 68]
      },
      {
        label: 'Sharpe Ratio',
        value: '2.34',
        change: '+0.15',
        isPositive: true,
        trend: [180, 190, 185, 200, 210, 220, 215, 230, 225, 234]
      },
      {
        label: 'Max Drawdown',
        value: '-8.7%',
        change: '-1.2%',
        isPositive: false,
        trend: [92, 89, 91, 87, 85, 88, 86, 84, 87, 87]
      },
      {
        label: 'Open Positions',
        value: '23',
        change: '+5',
        isPositive: true,
        trend: [15, 16, 18, 17, 19, 20, 18, 21, 22, 23]
      },
      {
        label: 'Daily Volume',
        value: '$2.1M',
        change: '+15.6%',
        isPositive: true,
        trend: [180, 195, 210, 185, 220, 205, 240, 215, 210, 210]
      }
    ];
  }

  public getRiskMetrics(): RiskMetric {
    return {
      sharpeRatio: 2.34,
      maxDrawdown: -8.7,
      volatility: 18.5,
      beta: 1.12,
      var95: -45000, // $45K max loss at 95% confidence
      winRate: 68.2
    };
  }

  public getAlerts(): Alert[] {
    return [...this.alerts];
  }

  public markAlertAsRead(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.isRead = true;
    }
  }

  public getPortfolioTimeSeries(): TimeSeriesData[] {
    return [...this.portfolioHistory];
  }

  public getCorrelationMatrix(): { [symbol: string]: { [symbol: string]: number } } {
    return { ...this.correlationData };
  }

  public getAnalyticsData(): AnalyticsData {
    return {
      performanceMetrics: this.getPerformanceMetrics(),
      riskMetrics: this.getRiskMetrics(),
      alerts: this.getAlerts(),
      portfolioTimeSeries: this.getPortfolioTimeSeries(),
      correlationMatrix: this.getCorrelationMatrix()
    };
  }

  // Simulate real-time updates
  public addNewAlert(alert: Omit<Alert, 'id' | 'timestamp' | 'isRead'>): void {
    const newAlert: Alert = {
      ...alert,
      id: `alert-${Date.now()}`,
      timestamp: new Date(),
      isRead: false
    };
    
    this.alerts.unshift(newAlert);
    
    // Keep only last 50 alerts
    if (this.alerts.length > 50) {
      this.alerts = this.alerts.slice(0, 50);
    }
  }

  public updatePortfolioValue(newValue: number): void {
    this.portfolioHistory.push({
      timestamp: new Date(),
      value: newValue
    });

    // Keep only last 30 days
    if (this.portfolioHistory.length > 30) {
      this.portfolioHistory = this.portfolioHistory.slice(-30);
    }
  }

  // Generate realistic simulated alerts periodically
  public startAlertSimulation(): void {
    const alertTypes = [
      { type: 'info' as const, probability: 0.4 },
      { type: 'warning' as const, probability: 0.35 },
      { type: 'critical' as const, probability: 0.25 }
    ];

    const messages = [
      'Position size optimization opportunity detected',
      'Market regime change identified by ML model',
      'Arbitrage opportunity detected across exchanges',
      'Risk-adjusted momentum signal triggered',
      'Options flow indicates institutional positioning',
      'Sentiment analysis shows extreme fear levels',
      'Technical breakout pattern confirmed',
      'Earnings volatility spike expected',
      'Macro economic data release approaching',
      'Cross-asset correlation shift detected'
    ];

    setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every interval
        const typeIndex = Math.random();
        let alertType = 'info';
        let cumulative = 0;
        
        for (const type of alertTypes) {
          cumulative += type.probability;
          if (typeIndex <= cumulative) {
            alertType = type.type;
            break;
          }
        }

        const message = messages[Math.floor(Math.random() * messages.length)];
        
        this.addNewAlert({
          type: alertType as 'info' | 'warning' | 'critical',
          title: `${alertType === 'critical' ? 'URGENT: ' : ''}System Alert`,
          message,
          symbol: Math.random() > 0.5 ? ['BTC', 'ETH', 'SPY', 'AAPL', 'TSLA'][Math.floor(Math.random() * 5)] : undefined
        });
      }
    }, 30000); // Check every 30 seconds
  }
}

export const analyticsService = new AnalyticsService();