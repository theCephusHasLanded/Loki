'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useMotionValue, useSpring, useTransform } from 'framer-motion';
import styled from '@emotion/styled';
import { css, keyframes } from '@emotion/react';

// Types for the quantum market card system
interface QuantumMarketCardProps {
  market: PredictionMarket;
  neumorphicDepth?: 'subtle' | 'medium' | 'deep';
  surfaceMaterial?: 'space-metal' | 'ice-crystal' | 'void';
  dataVisualization?: 'miniChart' | 'probability' | 'timeline';
  aiConfidence?: number; // 0-1
  astronomicalCorrelation?: string;
  hoverEffect?: 'levitation' | 'quantum' | 'holographic';
  hapticFeedback?: boolean;
  onTrade?: (marketId: string, action: 'buy' | 'sell') => void;
  realTimeData?: boolean;
}

interface PredictionMarket {
  id: string;
  title: string;
  description: string;
  outcomes: MarketOutcome[];
  volume: number;
  liquidity: number;
  endDate: Date;
  category: string;
  imageUrl?: string;
  priceHistory: PricePoint[];
  sentiment: 'bullish' | 'bearish' | 'neutral' | 'volatile';
  aiPrediction?: {
    confidence: number;
    outcome: string;
    reasoning: string;
  };
}

interface MarketOutcome {
  id: string;
  name: string;
  probability: number;
  price: number;
  priceChange24h: number;
  volume24h: number;
}

interface PricePoint {
  timestamp: number;
  price: number;
  volume: number;
}

// Advanced styled components with quantum effects
const CardContainer = styled(motion.div)<{
  depth: string;
  material: string;
  aiConfidence: number;
  hoverEffect: string;
}>`
  position: relative;
  width: 100%;
  max-width: 380px;
  min-height: 320px;
  border-radius: var(--radius-large);
  cursor: pointer;
  overflow: hidden;
  
  /* Advanced neumorphic styling based on depth */
  ${(props: any) => {
    const depthScale: Record<string, string> = {
      'subtle': '0.5',
      'medium': '1',
      'deep': '1.5'
    };
    const scale = depthScale[props.depth] || '1';
    
    return css`
      --depth-scale: ${scale};
      --nm-distance: 20px;
      --nm-blur: 40px;
    `;
  }}
  
  /* Surface material variations */
  ${(props: any) => {
    switch(props.material) {
      case 'ice-crystal':
        return css`
          background: linear-gradient(135deg,
            color-mix(in srgb, var(--color-cosmic-ice) 90%, white 10%) 0%,
            color-mix(in srgb, var(--color-cosmic-ice) 80%, transparent 20%) 50%,
            color-mix(in srgb, var(--color-cosmic-ice) 90%, var(--color-space-deep) 10%) 100%);
          backdrop-filter: blur(20px) saturate(1.8);
          border: 1px solid color-mix(in srgb, var(--color-cosmic-ice) 30%, transparent 70%);
        `;
      case 'void':
        return css`
          background: radial-gradient(ellipse at center,
            color-mix(in srgb, var(--color-void-black) 90%, var(--color-space-deep) 10%) 0%,
            var(--color-void-black) 100%);
          border: 1px solid color-mix(in srgb, var(--color-starlight) 20%, transparent 80%);
        `;
      default: // space-metal
        return css`
          background: linear-gradient(135deg, 
            color-mix(in srgb, var(--color-maritime-steel) 95%, white 5%) 0%,
            var(--color-maritime-steel) 50%,
            color-mix(in srgb, var(--color-maritime-steel) 95%, black 5%) 100%);
          border: 1px solid color-mix(in srgb, var(--color-maritime-steel) 60%, var(--color-cosmic-ice) 40%);
        `;
    }
  }}
  
  /* AI confidence glow */
  box-shadow: 
    /* Primary neumorphic shadows */
    calc(var(--nm-distance) * var(--depth-scale)) 
    calc(var(--nm-distance) * var(--depth-scale)) 
    calc(var(--nm-blur) * var(--depth-scale)) 
    var(--nm-shadow-dark),
    
    calc(-1 * var(--nm-distance) * var(--depth-scale))
    calc(-1 * var(--nm-distance) * var(--depth-scale))
    calc(var(--nm-blur) * var(--depth-scale))
    var(--nm-shadow-light),
    
    /* AI confidence glow */
    0 0 ${(props: any) => 20 + (props.aiConfidence * 40)}px 
    color-mix(in srgb, var(--color-ai-insight) ${(props: any) => Math.round(props.aiConfidence * 30)}%, transparent),
    
    /* Inner surface detail */
    inset 2px 2px 4px rgba(255,255,255,0.1),
    inset -2px -2px 4px rgba(0,0,0,0.1);
    
  transition: all var(--transition-smooth) var(--ease-spacecraft);
  will-change: transform, box-shadow;
  
  /* Hover effects based on type */
  &:hover {
    ${(props: any) => {
      switch(props.hoverEffect) {
        case 'quantum':
          return css`
            transform: translateY(-8px) scale(1.02);
            box-shadow: 
              0 20px 60px var(--nm-shadow-dark),
              0 0 40px color-mix(in srgb, var(--color-quantum-glow) 40%, transparent);
          `;
        case 'holographic':
          return css`
            transform: translateY(-4px) rotateX(5deg) rotateY(5deg);
            box-shadow: 
              0 25px 50px var(--nm-shadow-dark),
              0 0 60px color-mix(in srgb, var(--color-ai-insight) 50%, transparent);
          `;
        default: // levitation
          return css`
            transform: translateY(-12px) scale(1.01);
            box-shadow: 
              0 30px 80px var(--nm-shadow-dark),
              0 0 50px color-mix(in srgb, var(--color-quantum-glow) 30%, transparent);
          `;
      }
    }}
  }
`;

