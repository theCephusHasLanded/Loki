import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { NeomorphicSurface } from '../../components/loki-2032/NeomorphicSurface';
import { AstrologicalPredictor } from '../../components/astro/AstrologicalPredictor';
import { CelestialPriceChart } from '../../components/charts/CelestialPriceChart';
import { analyticsService } from '../../services/AnalyticsService';
import { marketDataService } from '../../services/MarketDataService';

const TradePage = styled.div`
  min-height: 100vh;
  background: var(--color-glass-base);
  padding: var(--space-molecule);
  
  /* Cryptic trading floor constellation background */
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      /* Crypto trading network overlay */
      url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1920&q=80&auto=format&fit=crop'),
      /* Tokenized data streams */
      url('https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1920&q=40&auto=format&fit=crop'),
      /* Base glass gradient */
      linear-gradient(135deg, var(--color-glass-base) 0%, var(--color-glass-surface) 100%);
    background-size: cover, cover, cover;
    background-position: center, center bottom, center;
    background-blend-mode: overlay, multiply, normal;
    backdrop-filter: var(--glass-blur-subtle);
    z-index: -2;
    pointer-events: none;
    animation: crypto-floor-pulse 45s ease-in-out infinite;
  }
  
  /* Hexagonal crypto network overlay */
  &::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 25% 25%, rgba(0, 255, 150, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(0, 150, 255, 0.03) 0%, transparent 50%),
      linear-gradient(45deg, transparent 48%, rgba(255, 255, 255, 0.01) 50%, transparent 52%);
    z-index: -1;
    pointer-events: none;
    animation: network-flow 30s linear infinite;
  }
  
  @keyframes crypto-floor-pulse {
    0%, 100% { opacity: 0.8; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.02); }
  }
  
  @keyframes network-flow {
    0% { transform: rotate(0deg) scale(1); }
    100% { transform: rotate(360deg) scale(1.05); }
  }
`;

const TradingGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
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

const CelestialChartContainer = styled(NeomorphicSurface)`
  grid-column: 1;
  padding: var(--space-molecule);
  display: flex;
  flex-direction: column;
  gap: var(--space-atom);
  
  .chart-header {
    font-family: var(--font-display);
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-text-primary);
    text-transform: uppercase;
    text-align: center;
    margin-bottom: var(--space-atom);
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
  }
`;

const MarketHeader = styled(NeomorphicSurface)`
  grid-column: 1 / -1;
  padding: var(--space-molecule);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  
  /* Tokenized market intelligence backdrop */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      /* Primary crypto trading overlay */
      linear-gradient(var(--color-glass-base), var(--color-glass-base)),
      /* Blockchain network visualization */
      url('https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1200&q=80&auto=format&fit=crop'),
      /* Trading algorithms pattern */
      url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=60&auto=format&fit=crop');
    background-size: cover, cover, cover;
    background-position: center, center, center bottom;
    background-blend-mode: normal, overlay, multiply;
    z-index: 0;
    animation: market-data-flow 20s ease-in-out infinite;
  }
  
  /* Crypto verification layer */
  &::after {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    background: 
      linear-gradient(45deg, rgba(0, 255, 150, 0.05) 0%, transparent 25%),
      linear-gradient(-45deg, rgba(0, 150, 255, 0.05) 0%, transparent 25%);
    border-radius: 12px;
    z-index: -1;
    animation: verification-pulse 8s ease-in-out infinite;
  }
  
  @keyframes market-data-flow {
    0%, 100% { background-position: center, center, center bottom; }
    50% { background-position: center, center top, center; }
  }
  
  @keyframes verification-pulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.8; }
  }
  
  .market-info {
    position: relative;
    z-index: 2;
    
    .market-title {
      font-family: var(--font-display);
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--color-text-primary);
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
      margin-bottom: var(--space-atom);
    }
    
    .market-description {
      font-family: var(--font-primary);
      font-size: 0.9rem;
      color: var(--color-text-secondary);
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
    }
  }
  
  .celestial-indicators {
    position: relative;
    z-index: 2;
    display: flex;
    gap: var(--space-molecule);
    align-items: center;
    
    .lunar-phase {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-quantum);
      
      .phase-icon {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--color-text-accent), var(--color-glass-accent));
        position: relative;
        
        &::after {
          content: '';
          position: absolute;
          top: 2px;
          left: 8px;
          width: 16px;
          height: 28px;
          background: var(--color-glass-base);
          border-radius: 50%;
          opacity: 0.6;
        }
      }
      
      .phase-label {
        font-family: var(--font-mono);
        font-size: 0.7rem;
        color: var(--color-text-muted);
        text-transform: uppercase;
      }
    }
    
    .mercury-status {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-quantum);
      
      .mercury-icon {
        width: 24px;
        height: 24px;
        border: 2px solid var(--color-text-accent);
        border-radius: 50%;
        position: relative;
        animation: mercury-pulse 3s ease-in-out infinite;
        
        &::after {
          content: '';
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 8px;
          height: 8px;
          background: var(--color-text-accent);
          border-radius: 50%;
        }
        
        &::before {
          content: '';
          position: absolute;
          bottom: -12px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 8px solid var(--color-text-accent);
        }
      }
      
      .mercury-label {
        font-family: var(--font-mono);
        font-size: 0.7rem;
        color: var(--color-warning);
        text-transform: uppercase;
      }
    }
  }
  
  @keyframes mercury-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.1); }
  }
`;

