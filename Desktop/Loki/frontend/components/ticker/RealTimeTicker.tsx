import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { marketDataService, MarketData } from '../../services/MarketDataService';

const scrollTicker = keyframes`
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
`;

const TickerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-molecule);
  overflow: hidden;
  white-space: nowrap;
  position: relative;
  min-width: 0;
  flex: 1;
`;

const TickerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-solar);
  animation: ${scrollTicker} 120s linear infinite;
  will-change: transform;
`;

const TickerItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-quantum);
  white-space: nowrap;
  
  .ticker-symbol {
    color: var(--color-text-primary);
    font-weight: 700;
    font-size: 0.7rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    font-variant-numeric: tabular-nums;
  }
  
  .ticker-price {
    color: var(--color-accent-amber);
    font-weight: 600;
    font-size: 0.7rem;
    font-variant-numeric: tabular-nums;
  }
  
  .ticker-change {
    font-size: 0.65rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    
    &.positive {
      color: var(--color-profit);
    }
    
    &.negative {
      color: var(--color-loss);
    }
  }
`;

const RealTimeTicker: React.FC = () => {
  const [tickerData, setTickerData] = useState<MarketData[]>([]); 
  
  useEffect(() => {
    // Start market data service
    marketDataService.start();
    
    // Subscribe to market data updates
    const handleMarketData = (data: MarketData[]) => {
      setTickerData(data);
    };
    
    marketDataService.subscribe(handleMarketData);
    
    return () => {
      marketDataService.unsubscribe(handleMarketData);
    };
  }, []);


  const formatPrice = (price: number, symbol: string): string => {
    if (symbol === 'BTC' || symbol === 'ETH' || symbol === 'SOL') {
      return price.toLocaleString('en-US', { maximumFractionDigits: 0 });
    }
    if (symbol === 'ADA' || price < 10) {
      return price.toFixed(3);
    }
    return price.toFixed(2);
  };

  const formatChange = (change: number): string => {
    return `${change >= 0 ? '+' : ''}${change.toFixed(2)}`;
  };

  const formatChangePercent = (changePercent: number): string => {
    return `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`;
  };

  return (
    <TickerContainer>
      <TickerWrapper>
        {tickerData.map((item, index) => (
          <TickerItem key={`${item.symbol}-${index}`}>
            <span className="ticker-symbol">{item.symbol}</span>
            <span className="ticker-price">
              {['BTC', 'ETH', 'SOL', 'ADA'].includes(item.symbol) ? '$' : ''}
              {formatPrice(item.price, item.symbol)}
            </span>
            <span className={`ticker-change ${item.changePercent >= 0 ? 'positive' : 'negative'}`}>
              {formatChangePercent(item.changePercent)}
            </span>
          </TickerItem>
        ))}
        {/* Duplicate for seamless scrolling */}
        {tickerData.map((item, index) => (
          <TickerItem key={`${item.symbol}-duplicate-${index}`}>
            <span className="ticker-symbol">{item.symbol}</span>
            <span className="ticker-price">
              {['BTC', 'ETH', 'SOL', 'ADA'].includes(item.symbol) ? '$' : ''}
              {formatPrice(item.price, item.symbol)}
            </span>
            <span className={`ticker-change ${item.changePercent >= 0 ? 'positive' : 'negative'}`}>
              {formatChangePercent(item.changePercent)}
            </span>
          </TickerItem>
        ))}
      </TickerWrapper>
    </TickerContainer>
  );
};

export default RealTimeTicker;