const CardHeader = styled.div`
  position: relative;
  padding: var(--space-solar) var(--space-molecule) var(--space-molecule);
  border-bottom: 1px solid color-mix(in srgb, var(--color-cosmic-ice) 10%, transparent 90%);
`;

const MarketTitle = styled.h3<{ sentiment: string }>`
  font-family: var(--font-display);
  font-variation-settings: "wght" 600, "wdth" 110;
  font-size: 1.1rem;
  line-height: 1.3;
  margin: 0 0 var(--space-atom) 0;
  
  /* Sentiment-based coloring */
  background: ${(props: any) => {
    switch(props.sentiment) {
      case 'bullish': 
        return 'linear-gradient(135deg, var(--color-profit-muted) 0%, var(--color-cosmic-ice) 100%)';
      case 'bearish':
        return 'linear-gradient(135deg, var(--color-loss-muted) 0%, var(--color-cosmic-ice) 100%)';
      case 'volatile':
        return 'linear-gradient(135deg, var(--color-warning-amber) 0%, var(--color-cosmic-ice) 100%)';
      default:
        return 'linear-gradient(135deg, var(--color-starlight) 0%, var(--color-cosmic-ice) 100%)';
    }
  }};
  
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const MarketCategory = styled.span`
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--color-starlight) 70%, transparent 30%);
  background: color-mix(in srgb, var(--color-maritime-steel) 30%, transparent 70%);
  padding: var(--space-quantum) var(--space-atom);
  border-radius: var(--radius-small);
  border: 1px solid color-mix(in srgb, var(--color-cosmic-ice) 15%, transparent 85%);
`;

const AstronomicalCorrelation = styled.div<{ active: boolean }>`
  position: absolute;
  top: var(--space-molecule);
  right: var(--space-molecule);
  display: flex;
  align-items: center;
  gap: var(--space-quantum);
  padding: var(--space-quantum) var(--space-atom);
  border-radius: var(--radius-small);
  background: color-mix(in srgb, var(--color-ai-insight) ${(props: any) => props.active ? '20' : '10'}%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-ai-insight) ${(props: any) => props.active ? '30' : '15'}%, transparent);
  
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--color-ai-insight);
  
  ${(props: any) => props.active && css`
    box-shadow: 0 0 15px color-mix(in srgb, var(--color-ai-insight) 30%, transparent);
    animation: astro-pulse 2s infinite;
  `}