const TradingPanel = styled(NeomorphicSurface)`
  padding: var(--space-molecule);
  display: flex;
  flex-direction: column;
  gap: var(--space-molecule);
  position: relative;
  overflow: hidden;
  
  /* Cryptic financial algorithms backdrop */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      /* Base crypto layer */
      linear-gradient(var(--color-glass-base), var(--color-glass-base)),
      /* Algorithmic trading patterns */
      url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&auto=format&fit=crop'),
      /* Blockchain verification network */
      url('https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&q=60&auto=format&fit=crop');
    background-size: cover, cover, cover;
    background-position: center, center top, center;
    background-blend-mode: normal, overlay, multiply;
    z-index: 0;
    opacity: 0.4;
    animation: trading-algorithm-flow 25s ease-in-out infinite;
  }
  
  /* Tokenized trading overlay */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      repeating-linear-gradient(45deg, 
        transparent 0px, 
        rgba(0, 255, 150, 0.02) 1px, 
        transparent 2px, 
        rgba(0, 150, 255, 0.02) 3px, 
        transparent 4px);
    z-index: 1;
    pointer-events: none;
    animation: token-grid 15s linear infinite;
  }
  
  @keyframes trading-algorithm-flow {
    0%, 100% { background-position: center, center top, center; }
    33% { background-position: center, center, center top; }
    66% { background-position: center, center bottom, center; }
  }
  
  @keyframes token-grid {
    0% { transform: translateX(-4px); }
    100% { transform: translateX(4px); }
  }
  
  .panel-header {
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
    
    .astro-confidence {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--color-text-accent);
      font-weight: 400;
      margin-top: var(--space-quantum);
    }
  }
`;

const OrderBook = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-molecule);
  margin-bottom: var(--space-molecule);
  
  .book-side {
    .side-header {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: var(--space-atom);
      text-align: center;
      padding: var(--space-atom);
      border-radius: 4px;
      
      &.yes-side {
        background: var(--color-profit);
        color: white;
      }
      
      &.no-side {
        background: var(--color-loss);
        color: white;
      }
    }
    
    .price-level {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: var(--space-atom);
      padding: var(--space-quantum) var(--space-atom);
      border-bottom: 1px solid var(--color-glass-border);
      font-family: var(--font-mono);
      font-size: 0.75rem;
      
      .price {
        font-weight: 600;
        
        &.yes { color: var(--color-profit); }
        &.no { color: var(--color-loss); }
      }
      
      .size {
        color: var(--color-text-secondary);
      }
      
      .total {
        color: var(--color-text-muted);
        font-size: 0.7rem;
      }
    }
  }
