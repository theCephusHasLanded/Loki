import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { NeomorphicSurface } from '../../components/loki-2032/NeomorphicSurface';
import { CelestialPriceChart } from '../../components/charts/CelestialPriceChart';

const MarketDetailsPage = styled.div`
  min-height: 100vh;
  background: var(--color-glass-base);
  padding: var(--space-molecule);
  
  /* Cryptic blockchain analytics constellation */
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      /* Primary crypto network visualization */
      url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1920&q=80&auto=format&fit=crop'),
      /* Tokenized trading algorithms */
      url('https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1920&q=40&auto=format&fit=crop'),
      /* Base gradient layer */
      linear-gradient(135deg, var(--color-glass-base) 0%, var(--color-glass-surface) 100%);
    background-size: cover, cover, cover;
    background-position: center, center top, center;
    background-blend-mode: overlay, multiply, normal;
    backdrop-filter: var(--glass-blur-subtle);
    z-index: -2;
    pointer-events: none;
    animation: blockchain-analysis 40s ease-in-out infinite;
  }
  
  /* Tokenized data overlay */
  &::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(ellipse at 30% 20%, rgba(0, 255, 150, 0.04) 0%, transparent 60%),
      radial-gradient(ellipse at 70% 80%, rgba(0, 150, 255, 0.04) 0%, transparent 60%),
      linear-gradient(45deg, transparent 49%, rgba(255, 255, 255, 0.005) 50%, transparent 51%);
    z-index: -1;
    pointer-events: none;
    animation: data-stream-flow 25s linear infinite;
  }
  
  @keyframes blockchain-analysis {
    0%, 100% { opacity: 0.85; background-position: center, center top, center; }
    50% { opacity: 1; background-position: center, center bottom, center; }
  }
  
  @keyframes data-stream-flow {
    0% { transform: rotate(0deg) scale(1); opacity: 0.6; }
    50% { transform: rotate(180deg) scale(1.1); opacity: 0.8; }
    100% { transform: rotate(360deg) scale(1); opacity: 0.6; }
  }
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: auto auto 1fr;
  gap: var(--space-molecule);
  max-width: 1600px;
  margin: 0 auto;
  min-height: calc(100vh - 2 * var(--space-molecule));
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto 1fr;
  }
`;