`;

const OutcomesList = styled.div`
  padding: var(--space-molecule);
  display: flex;
  flex-direction: column;
  gap: var(--space-atom);
`;

const OutcomeItem = styled(motion.div)<{ isWinning: boolean; confidence: number }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-molecule);
  border-radius: var(--radius-medium);
  background: color-mix(in srgb, var(--nm-surface-base) 80%, transparent 20%);
  border: 1px solid color-mix(in srgb, var(--color-cosmic-ice) 15%, transparent 85%);
  
  /* Winning outcome highlighting */
  ${(props: any) => props.isWinning && css`
    background: color-mix(in srgb, var(--color-profit-muted) 20%, var(--nm-surface-base) 80%);
    border-color: color-mix(in srgb, var(--color-profit-muted) 40%, transparent 60%);
    box-shadow: 0 0 20px color-mix(in srgb, var(--color-profit-muted) 20%, transparent);
  `}
  
  /* AI confidence visualization */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: ${(props: any) => props.confidence * 100}%;
    background: linear-gradient(90deg, 
      var(--color-ai-insight), 
      transparent);
    opacity: 0.1;
    border-radius: inherit;
    transition: width var(--transition-smooth);
  }
  
  position: relative;
  cursor: pointer;
  transition: all var(--transition-smooth);
  
  &:hover {
    transform: translateX(4px);
    background: color-mix(in srgb, var(--nm-surface-base) 90%, var(--color-quantum-glow) 10%);
  }
`;

const OutcomeName = styled.span`
  font-family: var(--font-primary);
  font-variation-settings: "wght" 500;
  color: var(--color-cosmic-ice);
  flex: 1;
`;

const ProbabilityDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-atom);
`;

const ProbabilityBar = styled.div<{ probability: number }>`
  width: 60px;
  height: 6px;
  background: color-mix(in srgb, var(--color-maritime-steel) 50%, transparent 50%);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: ${(props: any) => props.probability}%;
    background: linear-gradient(90deg,
      var(--color-quantum-glow) 0%,
      var(--color-ai-insight) 100%);
    border-radius: inherit;
    transition: width var(--transition-smooth);
  }
`;

const ProbabilityText = styled.span<{ change: number }>`
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-variation-settings: "wght" 600;
  color: ${(props: any) => {
    if (props.change > 0) return 'var(--color-profit-muted)';
    if (props.change < 0) return 'var(--color-loss-muted)';
    return 'var(--color-starlight)';
  }};
`;

const MiniChart = styled.div`
  height: 40px;
  margin: var(--space-molecule);
  border-radius: var(--radius-small);
  background: color-mix(in srgb, var(--color-void-black) 30%, transparent 70%);
  position: relative;
  overflow: hidden;
`;

const ChartPath = styled(motion.path)`
  fill: none;
  stroke: var(--color-quantum-glow);
  stroke-width: 2;
  filter: drop-shadow(0 0 4px var(--color-quantum-glow));
`;

const AIInsightBadge = styled.div<{ confidence: number }>`
  position: absolute;
  bottom: var(--space-molecule);
  right: var(--space-molecule);
  display: flex;
  align-items: center;
  gap: var(--space-quantum);
  padding: var(--space-quantum) var(--space-atom);
  border-radius: var(--radius-small);
  background: color-mix(in srgb, var(--color-ai-insight) 15%, transparent 85%);
  backdrop-filter: blur(10px);
  border: 1px solid color-mix(in srgb, var(--color-ai-insight) 30%, transparent 70%);
  
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--color-ai-insight);
  
  /* Confidence-based glow */
  box-shadow: 0 0 ${(props: any) => 10 + (props.confidence * 20)}px 
    color-mix(in srgb, var(--color-ai-insight) ${(props: any) => Math.round(props.confidence * 40)}%, transparent);
    
  /* Pulsing animation for high confidence */
  ${(props: any) => props.confidence > 0.8 && css`
    animation: high-confidence-pulse 1.5s infinite;
  `}
