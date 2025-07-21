import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

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
  animation: ${scrollTicker} 60s linear infinite;
  will-change: transform;
`;

const TickerItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-quantum);
  white-space: nowrap;
  
  .ticker-symbol {
    color: var(--color-text-primary);
    font-weight: 500;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
  }
  
  .ticker-price {
    color: var(--color-accent-amber);
    font-weight: 400;
    font-size: 0.75rem;
  }
  
  .ticker-change {
    font-size: 0.7rem;
    font-weight: 400;
    
    &.positive {
      color: var(--color-profit);
    }
    
    &.negative {
      color: var(--color-loss);
    }
  }
`;

interface TickerData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

const RealTimeTicker: React.FC = () => {
  const [tickerData, setTickerData] = useState<TickerData[]>([
    { symbol: 'SPY', price: 589.42, change: 2.67, changePercent: 0.45 },
    { symbol: 'QQQ', price: 512.18, change: -0.61, changePercent: -0.12 },
    { symbol: 'BTC', price: 98245, change: 2245.67, changePercent: 2.34 },
    { symbol: 'ETH', price: 3876.50, change: 89.23, changePercent: 2.36 },
    { symbol: 'AAPL', price: 234.85, change: -1.24, changePercent: -0.52 },
    { symbol: 'GOOGL', price: 189.76, change: 3.45, changePercent: 1.85 },
    { symbol: 'TSLA', price: 345.12, change: 12.34, changePercent: 3.71 },
    { symbol: 'MSFT', price: 456.78, change: -2.34, changePercent: -0.51 },
    { symbol: 'AMZN', price: 178.90, change: 4.56, changePercent: 2.62 },
    { symbol: 'NVDA', price: 892.34, change: 23.45, changePercent: 2.70 },
  ]);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerData(prevData => 
        prevData.map(item => {
          const randomChange = (Math.random() - 0.5) * 2; // -1 to +1
          const priceChange = item.price * (randomChange / 100);
          const newPrice = Math.max(0.01, item.price + priceChange);
          const change = newPrice - item.price;
          const changePercent = (change / item.price) * 100;

          return {
            ...item,
            price: newPrice,
            change: change,
            changePercent: changePercent,
          };
        })
      );
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number, symbol: string): string => {
    if (symbol === 'BTC' || symbol === 'ETH') {
      return price.toLocaleString('en-US', { maximumFractionDigits: 0 });
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
              {item.symbol === 'BTC' || item.symbol === 'ETH' ? '$' : ''}
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
              {item.symbol === 'BTC' || item.symbol === 'ETH' ? '$' : ''}
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