const MarketOverview = styled(NeomorphicSurface)`
  grid-column: 1 / -1;
  padding: var(--space-molecule);
  position: relative;
  overflow: hidden;
  
  /* Cryptic market intelligence backdrop */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      /* Base overlay */
      linear-gradient(var(--color-glass-base), var(--color-glass-base)),
      /* Advanced trading algorithms */
      url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80&auto=format&fit=crop'),
      /* Blockchain verification layer */
      url('https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1200&q=50&auto=format&fit=crop');
    background-size: cover, cover, cover;
    background-position: center, center, center bottom;
    background-blend-mode: normal, overlay, soft-light;
    z-index: 0;
    animation: market-intelligence-pulse 18s ease-in-out infinite;
  }
  
  /* Tokenized border verification */
  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, 
      rgba(0, 255, 150, 0.1) 0%, 
      transparent 25%, 
      transparent 75%, 
      rgba(0, 150, 255, 0.1) 100%);
    border-radius: inherit;
    z-index: -1;
    animation: token-verification 10s linear infinite;
  }
  
  @keyframes market-intelligence-pulse {
    0%, 100% { background-position: center, center, center bottom; }
    50% { background-position: center, center top, center; }
  }
  
  @keyframes token-verification {
    0% { opacity: 0.3; transform: rotate(0deg); }
    50% { opacity: 0.7; transform: rotate(180deg); }
    100% { opacity: 0.3; transform: rotate(360deg); }
  }
  
  .overview-content {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: var(--space-solar);
    align-items: center;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: var(--space-molecule);
    }
    
    .market-info {
      .title {
        font-family: var(--font-display);
        font-size: 2rem;
        font-weight: 600;
        color: var(--color-text-primary);
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
        margin-bottom: var(--space-atom);
      }
      
      .description {
        font-family: var(--font-primary);
        font-size: 1.1rem;
        color: var(--color-text-secondary);
        text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
        line-height: 1.5;
        margin-bottom: var(--space-molecule);
      }
      
      .market-meta {
        display: flex;
        gap: var(--space-molecule);
        flex-wrap: wrap;
        
        .meta-item {
          display: flex;
          flex-direction: column;
          gap: var(--space-quantum);
          
          .label {
            font-family: var(--font-mono);
            font-size: 0.7rem;
            color: var(--color-text-muted);
            text-transform: uppercase;
            letter-spacing: 0.2em;
          }
          
          .value {
            font-family: var(--font-mono);
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--color-text-accent);
          }
        }
      }
    }
    
    .price-display {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-molecule);
      
      .price-container {
        display: flex;
        gap: var(--space-molecule);
        
        .price-card {
          background: var(--color-glass-surface);
          border: 1px solid var(--color-glass-border);
          border-radius: 12px;
          padding: var(--space-molecule);
          text-align: center;
          min-width: 120px;
          backdrop-filter: var(--glass-blur-strong);
          
          .price-label {
            font-family: var(--font-mono);
            font-size: 0.8rem;
            font-weight: 700;
            text-transform: uppercase;
            margin-bottom: var(--space-atom);
            
            &.yes { color: var(--color-profit); }
            &.no { color: var(--color-loss); }
          }
          
          .price-value {
            font-family: var(--font-display);
            font-size: 2rem;
            font-weight: 600;
            
            &.yes { color: var(--color-profit); }
            &.no { color: var(--color-loss); }
          }
          
          .price-change {
            font-family: var(--font-mono);
            font-size: 0.7rem;
            margin-top: var(--space-quantum);
            
            &.positive { color: var(--color-profit); }
            &.negative { color: var(--color-loss); }
          }
        }
      }
      
      .astro-confidence {
        text-align: center;
        
        .confidence-label {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          margin-bottom: var(--space-quantum);
        }
        
        .confidence-value {
          font-family: var(--font-display);
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--color-text-accent);
        }
      }
    }
  }
`;