`;

const QuantumTradingButtons = styled.div`
  display: flex;
  gap: var(--space-atom);
  padding: var(--space-molecule);
  border-top: 1px solid color-mix(in srgb, var(--color-cosmic-ice) 10%, transparent 90%);
`;

const QuantumButton = styled(motion.button)<{ variant: 'buy' | 'sell' }>`
  flex: 1;
  padding: var(--space-molecule);
  border: none;
  border-radius: var(--radius-medium);
  font-family: var(--font-primary);
  font-variation-settings: "wght" 600;
  font-size: 0.85rem;
  letter-spacing: 0.02em;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  /* Variant-based styling */
  ${(props: any) => {
    if (props.variant === 'buy') {
      return css`
        background: linear-gradient(135deg,
          var(--color-profit-muted) 0%,
          color-mix(in srgb, var(--color-profit-muted) 80%, black 20%) 100%);
        color: var(--color-cosmic-ice);
        box-shadow: 
          8px 8px 16px color-mix(in srgb, var(--color-profit-muted) 20%, var(--nm-shadow-dark) 80%),
          -8px -8px 16px color-mix(in srgb, var(--color-profit-muted) 10%, var(--nm-shadow-light) 90%);
      `;
    } else {
      return css`
        background: linear-gradient(135deg,
          var(--color-loss-muted) 0%,
          color-mix(in srgb, var(--color-loss-muted) 80%, black 20%) 100%);
        color: var(--color-cosmic-ice);
        box-shadow: 
          8px 8px 16px color-mix(in srgb, var(--color-loss-muted) 20%, var(--nm-shadow-dark) 80%),
          -8px -8px 16px color-mix(in srgb, var(--color-loss-muted) 10%, var(--nm-shadow-light) 90%);
      `;
    }
  }}
  
  transition: all var(--transition-smooth) var(--ease-quantum);
  
  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 
      12px 12px 24px color-mix(in srgb, ${(props: any) => 
        props.variant === 'buy' ? 'var(--color-profit-muted)' : 'var(--color-loss-muted)'
      } 30%, var(--nm-shadow-dark) 70%);
  }
  
  &:active {
    transform: translateY(0) scale(0.98);
    transition-duration: var(--transition-instant);
  }
  
  /* Quantum effect on click */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: radial-gradient(circle, var(--color-starlight) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: all var(--transition-quick);
  }
  
  &:active::before {
    width: 300px;
    height: 300px;
  }
`;

// Keyframes
const astroPulse = keyframes`
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
`;

const highConfidencePulse = keyframes`
  0%, 100% { 
    box-shadow: 0 0 10px color-mix(in srgb, var(--color-ai-insight) 40%, transparent);
  }
  50% { 
    box-shadow: 0 0 25px color-mix(in srgb, var(--color-ai-insight) 60%, transparent);
  }
