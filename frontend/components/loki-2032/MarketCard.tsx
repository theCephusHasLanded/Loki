import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { NeomorphicSurface } from './NeomorphicSurface';
import { TrendingUp, TrendingDown, Zap, Activity, Shield, Hash, Database, Cpu, Hexagon } from 'lucide-react';
import styled from '@emotion/styled';
import { useAuth } from '../../contexts/AuthContext';

const CardContent = styled.div`
  padding: var(--space-molecule);
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  /* Cryptic tokenized background patterns */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      linear-gradient(var(--color-glass-base), var(--color-glass-base)),
      url('https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&q=80&auto=format&fit=crop');
    background-size: cover;
    background-position: center;
    z-index: 0;
    opacity: 0.08;
  }
  
  /* Hexagonal crypto pattern overlay */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 20%, rgba(0, 255, 150, 0.1) 0%, transparent 25%),
      radial-gradient(circle at 80% 80%, rgba(0, 150, 255, 0.1) 0%, transparent 25%),
      linear-gradient(45deg, transparent 45%, rgba(255, 255, 255, 0.02) 50%, transparent 55%);
    z-index: 1;
    animation: crypto-flow 30s ease-in-out infinite;
    pointer-events: none;
  }
  
  @keyframes crypto-flow {
    0%, 100% { transform: rotate(0deg) scale(1); opacity: 0.1; }
    50% { transform: rotate(2deg) scale(1.02); opacity: 0.15; }
  }
`;

const MarketHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-molecule);
  position: relative;
  z-index: 3;
  
  /* Cryptic header overlay */
  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    background: linear-gradient(45deg, 
      transparent 48%, 
      rgba(0, 255, 150, 0.05) 50%, 
      transparent 52%);
    border-radius: 8px;
    z-index: -1;
    animation: header-scan 4s ease-in-out infinite;
  }
  
  @keyframes header-scan {
    0%, 100% { opacity: 0; }
    50% { opacity: 1; }
  }
`;

const MarketTitle = styled.h3`
  font-family: var(--font-display);
  font-size: clamp(0.9rem, 2vw, 1.1rem);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.3;
  flex: 1;
  padding-right: 16px;
  letter-spacing: -0.01em;
  position: relative;
  z-index: 3;
  
  /* Cryptic text enhancement */
  text-shadow: 
    0 0 10px rgba(0, 255, 150, 0.3),
    0 1px 3px rgba(0, 0, 0, 0.8);
  
  /* Tokenized prefix */
  &::before {
    content: '#';
    position: absolute;
    left: -12px;
    top: 0;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--color-text-accent);
    opacity: 0.6;
    font-weight: 700;
  }