`;

const TradeForm = styled.div`
  .position-selector {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-atom);
    margin-bottom: var(--space-molecule);
    
    button {
      padding: var(--space-molecule);
      border: 1px solid var(--color-glass-border);
      border-radius: 6px;
      font-family: var(--font-display);
      font-size: 0.9rem;
      font-weight: 600;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &.yes {
        background: var(--color-glass-panel);
        color: var(--color-profit);
        
        &.active, &:hover {
          background: var(--color-profit);
          color: white;
        }
      }
      
      &.no {
        background: var(--color-glass-panel);
        color: var(--color-loss);
        
        &.active, &:hover {
          background: var(--color-loss);
          color: white;
        }
      }
    }
  }
  
  .trade-inputs {
    display: flex;
    flex-direction: column;
    gap: var(--space-molecule);
    
    .input-group {
      label {
        font-family: var(--font-mono);
        font-size: 0.7rem;
        color: var(--color-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.2em;
        display: block;
        margin-bottom: var(--space-quantum);
      }
      
      input {
        width: 100%;
        padding: var(--space-molecule);
        background: var(--color-glass-panel);
        border: 1px solid var(--color-glass-border);
        border-radius: 6px;
        color: var(--color-text-primary);
        font-family: var(--font-mono);
        font-size: 0.9rem;
        
        &:focus {
          outline: none;
          border-color: var(--color-text-accent);
          box-shadow: 0 0 0 2px var(--color-text-accent);
        }
      }
    }
  }
  
  .celestial-timing {
    background: var(--color-glass-surface);
    border: 1px solid var(--color-glass-border);
    border-radius: 8px;
    padding: var(--space-molecule);
    margin: var(--space-molecule) 0;
    position: relative;
    overflow: hidden;
    
    /* Cryptic timing analysis backdrop */
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        /* Base crypto layer */
        linear-gradient(var(--color-glass-surface), var(--color-glass-surface)),
        /* Algorithmic pattern recognition */
        url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&q=80&auto=format&fit=crop'),
        /* Trading intelligence network */
        url('https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&q=40&auto=format&fit=crop');
      background-size: cover, cover, cover;
      background-position: center, center, center bottom;
      background-blend-mode: normal, soft-light, multiply;
      z-index: 0;
      opacity: 0.25;
      animation: timing-analysis 12s ease-in-out infinite;
    }
    
    /* Tokenized verification border */
    &::after {
      content: '';
      position: absolute;
      top: -1px;
      left: -1px;
      right: -1px;
      bottom: -1px;
      background: linear-gradient(90deg, 
        rgba(0, 255, 150, 0.3) 0%, 
        transparent 20%, 
        transparent 80%, 
        rgba(0, 150, 255, 0.3) 100%);
      border-radius: 9px;
      z-index: -1;
      animation: verification-scan 6s linear infinite;
    }
    
    @keyframes timing-analysis {
      0%, 100% { opacity: 0.2; }
      50% { opacity: 0.35; }
    }
    
    @keyframes verification-scan {
      0% { opacity: 0.2; }
      50% { opacity: 0.8; }
      100% { opacity: 0.2; }
    }
    
    .timing-header {
      font-family: var(--font-display);
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--color-text-accent);
      text-transform: uppercase;
      margin-bottom: var(--space-atom);
      position: relative;
      z-index: 2;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
    }
    
    .timing-advice {
      font-family: var(--font-primary);
      font-size: 0.8rem;
      color: var(--color-text-secondary);
      line-height: 1.4;
      position: relative;
      z-index: 2;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
    }
    
    .planetary-alignment {
      display: flex;
      justify-content: space-between;
      margin-top: var(--space-atom);
      font-family: var(--font-mono);
      font-size: 0.7rem;
      position: relative;
      z-index: 2;
      
      .alignment-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        
        .planet {
          color: var(--color-text-accent);
          font-weight: 600;
        }
        
        .influence {
          color: var(--color-text-muted);
        }
      }
    }
  }
  
  .execute-button {
    width: 100%;
    padding: var(--space-molecule);
    background: var(--color-text-accent);
    border: none;
    border-radius: 8px;
    color: white;
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 600;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: var(--space-molecule);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--glass-shadow-depth);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
  }
