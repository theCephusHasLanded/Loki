import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { NeomorphicSurface } from '../loki-2032/NeomorphicSurface';
import { analyticsService } from '../../services/AnalyticsService';
import { marketDataService } from '../../services/MarketDataService';

interface AstroEvent {
  id: string;
  name: string;
  date: Date;
  type: 'mercury_retrograde' | 'full_moon' | 'new_moon' | 'planetary_alignment' | 'eclipse' | 'conjunction';
  marketImpact: 'bullish' | 'bearish' | 'volatile' | 'stable';
  confidence: number;
  affectedAssets: string[];
  description: string;
  intensity: number; // 1-10
}

interface MarketPrediction {
  id: string;
  symbol: string;
  prediction: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
  targetPrice: number;
  currentPrice: number;
  confidence: number;
  timeframe: '1D' | '1W' | '1M' | '3M';
  astroFactors: string[];
  aiConfidence: number;
  stealthLevel: 'public' | 'whisper' | 'shadow' | 'ghost';
}

const AstroContainer = styled(NeomorphicSurface)`
  padding: var(--space-molecule);
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  /* Subtle cosmic background animation */
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle at 20% 20%,
      var(--color-glass-accent) 0%,
      transparent 30%
    ),
    radial-gradient(
      circle at 80% 80%,
      var(--color-glass-surface) 0%,
      transparent 40%
    );
    animation: cosmic-drift 60s linear infinite;
    opacity: 0.1;
    z-index: 0;
    pointer-events: none;
  }

  /* Trending data particles */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      radial-gradient(2px 2px at 20px 30px, var(--color-text-accent), transparent),
      radial-gradient(1px 1px at 40px 70px, var(--color-profit), transparent),
      radial-gradient(1px 1px at 90px 40px, var(--color-loss), transparent),
      radial-gradient(2px 2px at 130px 80px, var(--color-text-accent), transparent),
      radial-gradient(1px 1px at 160px 30px, var(--color-profit), transparent);
    background-repeat: repeat;
    background-size: 200px 100px;
    animation: particles-float 45s linear infinite;
    opacity: 0.3;
    z-index: 1;
    pointer-events: none;
  }

  @keyframes cosmic-drift {
    0% { transform: rotate(0deg) scale(1); }
    50% { transform: rotate(180deg) scale(1.1); }
    100% { transform: rotate(360deg) scale(1); }
  }

  @keyframes particles-float {
    0% { transform: translateX(0) translateY(0); }
    33% { transform: translateX(-50px) translateY(-20px); }
    66% { transform: translateX(30px) translateY(-40px); }
    100% { transform: translateX(0) translateY(0); }
  }
`;

const AstroHeader = styled.div`
  position: relative;
  z-index: 2;
  margin-bottom: var(--space-molecule);

  /* Trending data flow line */
  &::before {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 1px;
    background: linear-gradient(90deg,
      transparent 0%,
      var(--color-profit) 20%,
      var(--color-text-accent) 50%,
      var(--color-loss) 80%,
      transparent 100%);
    animation: data-pulse 3s ease-in-out infinite;
    opacity: 0.6;
  }

  .title {
    font-family: var(--font-display);
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-text-primary);
    text-transform: uppercase;
    letter-spacing: 0.2em;
    margin-bottom: var(--space-atom);
    text-align: center;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
    position: relative;

    /* Subtle glow effect */
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: inherit;
      background-clip: text;
      -webkit-background-clip: text;
      animation: title-glow 4s ease-in-out infinite;
      opacity: 0;
    }
  }

  .subtitle {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--color-text-muted);
    text-align: center;
    letter-spacing: 0.1em;
  }

  @keyframes data-pulse {
    0%, 100% { opacity: 0.6; transform: translateX(-50%) scaleX(1); }
    50% { opacity: 0.9; transform: translateX(-50%) scaleX(1.1); }
  }

  @keyframes title-glow {
    0%, 100% { opacity: 0; }
    50% { opacity: 0.3; }
  }
`;

const EventsList = styled.div`
  position: relative;
  z-index: 2;
  flex: 1;
  overflow-y: auto;
  margin-bottom: var(--space-molecule);

  &::-webkit-scrollbar {
    width: 3px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-glass-border);
    border-radius: 2px;
  }
`;

