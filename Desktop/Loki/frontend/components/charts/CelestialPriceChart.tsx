import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { celestialDataService, MarketCelestialData, PlanetaryPosition } from '../../services/CelestialDataService';

const ChartContainer = styled(motion.div)`
  width: 100%;
  height: 400px;
  position: relative;
  background: var(--color-glass-base);
  border: 1px solid var(--color-glass-border);
  border-radius: 12px;
  overflow: hidden;
  backdrop-filter: var(--glass-blur-strong);
  
  /* Celestial trading chart backdrop */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      /* Astronomical chart overlay */
      linear-gradient(var(--color-glass-base), var(--color-glass-base)),
      url('https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&q=80&auto=format&fit=crop'),
      url('https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&q=40&auto=format&fit=crop');
    background-size: cover, cover, cover;
    background-position: center, center, center bottom;
    background-blend-mode: normal, overlay, multiply;
    z-index: 0;
    opacity: 0.1;
    animation: stellar-drift 60s linear infinite;
  }
  
  @keyframes stellar-drift {
    0% { background-position: center, center, center bottom; }
    100% { background-position: center, center top, center; }
  }
`;

const ChartCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
`;

const PlanetaryOverlay = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: var(--color-glass-surface);
  backdrop-filter: var(--glass-blur-strong);
  border: 1px solid var(--color-glass-border);
  border-radius: 8px;
  padding: 12px;
  z-index: 3;
  min-width: 180px;
`;

const PlanetaryHeader = styled.div`
  font-family: var(--font-display);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
  text-align: center;
  
  .astro-confidence {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: var(--color-text-accent);
    font-weight: 400;
    margin-top: 4px;
  }
`;

const PlanetRow = styled(motion.div)<{ influence: 'bullish' | 'bearish' | 'neutral'; retrograde: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;
  border-radius: 4px;
  margin-bottom: 4px;
  background: ${props => 
    props.influence === 'bullish' ? 'rgba(0, 200, 100, 0.1)' :
    props.influence === 'bearish' ? 'rgba(255, 80, 80, 0.1)' :
    'rgba(255, 255, 255, 0.05)'
  };
  border: 1px solid ${props =>
    props.influence === 'bullish' ? 'rgba(0, 200, 100, 0.3)' :
    props.influence === 'bearish' ? 'rgba(255, 80, 80, 0.3)' :
    'var(--color-glass-border)'
  };
  
  ${props => props.retrograde && `
    animation: retrograde-pulse 3s ease-in-out infinite;
    border-style: dashed;
    
    @keyframes retrograde-pulse {
      0%, 100% { opacity: 0.7; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.02); }
    }
  `}
  
  .planet-symbol {
    font-size: 1rem;
    color: ${props => props.retrograde ? '#ff6b6b' : 'var(--color-text-accent)'};
    margin-right: 8px;
    ${props => props.retrograde && 'filter: drop-shadow(0 0 4px #ff6b6b);'}
  }
  
  .planet-name {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--color-text-secondary);
    flex: 1;
    ${props => props.retrograde && 'text-decoration: line-through;'}
  }
  
  .planet-status {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    color: ${props =>
      props.influence === 'bullish' ? 'var(--color-profit)' :
      props.influence === 'bearish' ? 'var(--color-loss)' :
      'var(--color-text-muted)'
    };
    text-transform: uppercase;
    font-weight: 600;
  }
`;

const LunarPhaseIndicator = styled.div<{ phase: number }>`
  position: absolute;
  top: 20px;
  left: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-text-accent);
  position: relative;
  z-index: 3;
  box-shadow: 0 0 15px rgba(248, 179, 25, 0.5);
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => 2 + (36 * props.phase)}px;
    width: ${props => 36 - (36 * Math.abs(props.phase - 0.5) * 2)}px;
    height: 36px;
    background: var(--color-glass-base);
    border-radius: 50%;
  }
`;

const EventsOverlay = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  background: var(--color-glass-surface);
  backdrop-filter: var(--glass-blur-strong);
  border: 1px solid var(--color-glass-border);
  border-radius: 8px;
  padding: 8px 12px;
  z-index: 3;
  max-height: 80px;
  overflow-y: auto;
`;

const EventItem = styled.div<{ influence: 'bullish' | 'bearish' | 'neutral' }>`
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: ${props =>
    props.influence === 'bullish' ? 'var(--color-profit)' :
    props.influence === 'bearish' ? 'var(--color-loss)' :
    'var(--color-text-muted)'
  };
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  .event-time {
    color: var(--color-text-muted);
    min-width: 40px;
  }
  
  .event-description {
    flex: 1;
  }
`;

interface CelestialPriceChartProps {
  symbol?: string;
  timeframe?: '1H' | '1D' | '1W' | '1M';
}