`;

const AstroSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-molecule);
  
  @media (max-width: 1200px) {
    grid-column: 1;
  }
`;

interface MarketData {
  title: string;
  description: string;
  yesPrice: number;
  noPrice: number;
  volume: number;
  endDate: string;
  category: string;
}

const TradeMarketPage: React.FC = () => {
  const router = useRouter();
  const { market } = router.query;
  const [selectedSide, setSelectedSide] = useState<'yes' | 'no'>('yes');
  const [amount, setAmount] = useState('');
  const [shares, setShares] = useState('');
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [lunarPhase, setLunarPhase] = useState('Waxing Gibbous');
  const [mercuryRetrograde, setMercuryRetrograde] = useState(false);
  const [celestialTiming, setCelestialTiming] = useState('Favorable');

  // Mock order book data
  const orderBook = {
    yes: [
      { price: 0.67, size: 1250, total: 1250 },
      { price: 0.66, size: 890, total: 2140 },
      { price: 0.65, size: 1560, total: 3700 },
      { price: 0.64, size: 2100, total: 5800 },
      { price: 0.63, size: 950, total: 6750 }
    ],
    no: [
      { price: 0.33, size: 1100, total: 1100 },
      { price: 0.34, size: 780, total: 1880 },
      { price: 0.35, size: 1340, total: 3220 },
      { price: 0.36, size: 1900, total: 5120 },
      { price: 0.37, size: 850, total: 5970 }
    ]
  };

  useEffect(() => {
    if (market) {
      // Mock market data - in real app would fetch from API
      setMarketData({
        title: "Fed Rate Cut March 2025",
        description: "Will the Federal Reserve cut interest rates by at least 25 basis points in March 2025?",
        yesPrice: 0.67,
        noPrice: 0.33,
        volume: 21000000,
        endDate: "March 31, 2025",
        category: "Economics"
      });
    }

    // Simulate celestial calculations
    const updateCelestialData = () => {
      const phases = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
      setLunarPhase(phases[Math.floor(Math.random() * phases.length)]);
      setMercuryRetrograde(Math.random() > 0.8); // 20% chance
      
      const timings = ['Highly Favorable', 'Favorable', 'Neutral', 'Caution Advised', 'Unfavorable'];
      setCelestialTiming(timings[Math.floor(Math.random() * timings.length)]);
    };

    updateCelestialData();
    const interval = setInterval(updateCelestialData, 30000);
    return () => clearInterval(interval);
  }, [market]);

  const handleTrade = () => {
    console.log('Executing trade with celestial alignment:', {
      side: selectedSide,
      amount,
      shares,
      lunarPhase,
      mercuryRetrograde,
      celestialTiming
    });
  };

  if (!marketData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Trade {marketData.title} - LOKI 2032</title>
        <meta name="description" content={`Trade ${marketData.title} with astrological intelligence and cosmic timing insights`} />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔮</text></svg>" />
      </Head>
      
      <TradePage>
      <TradingGrid>
        <MarketHeader depth="deep">
          <div className="market-info">
            <h1 className="market-title">{marketData.title}</h1>
            <p className="market-description">{marketData.description}</p>
          </div>
          
          <div className="celestial-indicators">
            <div className="lunar-phase">
              <div className="phase-icon"></div>
              <span className="phase-label">{lunarPhase}</span>
            </div>
            
            <div className="mercury-status">
              <div className="mercury-icon"></div>
              <span className="mercury-label">
                {mercuryRetrograde ? 'Retrograde' : 'Direct'}
              </span>
            </div>
          </div>
        </MarketHeader>

        <CelestialChartContainer depth="deep">
          <div className="chart-header">
            Celestial Price Analysis - {marketData?.title}
          </div>
          <CelestialPriceChart 
            symbol={marketData?.title || 'Market Analysis'}
            timeframe="1D"
          />
        </CelestialChartContainer>

        <TradingPanel depth="deep">
          <div className="panel-header">
            Celestial Trading Interface
            <div className="astro-confidence">
              Cosmic Confidence: {celestialTiming}
            </div>
          </div>

          <OrderBook>
            <div className="book-side">
              <div className="side-header yes-side">YES - {(marketData.yesPrice * 100).toFixed(0)}¢</div>
              {orderBook.yes.map((level, index) => (
                <div key={index} className="price-level">
                  <span className="price yes">{(level.price * 100).toFixed(0)}¢</span>
                  <span className="size">{level.size.toLocaleString()}</span>
                  <span className="total">{level.total.toLocaleString()}</span>
                </div>
              ))}
            </div>
            
            <div className="book-side">
              <div className="side-header no-side">NO - {(marketData.noPrice * 100).toFixed(0)}¢</div>
              {orderBook.no.map((level, index) => (
                <div key={index} className="price-level">
                  <span className="price no">{(level.price * 100).toFixed(0)}¢</span>
                  <span className="size">{level.size.toLocaleString()}</span>
                  <span className="total">{level.total.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </OrderBook>

          <TradeForm>
            <div className="position-selector">
              <button 
                className={`yes ${selectedSide === 'yes' ? 'active' : ''}`}
                onClick={() => setSelectedSide('yes')}
              >
                Buy YES
              </button>
              <button 
                className={`no ${selectedSide === 'no' ? 'active' : ''}`}
                onClick={() => setSelectedSide('no')}
              >
                Buy NO
              </button>
            </div>

            <div className="celestial-timing">
              <div className="timing-header">Planetary Alignment Analysis</div>
              <div className="timing-advice">
                {celestialTiming === 'Highly Favorable' && "The stars align for strong bullish momentum. Venus-Jupiter conjunction supports wealth accumulation."}
                {celestialTiming === 'Favorable' && "Positive celestial energy supports measured position taking. Moon phase favors gradual accumulation."}
                {celestialTiming === 'Neutral' && "Balanced cosmic forces. Technical analysis should guide entry timing over astrological factors."}
                {celestialTiming === 'Caution Advised' && "Mars-Saturn tension creates market volatility. Consider smaller position sizes during this period."}
                {celestialTiming === 'Unfavorable' && "Mercury retrograde warns against major position changes. Focus on risk management over new entries."}
              </div>
              
              <div className="planetary-alignment">
                <div className="alignment-item">
                  <span className="planet">☿</span>
                  <span className="influence">{mercuryRetrograde ? 'RX' : 'DIR'}</span>
                </div>
                <div className="alignment-item">
                  <span className="planet">♀</span>
                  <span className="influence">FAV</span>
                </div>
                <div className="alignment-item">
                  <span className="planet">♂</span>
                  <span className="influence">NEU</span>
                </div>
                <div className="alignment-item">
                  <span className="planet">♃</span>
                  <span className="influence">FAV</span>
                </div>
                <div className="alignment-item">
                  <span className="planet">♄</span>
                  <span className="influence">CAU</span>
                </div>
              </div>
            </div>

            <div className="trade-inputs">
              <div className="input-group">
                <label>Amount (USD)</label>
                <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount..."
                />
              </div>
              
              <div className="input-group">
                <label>Shares</label>
                <input 
                  type="number" 
                  value={shares} 
                  onChange={(e) => setShares(e.target.value)}
                  placeholder="Auto-calculated..."
                  readOnly
                />
              </div>
            </div>

            <button 
              className="execute-button"
              onClick={handleTrade}
              disabled={!amount || celestialTiming === 'Unfavorable'}
            >
              Execute Cosmic Trade
            </button>
          </TradeForm>
        </TradingPanel>

        <AstroSidebar>
          <AstrologicalPredictor />
        </AstroSidebar>
      </TradingGrid>
      </TradePage>
    </>
  );
};

export default TradeMarketPage;