`;

const AIBadge = styled.div<{ confidence: number }>`
  display: flex;
  align-items: center;
  gap: var(--space-quantum);
  padding: var(--space-quantum) var(--space-atom);
  background: linear-gradient(135deg, 
    var(--color-glass-panel) 0%, 
    rgba(0, 255, 150, 0.1) 100%);
  backdrop-filter: var(--glass-blur-subtle);
  border: 1px solid rgba(0, 255, 150, 0.3);
  border-radius: var(--radius-small);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--color-text-accent);
  position: relative;
  z-index: 3;
  
  /* Tokenized glow effect */
  box-shadow: 
    var(--glass-inset-highlight),
    0 0 15px rgba(0, 255, 150, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  
  /* Crypto verification indicator */
  &::after {
    content: '';
    position: absolute;
    top: -2px;
    right: -2px;
    width: 6px;
    height: 6px;
    background: ${({ confidence }) => 
      confidence > 0.8 ? '#00ff96' : 
      confidence > 0.6 ? '#ffaa00' : '#ff4444'};
    border-radius: 50%;
    box-shadow: 0 0 8px currentColor;
    animation: confidence-pulse 2s ease-in-out infinite;
  }
  
  @keyframes confidence-pulse {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
  }
`;

const PriceSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-molecule);
  position: relative;
  z-index: 3;
  
  /* Tokenized price container */
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -8px;
    right: -8px;
    bottom: -2px;
    background: linear-gradient(90deg, 
      rgba(0, 255, 150, 0.05) 0%, 
      transparent 20%, 
      transparent 80%, 
      rgba(0, 150, 255, 0.05) 100%);
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.02);
    z-index: -1;
  }
`;

const PriceDisplay = styled.div`
  font-family: var(--font-mono);
  font-size: clamp(1.2rem, 3vw, 1.75rem);
  font-weight: 600;
  color: var(--color-accent-amber);
  display: flex;
  align-items: baseline;
  gap: 4px;
  position: relative;
  z-index: 3;
  
  /* Crypto price glow */
  text-shadow: 
    0 0 20px rgba(248, 179, 25, 0.4),
    0 2px 4px rgba(0, 0, 0, 0.8);
  
  /* Tokenized decimal indicator */
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(248, 179, 25, 0.5) 20%, 
      rgba(248, 179, 25, 0.8) 50%, 
      rgba(248, 179, 25, 0.5) 80%, 
      transparent 100%);
    animation: price-scan 3s ease-in-out infinite;
  }
  
  .currency {
    font-size: clamp(0.9rem, 2vw, 1.1rem);
    color: var(--color-text-muted);
    opacity: 0.7;
    
    /* Crypto symbol enhancement */
    &::before {
      content: '◊';
      margin-right: 2px;
      font-size: 0.8em;
      color: var(--color-text-accent);
    }
  }
  
  @keyframes price-scan {
    0%, 100% { opacity: 0.3; transform: scaleX(0.8); }
    50% { opacity: 1; transform: scaleX(1.2); }
  }
`;

const ChangeIndicator = styled(motion.div, {
  shouldForwardProp: (prop) => prop !== 'positive'
})<{ positive: boolean }>`
  display: flex;
  align-items: center;
  gap: var(--space-quantum);
  padding: var(--space-quantum) var(--space-atom);
  background: ${props => props.positive ? 
    'linear-gradient(135deg, rgba(0, 200, 100, 0.15) 0%, rgba(0, 150, 75, 0.10) 100%)' : 
    'linear-gradient(135deg, rgba(255, 80, 80, 0.15) 0%, rgba(200, 60, 60, 0.10) 100%)'};
  backdrop-filter: var(--glass-blur-subtle);
  border: 1px solid ${props => props.positive ? 
    'rgba(0, 200, 100, 0.25)' : 
    'rgba(255, 80, 80, 0.25)'};
  border-radius: var(--radius-small);
  color: ${props => props.positive ? 'var(--color-profit)' : 'var(--color-loss)'};
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 500;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-molecule);
  margin: var(--space-molecule) 0;
  position: relative;
  z-index: 3;
  
  /* Technical metrics container */
  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    background: 
      linear-gradient(45deg, rgba(0, 255, 150, 0.03) 0%, transparent 25%),
      linear-gradient(-45deg, rgba(0, 150, 255, 0.03) 0%, transparent 25%);
    border-radius: 8px;
    z-index: -1;
    animation: metrics-pulse 5s ease-in-out infinite;
  }
  
  @keyframes metrics-pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
`;

const MetricItem = styled.div`
  text-align: center;
  
  .metric-label {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: var(--space-quantum);
    font-weight: 500;
  }
  
  .metric-value {
    font-family: var(--font-display);
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-text-primary);
  }
`;

const VolumeBar = styled.div<{ volume: number }>`
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: var(--glass-blur-subtle);
  border-radius: 2px;
  overflow: hidden;
  margin-top: var(--space-atom);
  
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => Math.min(props.volume / 20000000 * 100, 100)}%;
    background: linear-gradient(90deg, 
      var(--color-text-accent) 0%, 
      var(--color-accent-crystal) 100%
    );
    border-radius: inherit;
    transition: width var(--transition-smooth);
  }
`;

const TechnicalComponents = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-atom);
  margin: var(--space-atom) 0;
  position: relative;
  z-index: 3;
  
  .tech-icon {
    width: 16px;
    height: 16px;
    color: var(--color-text-muted);
    opacity: 0.6;
    transition: all 0.3s ease;
    
    &:hover {
      color: var(--color-text-accent);
      opacity: 1;
      transform: scale(1.2);
    }
    
    &:nth-child(odd) {
      animation: tech-pulse-1 3s ease-in-out infinite;
    }
    
    &:nth-child(even) {
      animation: tech-pulse-2 3s ease-in-out infinite 1.5s;
    }
  }
  
  @keyframes tech-pulse-1 {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
  }
  
  @keyframes tech-pulse-2 {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.7; }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: var(--space-atom);
  margin-top: auto;
  padding-top: var(--space-molecule);
  position: relative;
  z-index: 3;