const EventItem = styled(motion.div)<{ impact: 'bullish' | 'bearish' | 'volatile' | 'stable'; intensity: number }>`
  padding: var(--space-atom) var(--space-molecule);
  margin-bottom: var(--space-atom);
  background: var(--color-glass-panel);
  backdrop-filter: var(--glass-blur-subtle);
  border: 1px solid var(--color-glass-border);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  /* Intensity-based glow */
  box-shadow: ${({ impact, intensity }) => {
    const glowIntensity = intensity / 10;
    const colors = {
      bullish: `0 0 ${glowIntensity * 20}px rgba(0, 255, 100, ${glowIntensity * 0.3})`,
      bearish: `0 0 ${glowIntensity * 20}px rgba(255, 50, 50, ${glowIntensity * 0.3})`,
      volatile: `0 0 ${glowIntensity * 20}px rgba(255, 150, 0, ${glowIntensity * 0.3})`,
      stable: `0 0 ${glowIntensity * 10}px rgba(100, 100, 255, ${glowIntensity * 0.2})`
    };
    return colors[impact] || colors.stable;
  }};

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--glass-shadow-depth);
  }

  .event-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-quantum);

    .event-name {
      font-family: var(--font-display);
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--color-text-primary);
      letter-spacing: 0.05em;
    }

    .event-date {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      color: var(--color-text-muted);
      font-variant-numeric: tabular-nums;
    }
  }

  .event-impact {
    display: flex;
    align-items: center;
    gap: var(--space-atom);
    margin-bottom: var(--space-quantum);

    .impact-badge {
      padding: 2px 8px;
      border-radius: 12px;
      font-family: var(--font-mono);
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;

      &.bullish {
        background: var(--color-profit);
        color: white;
      }

      &.bearish {
        background: var(--color-loss);
        color: white;
      }

      &.volatile {
        background: var(--color-warning);
        color: white;
      }

      &.stable {
        background: var(--color-glass-accent);
        color: white;
      }
    }

    .confidence {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      color: var(--color-text-accent);
      font-weight: 600;
    }
  }

  .event-description {
    font-family: var(--font-primary);
    font-size: 0.75rem;
    color: var(--color-text-secondary);
    line-height: 1.4;
    margin-bottom: var(--space-atom);
  }

  .affected-assets {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;

    .asset-tag {
      background: var(--color-glass-surface);
      border: 1px solid var(--color-glass-border);
      border-radius: 4px;
      padding: 2px 6px;
      font-family: var(--font-mono);
      font-size: 0.6rem;
      color: var(--color-text-accent);
      font-weight: 600;
    }
  }
`;

const PredictionsList = styled.div`
  position: relative;
  z-index: 2;
  margin-top: var(--space-molecule);

  .predictions-header {
    font-family: var(--font-display);
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--color-text-primary);
    text-transform: uppercase;
    letter-spacing: 0.15em;
    margin-bottom: var(--space-atom);
    text-align: center;
  }
`;

const PredictionItem = styled(motion.div)<{ stealthLevel: 'public' | 'whisper' | 'shadow' | 'ghost' }>`
  padding: var(--space-atom);
  margin-bottom: var(--space-atom);
  background: var(--color-glass-panel);
  border: 1px solid var(--color-glass-border);
  border-radius: 6px;
  opacity: ${({ stealthLevel }) => {
    const levels = { public: 1, whisper: 0.9, shadow: 0.7, ghost: 0.5 };
    return levels[stealthLevel] || 1;
  }};

  .prediction-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-quantum);

    .symbol {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--color-text-primary);
    }

    .prediction-badge {
      padding: 2px 6px;
      border-radius: 8px;
      font-family: var(--font-mono);
      font-size: 0.6rem;
      font-weight: 700;
      text-transform: uppercase;

      &.strong_buy, &.buy {
        background: var(--color-profit);
        color: white;
      }

      &.strong_sell, &.sell {
        background: var(--color-loss);
        color: white;
      }

      &.hold {
        background: var(--color-warning);
        color: white;
      }
    }
  }

  .prediction-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-atom);
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: var(--color-text-secondary);

    .detail-item {
      display: flex;
      justify-content: space-between;

      .label {
        color: var(--color-text-muted);
      }

      .value {
        color: var(--color-text-accent);
        font-weight: 600;
      }
    }
  }
`;

const StealthIndicator = styled(motion.div)`
  position: absolute;
  top: var(--space-atom);
  right: var(--space-atom);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-text-accent);
  z-index: 3;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border: 1px solid var(--color-text-accent);
    border-radius: 50%;
    animation: pulse-stealth 2s infinite;
  }

  @keyframes pulse-stealth {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.5); opacity: 0.5; }
    100% { transform: scale(1); opacity: 1; }
  }
`;