`;

// Utility function to generate mini chart path
const generateChartPath = (points: PricePoint[], width: number, height: number): string => {
  if (points.length < 2) return '';
  
  const maxPrice = Math.max(...points.map(p => p.price));
  const minPrice = Math.min(...points.map(p => p.price));
  const priceRange = maxPrice - minPrice;
  
  const pathData = points.map((point, index) => {
    const x = (index / (points.length - 1)) * width;
    const y = height - ((point.price - minPrice) / priceRange) * height;
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
  
  return pathData;
};

// Main QuantumMarketCard2032 Component
export const QuantumMarketCard2032: React.FC<QuantumMarketCardProps> = ({
  market,
  neumorphicDepth = 'medium',
  surfaceMaterial = 'space-metal',
  dataVisualization = 'miniChart',
  aiConfidence = 0.5,
  astronomicalCorrelation,
  hoverEffect = 'levitation',
  hapticFeedback = true,
  onTrade,
  realTimeData = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Motion values for advanced interactions
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [5, -5]), { stiffness: 400, damping: 40 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-5, 5]), { stiffness: 400, damping: 40 });
  
  // Mouse tracking for holographic effect
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!cardRef.current || hoverEffect !== 'holographic') return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = event.clientX - centerX;
    const mouseY = event.clientY - centerY;
    
    x.set(mouseX);
    y.set(mouseY);
  };
  
  // Haptic feedback simulation
  const triggerHapticFeedback = () => {
    if (!hapticFeedback) return;
    
    // Web vibration API (where supported)
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };
  
  // Handle trade action
  const handleTrade = (action: 'buy' | 'sell') => {
    triggerHapticFeedback();
    onTrade?.(market.id, action);
  };
  
  // Get winning outcome
  const winningOutcome = market.outcomes.reduce((prev, current) => 
    prev.probability > current.probability ? prev : current
  );
  
  return (
    <CardContainer
      ref={cardRef}
      depth={neumorphicDepth}
      material={surfaceMaterial}
      aiConfidence={aiConfidence}
      hoverEffect={hoverEffect}
      style={hoverEffect === 'holographic' ? { rotateX, rotateY } : {}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      whileHover={{ scale: hoverEffect === 'quantum' ? 1.02 : 1.01 }}
      whileTap={{ scale: 0.98 }}
      role="article"
      aria-label={`Prediction market: ${market.title}`}
    >
      <CardHeader>
        <MarketTitle sentiment={market.sentiment}>
          {market.title}
        </MarketTitle>
        <MarketCategory>
          {market.category}
        </MarketCategory>
        
        {astronomicalCorrelation && (
          <AstronomicalCorrelation 
            active={aiConfidence > 0.7}
            title={`Astronomical correlation: ${astronomicalCorrelation}`}
          >
            ☾ {astronomicalCorrelation}
          </AstronomicalCorrelation>
        )}
      </CardHeader>
      
      {/* Data Visualization */}
      {dataVisualization === 'miniChart' && market.priceHistory.length > 1 && (
        <MiniChart>
          <svg width="100%" height="100%" viewBox="0 0 300 40">
            <ChartPath
              d={generateChartPath(market.priceHistory, 300, 40)}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </svg>
        </MiniChart>
      )}
      
      {/* Outcomes List */}
      <OutcomesList>
        {market.outcomes.map((outcome, index) => (
          <OutcomeItem
            key={outcome.id}
            isWinning={outcome.id === winningOutcome.id}
            confidence={aiConfidence}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedOutcome(outcome.id)}
            role="button"
            aria-label={`${outcome.name}: ${Math.round(outcome.probability * 100)}% probability`}
          >
            <OutcomeName>{outcome.name}</OutcomeName>
            <ProbabilityDisplay>
              <ProbabilityBar probability={outcome.probability * 100} />
              <ProbabilityText change={outcome.priceChange24h}>
                {Math.round(outcome.probability * 100)}%
              </ProbabilityText>
            </ProbabilityDisplay>
          </OutcomeItem>
        ))}
      </OutcomesList>
      
      {/* AI Insight Badge */}
      {market.aiPrediction && (
        <AIInsightBadge 
          confidence={market.aiPrediction.confidence}
          title={`AI Prediction: ${market.aiPrediction.outcome} (${Math.round(market.aiPrediction.confidence * 100)}% confidence)`}
        >
          🤖 {Math.round(market.aiPrediction.confidence * 100)}%
        </AIInsightBadge>
      )}
      
      {/* Quantum Trading Buttons */}
      <QuantumTradingButtons>
        <QuantumButton
          variant="buy"
          onClick={() => handleTrade('buy')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label="Buy prediction shares"
        >
          ⬆ BUY
        </QuantumButton>
        <QuantumButton
          variant="sell"
          onClick={() => handleTrade('sell')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label="Sell prediction shares"
        >
          ⬇ SELL
        </QuantumButton>
      </QuantumTradingButtons>
      
      {/* Global styles injection */}
      <style jsx global>{`
        @keyframes astro-pulse {
          ${astroPulse}
        }
        
        @keyframes high-confidence-pulse {
          ${highConfidencePulse}
        }
      `}</style>
    </CardContainer>
  );
};

export default QuantumMarketCard2032;