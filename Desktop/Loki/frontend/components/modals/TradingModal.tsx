import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { NeomorphicSurface } from '../loki-2032/NeomorphicSurface';
import { marketDataService, Position, OrderBook } from '../../services/MarketDataService';
import { AstrologicalPredictor } from '../astro/AstrologicalPredictor';

const TradingContainer = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: var(--space-molecule);
  height: 100%;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-molecule);
  height: 100%;
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-molecule);
  height: 100%;
`;

const OrderForm = styled(NeomorphicSurface)`
  padding: var(--space-molecule);
  position: relative;
  overflow: hidden;
  
  /* Hypnotic trading floor background */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      linear-gradient(var(--color-glass-base), var(--color-glass-base)),
      url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80&auto=format&fit=crop');
    background-size: cover;
    background-position: center;
    z-index: 0;
  }
  
  .form-header {
    font-family: var(--font-display);
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-text-primary);
    text-transform: uppercase;
    letter-spacing: 0.2em;
    margin-bottom: var(--space-molecule);
    text-align: center;
    position: relative;
    z-index: 2;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
    font-variant-numeric: tabular-nums;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--space-molecule);
  margin-bottom: var(--space-molecule);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-quantum);
  position: relative;
  z-index: 2;
  
  label {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 400;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-variant-numeric: tabular-nums;
  }
  
  input, select {
    background: var(--color-glass-panel);
    backdrop-filter: var(--glass-blur-subtle);
    border: 1px solid var(--color-glass-border);
    border-radius: 6px;
    padding: var(--space-atom) var(--space-molecule);
    color: var(--color-text-primary);
    font-family: var(--font-mono);
    font-size: 0.8rem;
    font-weight: 200;
    transition: all 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: var(--color-text-accent);
      box-shadow: 0 0 0 2px var(--color-text-accent);
      background: var(--color-glass-surface);
    }
    
    &::placeholder {
      color: var(--color-text-muted);
      font-weight: 200;
    }
  }
`;

const OrderButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-molecule);
  margin-top: var(--space-molecule);
`;