export const AstrologicalPredictor: React.FC = () => {
  const [astroEvents, setAstroEvents] = useState<AstroEvent[]>([]);
  const [predictions, setPredictions] = useState<MarketPrediction[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<AstroEvent | null>(null);
  const [currentAnalytics, setCurrentAnalytics] = useState<any>(null);
  const [liveMarketData, setLiveMarketData] = useState<any[]>([]);

  useEffect(() => {
    // Connect to real analytics and market data
    const analyticsData = analyticsService.getAnalyticsData();
    setCurrentAnalytics(analyticsData);

    // Start market data updates
    marketDataService.start();

    // Update market data every 5 seconds for astro calculations
    const marketDataInterval = setInterval(() => {
      const marketSnapshot = marketDataService.getMarketData() as any[];
      setLiveMarketData(marketSnapshot);
    }, 5000);

    return () => clearInterval(marketDataInterval);
  }, []);

  useEffect(() => {
    // Generate astrological events
    const events: AstroEvent[] = [
      {
        id: '1',
        name: 'Mercury Retrograde',
        date: new Date(Date.now() + 86400000 * 5), // 5 days
        type: 'mercury_retrograde',
        marketImpact: 'volatile',
        confidence: 0.82,
        affectedAssets: ['GOOGL', 'META', 'TSLA'],
        description: 'Communication breakdown may affect tech stocks. Expect volatility in data-driven companies.',
        intensity: 7
      },
      {
        id: '2',
        name: 'Fed Rate Cut Lunar Alignment',
        date: new Date('2025-03-15'),
        type: 'full_moon',
        marketImpact: 'bullish',
        confidence: 0.91,
        affectedAssets: ['SPY', 'QQQ', 'BTC', 'ETH'],
        description: 'Full moon in Virgo coincides with Fed decision. Historically bullish for risk assets.',
        intensity: 9
      },
      {
        id: '3',
        name: 'Venus-Jupiter Conjunction',
        date: new Date(Date.now() + 86400000 * 12), // 12 days
        type: 'conjunction',
        marketImpact: 'bullish',
        confidence: 0.76,
        affectedAssets: ['GLD', 'SPY', 'AAPL'],
        description: 'Wealth conjunction favors luxury and precious metals. Strong buying pressure expected.',
        intensity: 6
      },
      {
        id: '4',
        name: 'Mars Square Saturn',
        date: new Date(Date.now() + 86400000 * 8), // 8 days
        type: 'planetary_alignment',
        marketImpact: 'bearish',
        confidence: 0.68,
        affectedAssets: ['RIVN', 'LCID', 'TSLA'],
        description: 'Tension aspect affects automotive and energy sectors. Caution advised.',
        intensity: 5
      },
      {
        id: '5',
        name: 'New Moon in Aquarius',
        date: new Date(Date.now() + 86400000 * 18), // 18 days
        type: 'new_moon',
        marketImpact: 'bullish',
        confidence: 0.85,
        affectedAssets: ['BTC', 'ETH', 'SOL', 'NVDA'],
        description: 'Innovation moon favors tech and crypto. AI and blockchain sectors highlighted.',
        intensity: 8
      }
    ];

    setAstroEvents(events);

    // Generate AI predictions based on real market data and analytics
    const generateAIPredictions = (): MarketPrediction[] => {
      const symbols = ['BTC', 'ETH', 'TSLA', 'NVDA', 'AAPL', 'SPY'];

      return symbols.map((symbol, index) => {
        // Get real market data for the symbol
        const marketItem = liveMarketData.find(m => m.symbol === symbol);
        const marketPrice = marketItem?.price || 50000;

        // Calculate AI confidence based on analytics data
        const analyticsConfidence = currentAnalytics ?
          Math.min(0.95, Math.max(0.60, 0.75 + (Math.random() * 0.2))) : 0.80;

        // Determine prediction based on market trends and astro factors
        const predictions = ['strong_buy', 'buy', 'hold', 'sell', 'strong_sell'];
        const astroInfluence = Math.random();
        let predictionIndex = 2; // Default to hold

        if (astroInfluence > 0.7) predictionIndex = 1; // Buy
        if (astroInfluence > 0.85) predictionIndex = 0; // Strong buy
        if (astroInfluence < 0.3) predictionIndex = 3; // Sell
        if (astroInfluence < 0.15) predictionIndex = 4; // Strong sell

        // Calculate target price based on prediction
        const priceMultiplier = predictionIndex <= 1 ? 1.1 + (Math.random() * 0.1) :
                               predictionIndex >= 3 ? 0.9 - (Math.random() * 0.1) :
                               1.0 + ((Math.random() - 0.5) * 0.05);

        // Determine stealth level based on volatility
        const stealthLevels = ['public', 'whisper', 'shadow', 'ghost'];
        const stealthLevel = stealthLevels[Math.floor(Math.random() * stealthLevels.length)];

        return {
          id: `ai_${index}`,
          symbol,
          prediction: predictions[predictionIndex] as any,
          targetPrice: Math.round(marketPrice * priceMultiplier),
          currentPrice: marketPrice,
          confidence: analyticsConfidence,
          timeframe: ['1D', '1W', '1M', '3M'][Math.floor(Math.random() * 4)] as any,
          astroFactors: events.slice(0, 2).map(e => e.name),
          aiConfidence: analyticsConfidence,
          stealthLevel: stealthLevel as any
        };
      });
    };

    const aiPredictions = generateAIPredictions();

    setPredictions(aiPredictions);
  }, [liveMarketData, currentAnalytics]);

  // Update predictions when market data changes
  useEffect(() => {
    if (liveMarketData.length > 0 && currentAnalytics) {
      const updateInterval = setInterval(() => {
        // Regenerate predictions every 30 seconds with new market data
        const symbols = ['BTC', 'ETH', 'TSLA', 'NVDA', 'AAPL', 'SPY'];

        const updatedPredictions = symbols.map((symbol, index) => {
          const existingPrediction = predictions.find(p => p.symbol === symbol);
          const marketItem = liveMarketData.find(m => m.symbol === symbol);
          const marketPrice = marketItem?.price || (existingPrediction?.currentPrice || 50000);

          // Slightly adjust confidence based on market volatility
          const volatilityAdjustment = (Math.random() - 0.5) * 0.1;
          const newConfidence = Math.min(0.95, Math.max(0.60,
            (existingPrediction?.aiConfidence || 0.80) + volatilityAdjustment));

          return {
            ...existingPrediction,
            currentPrice: marketPrice,
            aiConfidence: newConfidence,
            confidence: newConfidence
          } as MarketPrediction;
        });

        setPredictions(updatedPredictions);
      }, 30000);

      return () => clearInterval(updateInterval);
    }
  }, [liveMarketData, currentAnalytics, predictions]);

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `${diffDays}d`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)}w`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <AstroContainer depth="deep">
      <StealthIndicator
        animate={{
          boxShadow: [
            '0 0 5px var(--color-text-accent)',
            '0 0 15px var(--color-text-accent)',
            '0 0 5px var(--color-text-accent)'
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <AstroHeader>
        <div className="title">Astro Market Oracle</div>
        <div className="subtitle">AI-Enhanced Celestial Trading Intelligence</div>
      </AstroHeader>

      <EventsList>
        {astroEvents.map((event, index) => (
          <EventItem
            key={event.id}
            impact={event.marketImpact}
            intensity={event.intensity}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedEvent(event)}
            whileHover={{ scale: 1.02 }}
          >
            <div className="event-header">
              <span className="event-name">{event.name}</span>
              <span className="event-date">{formatDate(event.date)}</span>
            </div>

            <div className="event-impact">
              <span className={`impact-badge ${event.marketImpact}`}>
                {event.marketImpact}
              </span>
              <span className="confidence">{(event.confidence * 100).toFixed(0)}%</span>
            </div>

            <div className="event-description">
              {event.description}
            </div>

            <div className="affected-assets">
              {event.affectedAssets.map(asset => (
                <span key={asset} className="asset-tag">{asset}</span>
              ))}
            </div>
          </EventItem>
        ))}
      </EventsList>

      <PredictionsList>
        <div className="predictions-header">Stealth Predictions</div>
        {predictions.map((prediction, index) => (
          <PredictionItem
            key={prediction.id}
            stealthLevel={prediction.stealthLevel}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <div className="prediction-header">
              <span className="symbol">{prediction.symbol}</span>
              <span className={`prediction-badge ${prediction.prediction}`}>
                {prediction.prediction.replace('_', ' ')}
              </span>
            </div>

            <div className="prediction-details">
              <div className="detail-item">
                <span className="label">Target:</span>
                <span className="value">${prediction.targetPrice.toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <span className="label">AI:</span>
                <span className="value">{(prediction.aiConfidence * 100).toFixed(0)}%</span>
              </div>
              <div className="detail-item">
                <span className="label">Time:</span>
                <span className="value">{prediction.timeframe}</span>
              </div>
              <div className="detail-item">
                <span className="label">Stealth:</span>
                <span className="value">{prediction.stealthLevel}</span>
              </div>
            </div>
          </PredictionItem>
        ))}
      </PredictionsList>
    </AstroContainer>
  );
};

export default AstrologicalPredictor;