const AstrologicalAnalysis = styled(NeomorphicSurface)`
  padding: var(--space-molecule);
  display: flex;
  flex-direction: column;
  gap: var(--space-molecule);
  position: relative;
  overflow: hidden;
  
  /* Algorithmic analysis backdrop */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      /* Base layer */
      linear-gradient(var(--color-glass-base), var(--color-glass-base)),
      /* Crypto pattern recognition */
      url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&q=80&auto=format&fit=crop'),
      /* Trading intelligence network */
      url('https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600&q=40&auto=format&fit=crop');
    background-size: cover, cover, cover;
    background-position: center, center, center bottom;
    background-blend-mode: normal, overlay, multiply;
    z-index: 0;
    opacity: 0.25;
    animation: algorithmic-analysis 15s ease-in-out infinite;
  }
  
  /* Tokenized verification grid */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      repeating-linear-gradient(90deg, 
        transparent 0px, 
        rgba(0, 255, 150, 0.03) 2px, 
        transparent 4px),
      repeating-linear-gradient(0deg, 
        transparent 0px, 
        rgba(0, 150, 255, 0.03) 2px, 
        transparent 4px);
    z-index: 1;
    pointer-events: none;
    animation: verification-grid 20s linear infinite;
  }
  
  @keyframes algorithmic-analysis {
    0%, 100% { opacity: 0.2; }
    50% { opacity: 0.35; }
  }
  
  @keyframes verification-grid {
    0% { transform: translate(0, 0); }
    25% { transform: translate(2px, 0); }
    50% { transform: translate(0, 2px); }
    75% { transform: translate(-2px, 0); }
    100% { transform: translate(0, 0); }
  }
  
  .analysis-header {
    font-family: var(--font-display);
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-text-primary);
    text-transform: uppercase;
    letter-spacing: 0.2em;
    text-align: center;
    margin-bottom: var(--space-molecule);
    position: relative;
    z-index: 2;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
    
    .subtitle {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--color-text-accent);
      font-weight: 400;
      margin-top: var(--space-quantum);
      text-transform: none;
      letter-spacing: 0.1em;
    }
  }
  
  .celestial-factors {
    .factor-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-atom) 0;
      border-bottom: 1px solid var(--color-glass-border);
      
      &:last-child {
        border-bottom: none;
      }
      
      .factor-name {
        font-family: var(--font-primary);
        font-size: 0.85rem;
        color: var(--color-text-secondary);
      }
      
      .factor-impact {
        font-family: var(--font-mono);
        font-size: 0.8rem;
        font-weight: 600;
        
        &.bullish { color: var(--color-profit); }
        &.bearish { color: var(--color-loss); }
        &.neutral { color: var(--color-text-muted); }
      }
    }
  }
  
  .lunar-calendar {
    background: var(--color-glass-surface);
    border: 1px solid var(--color-glass-border);
    border-radius: 8px;
    padding: var(--space-molecule);
    
    .calendar-header {
      font-family: var(--font-display);
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--color-text-accent);
      text-transform: uppercase;
      text-align: center;
      margin-bottom: var(--space-molecule);
    }
    
    .phase-timeline {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--space-molecule);
      
      .phase-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-quantum);
        
        .phase-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--color-text-accent);
          position: relative;
          
          &.new::after {
            content: '';
            position: absolute;
            top: 2px;
            left: 2px;
            right: 2px;
            bottom: 2px;
            background: var(--color-glass-base);
            border-radius: 50%;
          }
          
          &.waxing::after {
            content: '';
            position: absolute;
            top: 2px;
            left: 12px;
            right: 2px;
            bottom: 2px;
            background: var(--color-glass-base);
            border-radius: 50%;
          }
          
          &.full {
            background: var(--color-text-accent);
          }
          
          &.waning::after {
            content: '';
            position: absolute;
            top: 2px;
            left: 2px;
            right: 12px;
            bottom: 2px;
            background: var(--color-glass-base);
            border-radius: 50%;
          }
        }
        
        .phase-date {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          color: var(--color-text-muted);
        }
      }
    }
    
    .impact-summary {
      font-family: var(--font-primary);
      font-size: 0.8rem;
      color: var(--color-text-secondary);
      text-align: center;
      line-height: 1.4;
    }
  }
`;

