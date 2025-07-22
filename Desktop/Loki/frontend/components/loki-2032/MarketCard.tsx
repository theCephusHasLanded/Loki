import React from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { NeomorphicSurface } from './NeomorphicSurface';
import { TrendingUp, TrendingDown, Zap, Activity } from 'lucide-react';
import styled from '@emotion/styled';

const CardContent = styled.div`
  padding: var(--space-molecule);
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const MarketHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-molecule);
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
`;

const AIBadge = styled.div<{ confidence: number }>`
  display: flex;
  align-items: center;
  gap: var(--space-quantum);
  padding: var(--space-quantum) var(--space-atom);
  background: var(--color-glass-panel);
  backdrop-filter: var(--glass-blur-subtle);
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-small);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--color-text-accent);
  
  /* Glass depth effect */
  box-shadow: var(--glass-inset-highlight);
`;

const PriceSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-molecule);
`;

const PriceDisplay = styled.div`
  font-family: var(--font-mono);
  font-size: clamp(1.2rem, 3vw, 1.75rem);
  font-weight: 600;
  color: var(--color-accent-amber);
  display: flex;
  align-items: baseline;
  gap: 4px;
  
  .currency {
    font-size: clamp(0.9rem, 2vw, 1.1rem);
    color: var(--color-text-muted);
  }
`;

const ChangeIndicator = styled(motion.div)<{ positive: boolean }>`
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

const ActionButtons = styled.div`
  display: flex;
  gap: var(--space-atom);
  margin-top: auto;
  padding-top: var(--space-molecule);
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
  const isPositiveChange = change >= 0;
  
  // Generate market ID from title for routing
  const marketId = title.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 50);
  
  const handleTradeClick = () => {
    router.push(`/trade/${marketId}`);
  };
  
  const handleDetailsClick = () => {
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