`;

const ActionButton = styled(motion.button)<{ variant: 'primary' | 'secondary' }>`
  flex: 1;
  padding: var(--space-molecule, 16px);
  border: none;
  border-radius: var(--radius-medium, 12px);
  font-family: var(--font-primary, "Space Grotesk", sans-serif);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  background: ${(props) => 
    props.variant === 'primary' 
      ? 'linear-gradient(135deg, var(--color-glass-accent) 0%, var(--color-glass-surface) 100%)'
      : 'var(--color-glass-panel)'
  };
  
  backdrop-filter: var(--glass-blur-medium);
  
  color: ${(props) => 
    props.variant === 'primary' 
      ? 'var(--color-text-primary)' 
      : 'var(--color-text-secondary)'
  };
  
  border: 1px solid ${(props) => 
    props.variant === 'primary' 
      ? 'rgba(255, 255, 255, 0.25)' 
      : 'var(--color-glass-border)'
  };
  
  transition: all var(--transition-smooth);
  
  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: var(--glass-shadow-floating);
    background: ${(props) => 
      props.variant === 'primary' 
        ? 'linear-gradient(135deg, var(--color-accent-gold) 0%, rgba(248, 179, 25, 0.70) 100%)'
        : 'var(--color-glass-surface)'
    };
    border-color: ${(props) => 
      props.variant === 'primary' 
        ? 'rgba(255, 255, 255, 0.4)' 
        : 'rgba(255, 255, 255, 0.2)'
    };
  }
  
  &:active {
    transform: translateY(0);
  }
  
`;


const formatVolume = (volume: number): string => {
  if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(1)}M`;
  } else if (volume >= 1000) {
    return `${(volume / 1000).toFixed(0)}K`;
  }
  return volume.toString();
};

export const MarketCard: React.FC<{
  title: string;
  price: number;
  change: number;
  aiConfidence: number;
  volume: number;
}> = ({ title, price, change, aiConfidence, volume }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const isPositiveChange = change >= 0;
  
  // Generate market ID from title for routing
  const marketId = title.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 50);
  
  const handleTradeClick = () => {
    if (!user?.isLoggedIn) {
      setShowAuthPrompt(true);
      // Could show auth modal or redirect to login
      alert('Please log in to trade on this market');
      return;
    }
    router.push(`/trade/${marketId}`);
  };
  
  const handleDetailsClick = () => {
    // Details can be viewed without authentication
    router.push(`/market/${marketId}`);
  };
  
  return (
    <NeomorphicSurface
      depth="medium"
      material="space-metal"
      interactive={true}
      style={{ height: '100%' }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <CardContent>
        {/* Header */}
        <MarketHeader>
          <MarketTitle>{title}</MarketTitle>
          <AIBadge confidence={aiConfidence}>
            <Zap size={12} />
            {(aiConfidence * 100).toFixed(0)}%
          </AIBadge>
        </MarketHeader>
        
        {/* Price Section */}
        <PriceSection>
          <PriceDisplay>
            <span className="currency">$</span>
            {price.toFixed(2)}
          </PriceDisplay>
          
          <ChangeIndicator
            positive={isPositiveChange}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {isPositiveChange ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {isPositiveChange ? '+' : ''}{change.toFixed(2)}%
          </ChangeIndicator>
        </PriceSection>
        
        {/* Metrics */}
        <MetricsGrid>
          <MetricItem>
            <div className="metric-label">Volume</div>
            <div className="metric-value">${formatVolume(volume)}</div>
            <VolumeBar volume={volume} />
          </MetricItem>
          
          <MetricItem>
            <div className="metric-label">Activity</div>
            <div className="metric-value" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: 'var(--space-quantum)'
            }}>
              <Activity size={16} />
              High
            </div>
          </MetricItem>
        </MetricsGrid>
        
        {/* Technical Components */}
        <TechnicalComponents>
          <Hash className="tech-icon" />
          <Shield className="tech-icon" />
          <Database className="tech-icon" />
          <Hexagon className="tech-icon" />
          <Cpu className="tech-icon" />
        </TechnicalComponents>
        
        {/* Action Buttons */}
        <ActionButtons>
          <ActionButton
            variant="primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTradeClick}
          >
            Trade Now
          </ActionButton>
          <ActionButton
            variant="secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDetailsClick}
          >
            Details
          </ActionButton>
        </ActionButtons>
      </CardContent>
    </NeomorphicSurface>
  );
};