const MarketChart = styled(NeomorphicSurface)`
  padding: var(--space-molecule);
  display: flex;
  flex-direction: column;
  gap: var(--space-molecule);
  position: relative;
  overflow: hidden;
  
  /* Cryptic financial data charts backdrop */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      /* Base layer */
      linear-gradient(var(--color-glass-base), var(--color-glass-base)),
      /* Advanced chart algorithms */
      url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&q=80&auto=format&fit=crop'),
      /* Blockchain trading data */
      url('https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600&q=60&auto=format&fit=crop');
    background-size: cover, cover, cover;
    background-position: center, center, center top;
    background-blend-mode: normal, overlay, multiply;
    z-index: 0;
    opacity: 0.2;
    animation: chart-data-flow 22s ease-in-out infinite;
  }
  
  /* Tokenized data visualization overlay */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      linear-gradient(45deg, 
        transparent 30%, 
        rgba(0, 255, 150, 0.02) 35%, 
        transparent 40%, 
        rgba(0, 150, 255, 0.02) 60%, 
        transparent 65%);
    z-index: 1;
    pointer-events: none;
    animation: data-visualization-sweep 8s linear infinite;
  }
  
  @keyframes chart-data-flow {
    0%, 100% { background-position: center, center, center top; }
    50% { background-position: center, center bottom, center; }
  }
  
  @keyframes data-visualization-sweep {
    0% { transform: translateX(-100%) skewX(-10deg); }
    100% { transform: translateX(100%) skewX(-10deg); }
  }
  
  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 2;
    
    .title {
      font-family: var(--font-display);
      font-size: 1rem;
      font-weight: 600;
      color: var(--color-text-primary);
      text-transform: uppercase;
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
    }
    
    .timeframe-selector {
      display: flex;
      gap: var(--space-quantum);
      
      button {
        padding: var(--space-quantum) var(--space-atom);
        background: var(--color-glass-panel);
        border: 1px solid var(--color-glass-border);
        border-radius: 4px;
        font-family: var(--font-mono);
        font-size: 0.7rem;
        color: var(--color-text-muted);
        cursor: pointer;
        
        &.active, &:hover {
          background: var(--color-glass-accent);
          color: var(--color-text-primary);
        }
      }
    }
  }
  
  .chart-placeholder {
    flex: 1;
    background: var(--color-glass-base);
    border: 1px solid var(--color-glass-border);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-muted);
    font-family: var(--font-mono);
    font-size: 0.9rem;
    min-height: 300px;
    position: relative;
    overflow: hidden;
    
    /* Animated celestial chart simulation */
    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60%;
      background: linear-gradient(45deg, 
        transparent 20%, 
        var(--color-profit) 25%,
        transparent 30%,
        var(--color-text-accent) 50%,
        transparent 55%,
        var(--color-loss) 70%,
        transparent 75%);
      animation: chart-flow 8s ease-in-out infinite;
      opacity: 0.3;
    }
  }
  
  @keyframes chart-flow {
    0%, 100% { transform: translateX(-100%) skewX(-15deg); }
    50% { transform: translateX(100%) skewX(-15deg); }
  }
`;

const MarketActivity = styled(NeomorphicSurface)`
  padding: var(--space-molecule);
  grid-column: 1 / -1;
  position: relative;
  overflow: hidden;
  
  /* Cryptic market activity intelligence */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      /* Base layer */
      linear-gradient(var(--color-glass-base), var(--color-glass-base)),
      /* Blockchain activity monitoring */
      url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80&auto=format&fit=crop'),
      /* Trading algorithm networks */
      url('https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&q=50&auto=format&fit=crop');
    background-size: cover, cover, cover;
    background-position: center, center, center bottom;
    background-blend-mode: normal, overlay, soft-light;
    z-index: 0;
    opacity: 0.15;
    animation: market-activity-pulse 28s ease-in-out infinite;
  }
  
  /* Tokenized activity verification */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 30%, rgba(0, 255, 150, 0.02) 0%, transparent 40%),
      radial-gradient(circle at 80% 70%, rgba(0, 150, 255, 0.02) 0%, transparent 40%);
    z-index: 1;
    pointer-events: none;
    animation: activity-verification 12s ease-in-out infinite;
  }
  
  @keyframes market-activity-pulse {
    0%, 100% { opacity: 0.12; background-position: center, center, center bottom; }
    50% { opacity: 0.2; background-position: center, center top, center; }
  }
  
  @keyframes activity-verification {
    0%, 100% { opacity: 0.8; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.05); }
  }
  
  .activity-header {
    font-family: var(--font-display);
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-text-primary);
    text-transform: uppercase;
    letter-spacing: 0.2em;
    margin-bottom: var(--space-molecule);
    text-align: center;
    position: relative;
    z-index: 2;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
  }
  
  .activity-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-molecule);
    
    .activity-section {
      .section-title {
        font-family: var(--font-mono);
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--color-text-accent);
        text-transform: uppercase;
        margin-bottom: var(--space-atom);
      }
      
      .activity-list {
        display: flex;
        flex-direction: column;
        gap: var(--space-atom);
        
        .activity-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-atom);
          background: var(--color-glass-surface);
          border: 1px solid var(--color-glass-border);
          border-radius: 6px;
          
          .item-info {
            .action {
              font-family: var(--font-primary);
              font-size: 0.8rem;
              color: var(--color-text-secondary);
            }
            
            .time {
              font-family: var(--font-mono);
              font-size: 0.7rem;
              color: var(--color-text-muted);
            }
          }
          
          .item-value {
            font-family: var(--font-mono);
            font-size: 0.8rem;
            font-weight: 600;
            
            &.profit { color: var(--color-profit); }
            &.loss { color: var(--color-loss); }
            &.neutral { color: var(--color-text-accent); }
          }
        }
      }
    }
  }
`;