export const CelestialPriceChart: React.FC<CelestialPriceChartProps> = ({
  symbol = "Fed Rate Cut March 2025",
  timeframe = '1D'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [chartData, setChartData] = useState<MarketCelestialData[]>([]);
  const [currentData, setCurrentData] = useState<MarketCelestialData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = celestialDataService.subscribe((data) => {
      setChartData(data);
      setCurrentData(data[data.length - 1] || null);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!chartData.length || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    drawChart(ctx, rect.width, rect.height, chartData);
  }, [chartData, timeframe]);

  const drawChart = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    data: MarketCelestialData[]
  ) => {
    const padding = { top: 40, right: 200, bottom: 80, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Get data for selected timeframe
    const days = timeframe === '1H' ? 1 : timeframe === '1D' ? 7 : timeframe === '1W' ? 30 : 90;
    const chartData = data.slice(-days);
    
    if (!chartData.length) return;

    // Calculate price range
    const prices = chartData.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    const pricePadding = priceRange * 0.1;

    // Helper functions
    const getX = (index: number) => padding.left + (index / (chartData.length - 1)) * chartWidth;
    const getY = (price: number) => padding.top + ((maxPrice + pricePadding - price) / (priceRange + 2 * pricePadding)) * chartHeight;

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    // Horizontal grid lines (price levels)
    for (let i = 0; i <= 5; i++) {
      const price = minPrice - pricePadding + (i / 5) * (priceRange + 2 * pricePadding);
      const y = getY(price);
      
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      // Price labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '10px JetBrains Mono';
      ctx.textAlign = 'right';
      ctx.fillText(`$${price.toFixed(2)}`, padding.left - 10, y + 4);
    }

    // Vertical grid lines (time)
    const timePoints = Math.min(8, chartData.length);
    for (let i = 0; i < timePoints; i++) {
      const x = padding.left + (i / (timePoints - 1)) * chartWidth;
      
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.stroke();
    }

    // Draw celestial influence background
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < chartData.length - 1; i++) {
      const data1 = chartData[i];
      const data2 = chartData[i + 1];
      
      const x1 = getX(i);
      const x2 = getX(i + 1);
      const y1 = getY(data1.price);
      const y2 = getY(data2.price);

      // Color based on celestial influence
      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      if (data1.dominantInfluence === 'bullish') {
        gradient.addColorStop(0, 'rgba(0, 255, 150, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 200, 100, 0.1)');
      } else if (data1.dominantInfluence === 'bearish') {
        gradient.addColorStop(0, 'rgba(255, 80, 80, 0.2)');
        gradient.addColorStop(1, 'rgba(200, 60, 60, 0.1)');
      } else {
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
      }

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x2, height - padding.bottom);
      ctx.lineTo(x1, height - padding.bottom);
      ctx.closePath();
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Draw price line
    ctx.strokeStyle = '#F8B319';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#F8B319';
    ctx.shadowBlur = 8;
    
    ctx.beginPath();
    chartData.forEach((data, index) => {
      const x = getX(index);
      const y = getY(data.price);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw planetary influence markers
    chartData.forEach((data, index) => {
      const x = getX(index);
      const y = getY(data.price);

      // Mercury retrograde indicators
      if (data.mercuryRetrograde) {
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.arc(x, y - 20, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Retrograde symbol
        ctx.fillStyle = 'rgba(255, 107, 107, 0.8)';
        ctx.font = '12px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.fillText('℞', x, y - 30);
      }

      // Major celestial events
      if (data.celestialEvents.length > 0) {
        const event = data.celestialEvents[0];
        ctx.fillStyle = event.influence === 'bullish' ? '#00c864' : 
                       event.influence === 'bearish' ? '#ff5050' : '#ffa500';
        
        ctx.beginPath();
        ctx.moveTo(x, y + 15);
        ctx.lineTo(x - 5, y + 25);
        ctx.lineTo(x + 5, y + 25);
        ctx.closePath();
        ctx.fill();
      }

      // Lunar phase indicators
      const lunarRadius = 3 + (data.lunarPhase * 5);
      ctx.fillStyle = `rgba(248, 179, 25, ${0.3 + data.lunarPhase * 0.4})`;
      ctx.beginPath();
      ctx.arc(x, y + 30, lunarRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw current price dot
    if (chartData.length > 0) {
      const lastData = chartData[chartData.length - 1];
      const x = getX(chartData.length - 1);
      const y = getY(lastData.price);
      
      ctx.fillStyle = '#F8B319';
      ctx.shadowColor = '#F8B319';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // Current price label
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(x + 15, y - 15, 80, 20);
      ctx.fillStyle = '#F8B319';
      ctx.font = 'bold 12px JetBrains Mono';
      ctx.textAlign = 'left';
      ctx.fillText(`$${lastData.price.toFixed(2)}`, x + 20, y - 2);
    }

    // Draw title
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 14px JetBrains Mono';
    ctx.textAlign = 'left';
    ctx.fillText(`${symbol} - Celestial Analysis`, padding.left, 25);
  };

  if (isLoading || !currentData) {
    return (
      <ChartContainer>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100%',
          color: 'var(--color-text-muted)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.9rem'
        }}>
          Loading celestial market data...
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ChartCanvas ref={canvasRef} />
      
      <LunarPhaseIndicator phase={currentData.lunarPhase} />
      
      <PlanetaryOverlay>
        <PlanetaryHeader>
          Planetary Influences
          <div className="astro-confidence">
            Confidence: {(currentData.astroConfidence * 100).toFixed(0)}%
          </div>
        </PlanetaryHeader>
        
        {currentData.planetaryPositions.map((planet, index) => (
          <PlanetRow
            key={planet.name}
            influence={planet.influence}
            retrograde={planet.retrograde}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <span className="planet-symbol">{planet.symbol}</span>
            <span className="planet-name">
              {planet.name}{planet.retrograde ? ' ℞' : ''}
            </span>
            <span className="planet-status">
              {planet.influence === 'bullish' ? '▲' : 
               planet.influence === 'bearish' ? '▼' : '●'}
            </span>
          </PlanetRow>
        ))}
      </PlanetaryOverlay>

      <EventsOverlay>
        {currentData.celestialEvents.slice(0, 3).map((event, index) => (
          <EventItem key={index} influence={event.influence}>
            <span className="event-time">
              {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="event-description">{event.description}</span>
          </EventItem>
        ))}
        {currentData.celestialEvents.length === 0 && (
          <EventItem influence="neutral">
            <span className="event-description">No major celestial events</span>
          </EventItem>
        )}
      </EventsOverlay>
    </ChartContainer>
  );
};