const ActionButton = styled(motion.button)<{ variant: 'buy' | 'sell' }>`
  background: ${({ variant }) => 
    variant === 'buy' ? 'var(--color-profit)' : 'var(--color-loss)'};
  backdrop-filter: var(--glass-blur-medium);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: var(--space-molecule);
  color: white;
  font-family: var(--font-display);
  font-size: 0.9rem;
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--glass-shadow-depth);
    background: ${({ variant }) => 
      variant === 'buy' ? 'rgba(0, 200, 100, 0.95)' : 'rgba(255, 80, 80, 0.95)'};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const PositionsPanel = styled(NeomorphicSurface)`
  flex: 1;
  padding: var(--space-molecule);
  display: flex;
  flex-direction: column;
  min-height: 200px;
  
  .positions-header {
    font-family: var(--font-display);
    font-size: 0.9rem;
    font-weight: 200;
    color: var(--color-text-primary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: var(--space-molecule);
    
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .total-pnl {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      font-weight: 300;
      color: var(--color-profit);
    }
  }
`;

const PositionItem = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: var(--space-molecule);
  align-items: center;
  padding: var(--space-atom) 0;
  border-bottom: 1px solid var(--color-glass-border);
  
  &:last-child {
    border-bottom: none;
  }
  
  .position-symbol {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    font-weight: 300;
    color: var(--color-text-primary);
    letter-spacing: 0.05em;
  }
  
  .position-size {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 200;
    color: var(--color-text-secondary);
    text-align: right;
  }
  
  .position-price {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 200;
    color: var(--color-text-accent);
    text-align: right;
  }
  
  .position-pnl {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 300;
    text-align: right;
    
    &.positive { color: var(--color-profit); }
    &.negative { color: var(--color-loss); }
  }
`;

const OrderBookPanel = styled(NeomorphicSurface)`
  padding: var(--space-molecule);
  
  .orderbook-header {
    font-family: var(--font-display);
    font-size: 0.9rem;
    font-weight: 200;
    color: var(--color-text-primary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: var(--space-molecule);
    text-align: center;
  }
  
  .orderbook-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-molecule);
  }
  
  .orderbook-side {
    .side-header {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      font-weight: 200;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: var(--space-atom);
      text-align: center;
      
      &.bids { color: var(--color-profit); }
      &.asks { color: var(--color-loss); }
    }
    
    .order-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-quantum);
      padding: 2px 0;
      font-family: var(--font-mono);
      font-size: 0.7rem;
      font-weight: 200;
      
      .price {
        text-align: left;
        &.bid { color: var(--color-profit); }
        &.ask { color: var(--color-loss); }
      }
      
      .size {
        text-align: right;
        color: var(--color-text-muted);
      }
    }
  }
`;

export const TradingModal: React.FC = () => {
  const [orderType, setOrderType] = useState('limit');
  const [symbol, setSymbol] = useState('BTC');
  const [side, setSide] = useState('buy');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [positions, setPositions] = useState<Position[]>([]);
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null);
  const [portfolio, setPortfolio] = useState(marketDataService.getPortfolio());
  const [orderStatus, setOrderStatus] = useState<string>('');

  useEffect(() => {
    // Start market data service
    marketDataService.start();
    
    // Load initial data
    setPositions(marketDataService.getPortfolio().positions);
    setOrderBook(marketDataService.getOrderBook(symbol));
    
    // Update order book every second
    const orderBookInterval = setInterval(() => {
      const newOrderBook = marketDataService.getOrderBook(symbol);
      if (newOrderBook) {
        setOrderBook(newOrderBook);
      }
    }, 1000);

    // Update positions every 2 seconds
    const positionsInterval = setInterval(() => {
      const newPortfolio = marketDataService.getPortfolio();
      setPositions(newPortfolio.positions);
      setPortfolio(newPortfolio);
    }, 2000);

    return () => {
      clearInterval(orderBookInterval);
      clearInterval(positionsInterval);
    };
  }, [symbol]);

  const handlePlaceOrder = () => {
    if (!quantity || (orderType === 'limit' && !price)) {
      setOrderStatus('Please fill all required fields');
      return;
    }

    const orderPrice = orderType === 'market' ? undefined : parseFloat(price);
    const orderSize = parseFloat(quantity);
    
    const success = marketDataService.placeDemoOrder(
      symbol, 
      side as 'buy' | 'sell', 
      orderSize, 
      orderPrice
    );

    if (success) {
      setOrderStatus(`${side.toUpperCase()} order placed successfully`);
      setQuantity('');
      setPrice('');
      // Update positions immediately
      setPositions(marketDataService.getPortfolio().positions);
      setPortfolio(marketDataService.getPortfolio());
    } else {
      setOrderStatus('Order failed - insufficient buying power');
    }

    // Clear status after 3 seconds
    setTimeout(() => setOrderStatus(''), 3000);
  };

  const formatPrice = (price: number): string => {
    if (symbol === 'BTC' || symbol === 'ETH' || symbol === 'SOL') {
      return price.toLocaleString('en-US', { 
        minimumFractionDigits: 0,
        maximumFractionDigits: 0 
      });
    }
    return price.toLocaleString('en-US', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    });
  };

  const formatPnL = (pnl: number): string => {
    const sign = pnl >= 0 ? '+' : '';
    return `${sign}$${pnl.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  return (
    <TradingContainer>
      <LeftPanel>
        <AstrologicalPredictor />
      </LeftPanel>
      
      <RightPanel>
        <OrderForm depth="deep">
        <div className="form-header">Order Entry</div>
        
        <FormRow>
          <FormGroup>
            <label>Symbol</label>
            <select value={symbol} onChange={(e) => setSymbol(e.target.value)}>
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
              <option value="SOL">SOL</option>
              <option value="AAPL">AAPL</option>
              <option value="TSLA">TSLA</option>
              <option value="SPY">SPY</option>
              <option value="NVDA">NVDA</option>
              <option value="GOOGL">GOOGL</option>
            </select>
          </FormGroup>
          
          <FormGroup>
            <label>Type</label>
            <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
              <option value="limit">Limit</option>
              <option value="market">Market</option>
              <option value="stop">Stop</option>
              <option value="stop-limit">Stop Limit</option>
            </select>
          </FormGroup>
        </FormRow>

        <FormRow>
          <FormGroup>
            <label>Quantity</label>
            <input
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0.00"
            />
          </FormGroup>
          
          <FormGroup>
            <label>Price</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              disabled={orderType === 'market'}
            />
          </FormGroup>
        </FormRow>

        <OrderButtons>
          <ActionButton
            variant="buy"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSide('buy');
              handlePlaceOrder();
            }}
          >
            Buy {symbol}
          </ActionButton>
          <ActionButton
            variant="sell"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSide('sell');
              handlePlaceOrder();
            }}
          >
            Sell {symbol}
          </ActionButton>
        </OrderButtons>
        
        {orderStatus && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: 'var(--space-atom)',
              padding: 'var(--space-atom)',
              background: orderStatus.includes('successfully') ? 'var(--color-profit)' : 'var(--color-loss)',
              color: 'white',
              borderRadius: '4px',
              fontSize: '0.8rem',
              textAlign: 'center',
              fontFamily: 'var(--font-mono)',
              fontWeight: '600'
            }}
          >
            {orderStatus}
          </motion.div>
        )}
      </OrderForm>

      <PositionsPanel depth="medium">
        <div className="positions-header">
          Open Positions
          <span className="total-pnl">{formatPnL(portfolio.totalPnl)}</span>
        </div>
        
        {positions.map((position, index) => (
          <PositionItem
            key={position.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <span className="position-symbol">{position.symbol}</span>
            <span className="position-size">{position.size}</span>
            <span className="position-price">${formatPrice(position.currentPrice)}</span>
            <span className={`position-pnl ${position.unrealizedPnl >= 0 ? 'positive' : 'negative'}`}>
              {formatPnL(position.unrealizedPnl)}
            </span>
          </PositionItem>
        ))}
      </PositionsPanel>

      <OrderBookPanel depth="medium">
        <div className="orderbook-header">Order Book - {symbol}</div>
        
        <div className="orderbook-grid">
          <div className="orderbook-side">
            <div className="side-header bids">Bids</div>
            {orderBook?.bids.slice(0, 5).map((bid, index) => (
              <motion.div
                key={index}
                className="order-row"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
              >
                <span className="price bid">{formatPrice(bid.price)}</span>
                <span className="size">{bid.size.toFixed(2)}</span>
              </motion.div>
            ))}
          </div>
          
          <div className="orderbook-side">
            <div className="side-header asks">Asks</div>
            {orderBook?.asks.slice(0, 5).map((ask, index) => (
              <motion.div
                key={index}
                className="order-row"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
              >
                <span className="price ask">{formatPrice(ask.price)}</span>
                <span className="size">{ask.size.toFixed(2)}</span>
              </motion.div>
            ))}
          </div>
        </div>
        
        {orderBook && (
          <div style={{ 
            textAlign: 'center', 
            marginTop: 'var(--space-atom)',
            fontSize: '0.7rem',
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-mono)'
          }}>
            Spread: ${orderBook.spread.toFixed(2)}
          </div>
        )}
      </OrderBookPanel>
      </RightPanel>
    </TradingContainer>
  );
};

export default TradingModal;