interface MarketDetails {
  id: string;
  title: string;
  description: string;
  category: string;
  endDate: string;
  volume: number;
  yesPrice: number;
  noPrice: number;
  astroConfidence: number;
}

const MarketDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [marketData, setMarketData] = useState<MarketDetails | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');

  const celestialFactors = [
    { name: 'Mercury Position', impact: 'bullish', description: 'Communication planet favors policy announcements' },
    { name: 'Venus-Jupiter Conjunction', impact: 'bullish', description: 'Wealth alignment supports rate cuts' },
    { name: 'Mars-Saturn Square', impact: 'bearish', description: 'Tension aspect creates economic caution' },
    { name: 'Lunar Phase Influence', impact: 'neutral', description: 'Waxing moon provides balanced energy' },
    { name: 'Pluto Transit', impact: 'bullish', description: 'Transformation planet supports financial change' }
  ];

  const recentActivity = [
    { action: 'Large YES position opened', time: '2 hours ago', value: '+$45,000', type: 'profit' },
    { action: 'Institutional NO hedge', time: '4 hours ago', value: '-$28,000', type: 'loss' },
    { action: 'Retail accumulation phase', time: '6 hours ago', value: '+$12,000', type: 'profit' },
    { action: 'Options flow detected', time: '8 hours ago', value: 'High IV', type: 'neutral' },
    { action: 'Astro signal triggered', time: '12 hours ago', value: 'BUY Alert', type: 'profit' }
  ];

  useEffect(() => {
    if (id) {
      // Mock market data - in real app would fetch from API
      setMarketData({
        id: id as string,
        title: 'Fed Rate Cut March 2025',
        description: 'Will the Federal Reserve cut interest rates by at least 25 basis points in March 2025? Market considers FOMC minutes, economic indicators, and celestial timing.',
        category: 'Economics',
        endDate: 'March 31, 2025',
        volume: 21000000,
        yesPrice: 0.67,
        noPrice: 0.33,
        astroConfidence: 94.2
      });
    }
  }, [id]);

  if (!marketData) {
    return <div>Loading celestial market analysis...</div>;
  }

  return (
    <MarketDetailsPage>
      <DetailsGrid>
        <MarketOverview depth="deep">
          <div className="overview-content">
            <div className="market-info">
              <h1 className="title">{marketData.title}</h1>
              <p className="description">{marketData.description}</p>
              
              <div className="market-meta">
                <div className="meta-item">
                  <span className="label">Category</span>
                  <span className="value">{marketData.category}</span>
                </div>
                <div className="meta-item">
                  <span className="label">End Date</span>
                  <span className="value">{marketData.endDate}</span>
                </div>
                <div className="meta-item">
                  <span className="label">Volume</span>
                  <span className="value">${(marketData.volume / 1000000).toFixed(1)}M</span>
                </div>
              </div>
            </div>
            
            <div className="price-display">
              <div className="price-container">
                <div className="price-card">
                  <div className="price-label yes">YES</div>
                  <div className="price-value yes">{(marketData.yesPrice * 100).toFixed(0)}¢</div>
                  <div className="price-change positive">+8.7%</div>
                </div>
                <div className="price-card">
                  <div className="price-label no">NO</div>
                  <div className="price-value no">{(marketData.noPrice * 100).toFixed(0)}¢</div>
                  <div className="price-change negative">-8.7%</div>
                </div>
              </div>
              
              <div className="astro-confidence">
                <div className="confidence-label">Astro Confidence</div>
                <div className="confidence-value">{marketData.astroConfidence}%</div>
              </div>
            </div>
          </div>
        </MarketOverview>

        <MarketChart depth="medium">
          <div className="chart-header">
            <div className="title">Price & Celestial Overlay</div>
            <div className="timeframe-selector">
              {['1H', '1D', '1W', '1M'].map(timeframe => (
                <button
                  key={timeframe}
                  className={selectedTimeframe === timeframe ? 'active' : ''}
                  onClick={() => setSelectedTimeframe(timeframe)}
                >
                  {timeframe}
                </button>
              ))}
            </div>
          </div>
          <CelestialPriceChart 
            symbol={marketData?.title || 'Market Analysis'}
            timeframe={selectedTimeframe as any}
          />
        </MarketChart>

        <AstrologicalAnalysis depth="medium">
          <div className="analysis-header">
            Astrological Market Analysis
            <div className="subtitle">Planetary Influence Assessment</div>
          </div>
          
          <div className="celestial-factors">
            {celestialFactors.map((factor, index) => (
              <div key={index} className="factor-item">
                <span className="factor-name">{factor.name}</span>
                <span className={`factor-impact ${factor.impact}`}>
                  {factor.impact.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
          
          <div className="lunar-calendar">
            <div className="calendar-header">Lunar Phase Impact</div>
            <div className="phase-timeline">
              <div className="phase-item">
                <div className="phase-icon new"></div>
                <div className="phase-date">Jan 15</div>
              </div>
              <div className="phase-item">
                <div className="phase-icon waxing"></div>
                <div className="phase-date">Jan 23</div>
              </div>
              <div className="phase-item">
                <div className="phase-icon full"></div>
                <div className="phase-date">Jan 30</div>
              </div>
              <div className="phase-item">
                <div className="phase-icon waning"></div>
                <div className="phase-date">Feb 6</div>
              </div>
            </div>
            <div className="impact-summary">
              Full moon in Leo (Jan 30) historically correlates with central bank policy announcements. 
              Venus-Jupiter alignment in Aquarius supports innovative monetary policy.
            </div>
          </div>
        </AstrologicalAnalysis>

        <MarketActivity depth="medium">
          <div className="activity-header">Market Activity & Cosmic Signals</div>
          <div className="activity-grid">
            <div className="activity-section">
              <div className="section-title">Recent Trades</div>
              <div className="activity-list">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="item-info">
                      <div className="action">{activity.action}</div>
                      <div className="time">{activity.time}</div>
                    </div>
                    <div className={`item-value ${activity.type}`}>
                      {activity.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="activity-section">
              <div className="section-title">Celestial Events</div>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="item-info">
                    <div className="action">Mercury enters Capricorn</div>
                    <div className="time">Tomorrow</div>
                  </div>
                  <div className="item-value profit">BULLISH</div>
                </div>
                <div className="activity-item">
                  <div className="item-info">
                    <div className="action">Venus-Jupiter conjunction</div>
                    <div className="time">3 days</div>
                  </div>
                  <div className="item-value profit">BULLISH</div>
                </div>
                <div className="activity-item">
                  <div className="item-info">
                    <div className="action">Mars square Saturn</div>
                    <div className="time">1 week</div>
                  </div>
                  <div className="item-value loss">BEARISH</div>
                </div>
              </div>
            </div>
          </div>
        </MarketActivity>
      </DetailsGrid>
    </MarketDetailsPage>
  );
};

export default MarketDetailPage;