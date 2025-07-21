'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useAnimation, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { css, keyframes } from '@emotion/react';

// Types for the AI-Adaptive Trading Interface
interface AIAdaptiveTradingInterfaceProps {
  layout?: 'adaptive-grid' | 'mission-control' | 'yacht-navigation' | 'trading-floor';
  complexity?: 'beginner' | 'intermediate' | 'expert' | 'user-expertise-based';
  theme?: 'space-maritime-deep' | 'cosmic-ice' | 'void-black' | 'quantum-glow';
  realTimePersonalization?: boolean;
  userStressLevel?: number; // 0-1
  tradingExperience?: number; // 0-1 (0=beginner, 1=expert)
  marketVolatility?: number; // 0-1
  activeMarkets?: PredictionMarket[];
  tradingSession?: TradingSessionData;
  onTrade?: (marketId: string, outcome: string, amount: number) => void;
  onLayoutChange?: (layout: string) => void;
}

interface TradingSessionData {
  duration: number; // minutes
  profitLoss: number;
  tradesCount: number;
  successRate: number;
  currentFocus: string;
  cognitiveLoad: number; // 0-1
  biometricData?: {
    heartRate?: number;
    focusLevel?: number;
    stressIndicators?: number;
  };
}

interface PredictionMarket {
  id: string;
  title: string;
  outcomes: MarketOutcome[];
  volume: number;
  volatility: number;
  aiConfidence: number;
  userRelevanceScore: number;
  complexityLevel: number; // 0-1
  timeToExpiry: number; // minutes
}

interface MarketOutcome {
  id: string;
  name: string;
  probability: number;
  price: number;
  priceChange: number;
  momentum: 'rising' | 'falling' | 'stable' | 'volatile';
}

// Advanced styled components with AI adaptation
const InterfaceContainer = styled(motion.div)<{
  layout: string;
  complexity: string;
  theme: string;
  stressLevel: number;
  cognitiveLoad: number;
}>`
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: grid;
  gap: var(--space-molecule);
  padding: var(--space-molecule);
  
  /* Adaptive grid based on layout and user state */
  ${props => {
    switch(props.layout) {
      case 'mission-control':
        return css`
          grid-template-columns: 300px 1fr 300px;
          grid-template-rows: auto 1fr auto;
          grid-template-areas:
            "sidebar-left main-display sidebar-right"
            "sidebar-left trading-floor sidebar-right"
            "status-bar status-bar status-bar";
        `;
      case 'yacht-navigation':
        return css`
          grid-template-columns: 250px 1fr 200px;
          grid-template-rows: 80px 1fr 60px;
          grid-template-areas:
            "nav-left chart-display nav-right"
            "nav-left main-content instruments"
            "footer footer footer";
        `;
      case 'trading-floor':
        return css`
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          grid-auto-rows: minmax(200px, auto);
          grid-gap: var(--space-molecule);
        `;
      default: // adaptive-grid
        return css`
          grid-template-columns: repeat(auto-fit, minmax(
            ${props.complexity === 'beginner' ? '400px' : props.complexity === 'expert' ? '280px' : '320px'}, 
            1fr
          ));
          grid-auto-rows: minmax(
            ${props.stressLevel > 0.7 ? '300px' : '250px'}, 
            auto
          );
        `;
    }
  }}
  
  /* Theme-based background and atmosphere */
  background: ${props => {
    switch(props.theme) {
      case 'cosmic-ice':
        return `radial-gradient(ellipse at center,
          color-mix(in srgb, var(--color-cosmic-ice) 20%, var(--color-space-deep) 80%) 0%,
          var(--color-space-deep) 100%)`;
      case 'void-black':
        return `linear-gradient(135deg,
          var(--color-void-black) 0%,
          color-mix(in srgb, var(--color-void-black) 95%, var(--color-space-deep) 5%) 100%)`;
      case 'quantum-glow':
        return `radial-gradient(ellipse at center,
          color-mix(in srgb, var(--color-quantum-glow) 15%, var(--color-space-deep) 85%) 0%,
          var(--color-space-deep) 100%)`;
      default: // space-maritime-deep
        return `linear-gradient(135deg,
          var(--color-space-deep) 0%,
          color-mix(in srgb, var(--color-maritime-steel) 30%, var(--color-space-deep) 70%) 50%,
          var(--color-void-black) 100%)`;
    }
  }};
  
  /* Stress-responsive visual dampening */
  ${props => props.stressLevel > 0.7 && css`
    filter: saturate(0.8) brightness(0.9);
    --nm-glow: 15px; /* Reduce visual stimulation */
  `}
  
  /* Cognitive load adaptive spacing */
  ${props => props.cognitiveLoad > 0.8 && css`
    gap: var(--space-solar);
    padding: var(--space-solar);
  `}
  
  transition: all var(--transition-smooth) var(--ease-spacecraft);
`;

const AdaptivePanel = styled(motion.div)<{
  priority: number;
  userExpertise: number;
  stressLevel: number;
  complexity: string;
}>`
  background: var(--nm-surface-base);
  border-radius: var(--radius-large);
  padding: var(--space-molecule);
  position: relative;
  overflow: hidden;
  
  /* Advanced neumorphism with adaptive depth */
  box-shadow: 
    ${props => {
      const depth = Math.max(0.5, 1 - props.stressLevel * 0.5);
      const distance = `${20 * depth}px`;
      const blur = `${60 * depth}px`;
      
      return `
        ${distance} ${distance} ${blur} var(--nm-shadow-dark),
        -${distance} -${distance} ${blur} var(--nm-shadow-light),
        inset 2px 2px 4px rgba(255,255,255,0.1),
        0 0 ${30 * props.priority}px color-mix(in srgb, var(--color-quantum-glow) ${Math.round(props.priority * 20)}%, transparent)
      `;
    }};
  
  /* Priority-based visual hierarchy */
  z-index: ${props => Math.round(props.priority * 10)};
  order: ${props => Math.round((1 - props.priority) * 10)};
  
  /* Expertise-based information density */
  ${props => {
    if (props.userExpertise < 0.3) {
      return css`
        .advanced-metrics { display: none; }
        .complex-controls { display: none; }
        .expert-indicators { display: none; }
      `;
    } else if (props.userExpertise < 0.7) {
      return css`
        .expert-indicators { opacity: 0.7; }
        .advanced-metrics { opacity: 0.8; }
      `;
    }
  }}
  
  /* Stress-adaptive visual simplification */
  ${props => props.stressLevel > 0.6 && css`
    .secondary-info { opacity: 0.5; }
    .decorative-elements { display: none; }
    .animation-effects { animation-play-state: paused; }
  `}
  
  border: 1px solid color-mix(in srgb, var(--color-cosmic-ice) 15%, transparent 85%);
  transition: all var(--transition-smooth) var(--ease-spacecraft);
  will-change: transform, box-shadow;
  
  &:hover {
    transform: translateY(-4px) scale(1.01);
    box-shadow: 
      0 20px 60px var(--nm-shadow-dark),
      0 0 40px color-mix(in srgb, var(--color-quantum-glow) 30%, transparent);
  }
`;

const AIInsightBar = styled.div<{ confidence: number; urgency: number }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg,
    var(--color-ai-insight) 0%,
    color-mix(in srgb, var(--color-ai-insight) 80%, var(--color-quantum-glow) 20%) ${props => props.confidence * 100}%,
    color-mix(in srgb, var(--color-ai-insight) 20%, transparent 80%) 100%
  );
  
  /* Urgency-based pulsing */
  ${props => props.urgency > 0.7 && css`
    animation: urgent-pulse 1s infinite;
  `}
  
  border-radius: var(--radius-large) var(--radius-large) 0 0;
`;

const NeuralNetworkBackground = styled.div<{ activity: number }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.1;
  background-image: 
    radial-gradient(circle at 20% 30%, var(--color-ai-insight) 1px, transparent 1px),
    radial-gradient(circle at 80% 70%, var(--color-quantum-glow) 1px, transparent 1px),
    radial-gradient(circle at 50% 20%, var(--color-starlight) 0.5px, transparent 0.5px);
  background-size: 40px 40px, 60px 60px, 30px 30px;
  animation: neural-flow ${props => 10 - props.activity * 5}s linear infinite;
  z-index: -1;
`;

const SmartTradingCard = styled(motion.div)<{ 
  relevanceScore: number; 
  complexity: number; 
  userExpertise: number;
}>`
  background: var(--nm-surface-base);
  border-radius: var(--radius-medium);
  padding: var(--space-molecule);
  position: relative;
  cursor: pointer;
  
  /* Relevance-based prominence */
  opacity: ${props => 0.6 + (props.relevanceScore * 0.4)};
  transform: scale(${props => 0.95 + (props.relevanceScore * 0.05)});
  
  /* Complexity filtering based on user expertise */
  ${props => {
    const complexityMismatch = Math.abs(props.complexity - props.userExpertise);
    if (complexityMismatch > 0.4) {
      return css`
        filter: grayscale(0.3) brightness(0.8);
        order: 999; /* Push to end */
      `;
    }
  }}
  
  box-shadow: 
    8px 8px 16px var(--nm-shadow-dark),
    -8px -8px 16px var(--nm-shadow-light),
    0 0 20px color-mix(in srgb, var(--color-quantum-glow) ${props => Math.round(props.relevanceScore * 30)}%, transparent);
  
  transition: all var(--transition-smooth) var(--ease-spacecraft);
  
  &:hover {
    transform: translateY(-6px) scale(${props => 0.98 + (props.relevanceScore * 0.05)});
    box-shadow: 
      12px 12px 24px var(--nm-shadow-dark),
      -12px -12px 24px var(--nm-shadow-light),
      0 0 40px color-mix(in srgb, var(--color-quantum-glow) 40%, transparent);
  }
`;

const BiometricIndicator = styled.div<{ 
  heartRate?: number; 
  focusLevel?: number; 
  stressLevel?: number;
}>`
  position: fixed;
  top: var(--space-molecule);
  right: var(--space-molecule);
  display: flex;
  gap: var(--space-atom);
  z-index: var(--z-floating);
  
  .biometric-item {
    display: flex;
    align-items: center;
    gap: var(--space-quantum);
    padding: var(--space-quantum) var(--space-atom);
    border-radius: var(--radius-small);
    background: color-mix(in srgb, var(--color-maritime-steel) 40%, transparent 60%);
    backdrop-filter: blur(10px);
    border: 1px solid color-mix(in srgb, var(--color-cosmic-ice) 15%, transparent 85%);
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--color-starlight);
  }
  
  .heart-rate {
    color: ${props => {
      if (!props.heartRate) return 'var(--color-starlight)';
      if (props.heartRate > 100) return 'var(--color-critical-red)';
      if (props.heartRate > 85) return 'var(--color-warning-amber)';
      return 'var(--color-profit-muted)';
    }};
    
    ${props => props.heartRate && props.heartRate > 100 && css`
      animation: critical-pulse 0.8s infinite;
    `}
  }
  
  .focus-level {
    color: ${props => {
      if (!props.focusLevel) return 'var(--color-starlight)';
      if (props.focusLevel > 0.8) return 'var(--color-quantum-glow)';
      if (props.focusLevel > 0.5) return 'var(--color-ai-insight)';
      return 'var(--color-warning-amber)';
    }};
  }
  
  .stress-indicator {
    color: ${props => {
      if (!props.stressLevel) return 'var(--color-starlight)';
      if (props.stressLevel > 0.7) return 'var(--color-critical-red)';
      if (props.stressLevel > 0.4) return 'var(--color-warning-amber)';
      return 'var(--color-profit-muted)';
    }};
  }
`;

const AdaptiveQuickActions = styled.div<{ 
  expertise: number; 
  stressLevel: number;
  sessionDuration: number;
}>`
  position: fixed;
  bottom: var(--space-molecule);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: var(--space-atom);
  z-index: var(--z-floating);
  
  /* Adaptive action availability */
  .action-button {
    padding: var(--space-molecule);
    border: none;
    border-radius: var(--radius-large);
    background: var(--nm-surface-base);
    color: var(--color-cosmic-ice);
    font-family: var(--font-primary);
    font-variation-settings: "wght" 600;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    
    box-shadow: 
      8px 8px 16px var(--nm-shadow-dark),
      -8px -8px 16px var(--nm-shadow-light);
    
    transition: all var(--transition-smooth) var(--ease-spacecraft);
    
    &:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 
        12px 12px 24px var(--nm-shadow-dark),
        0 0 20px var(--color-quantum-glow);
    }
    
    &:active {
      transform: translateY(0) scale(0.98);
    }
  }
  
  /* Expertise-based action complexity */
  ${props => props.expertise < 0.3 && css`
    .advanced-action { display: none; }
    .expert-action { display: none; }
  `}
  
  ${props => props.expertise < 0.7 && css`
    .expert-action { opacity: 0.6; }
  `}
  
  /* Stress-adaptive action simplification */
  ${props => props.stressLevel > 0.6 && css`
    .complex-action { display: none; }
    gap: var(--space-molecule);
  `}
  
  /* Session fatigue management */
  ${props => props.sessionDuration > 120 && css`
    .high-risk-action { 
      opacity: 0.5;
      pointer-events: none;
    }
    
    .break-suggestion {
      animation: gentle-pulse 2s infinite;
    }
  `}
`;

// Keyframes for animations
const urgentPulse = keyframes`
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
`;

const neuralFlow = keyframes`
  0% { background-position: 0 0, 0 0, 0 0; }
  100% { background-position: 40px 40px, 60px 60px, 30px 30px; }
`;

const criticalPulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

const gentlePulse = keyframes`
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
`;

// Main AI-Adaptive Trading Interface Component
export const AIAdaptiveTradingInterface2032: React.FC<AIAdaptiveTradingInterfaceProps> = ({
  layout = 'adaptive-grid',
  complexity = 'user-expertise-based',
  theme = 'space-maritime-deep',
  realTimePersonalization = true,
  userStressLevel = 0.3,
  tradingExperience = 0.5,
  marketVolatility = 0.4,
  activeMarkets = [],
  tradingSession,
  onTrade,
  onLayoutChange
}) => {
  const [adaptiveLayout, setAdaptiveLayout] = useState(layout);
  const [personalizedComplexity, setPersonalizedComplexity] = useState(complexity);
  const [cognitiveLoad, setCognitiveLoad] = useState(0.3);
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  const [biometricData, setBiometricData] = useState(tradingSession?.biometricData);
  
  // AI-driven personalization engine
  useEffect(() => {
    if (!realTimePersonalization) return;
    
    const personalizeInterface = () => {
      // Stress-based layout adaptation
      if (userStressLevel > 0.7) {
        setAdaptiveLayout('yacht-navigation'); // Calmer, more spacious
        setPersonalizedComplexity('beginner'); // Simplify interface
      } else if (tradingExperience > 0.8 && userStressLevel < 0.3) {
        setAdaptiveLayout('trading-floor'); // Dense, information-rich
        setPersonalizedComplexity('expert');
      } else {
        setAdaptiveLayout('adaptive-grid');
        setPersonalizedComplexity(tradingExperience > 0.6 ? 'expert' : 'intermediate');
      }
      
      // Cognitive load calculation
      const sessionFactor = (tradingSession?.duration || 0) / 240; // 4 hours max
      const volatilityFactor = marketVolatility;
      const complexityFactor = tradingExperience < 0.5 ? 0.3 : 0;
      
      setCognitiveLoad(Math.min(1, sessionFactor + volatilityFactor + complexityFactor));
    };
    
    personalizeInterface();
    
    // Real-time adaptation every 30 seconds
    const adaptationInterval = setInterval(personalizeInterface, 30000);
    
    return () => clearInterval(adaptationInterval);
  }, [realTimePersonalization, userStressLevel, tradingExperience, marketVolatility, tradingSession]);
  
  // Market prioritization based on user profile
  const prioritizedMarkets = useMemo(() => {
    return activeMarkets
      .map(market => ({
        ...market,
        priority: calculateMarketPriority(market, tradingExperience, userStressLevel),
        adaptedComplexity: Math.min(market.complexityLevel, tradingExperience + 0.2)
      }))
      .sort((a, b) => b.priority - a.priority)
      .slice(0, cognitiveLoad > 0.7 ? 6 : cognitiveLoad > 0.4 ? 9 : 12);
  }, [activeMarkets, tradingExperience, userStressLevel, cognitiveLoad]);
  
  // Handle layout change
  const handleLayoutChange = (newLayout: string) => {
    setAdaptiveLayout(newLayout);
    onLayoutChange?.(newLayout);
  };
  
  return (
    <InterfaceContainer
      layout={adaptiveLayout}
      complexity={personalizedComplexity}
      theme={theme}
      stressLevel={userStressLevel}
      cognitiveLoad={cognitiveLoad}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* Neural network background effect */}
      <NeuralNetworkBackground activity={cognitiveLoad} />
      
      {/* Biometric indicators */}
      {biometricData && (
        <BiometricIndicator
          heartRate={biometricData.heartRate}
          focusLevel={biometricData.focusLevel}
          stressLevel={userStressLevel}
        >
          {biometricData.heartRate && (
            <div className="biometric-item heart-rate">
              ♥ {biometricData.heartRate}
            </div>
          )}
          {biometricData.focusLevel !== undefined && (
            <div className="biometric-item focus-level">
              ◉ {Math.round(biometricData.focusLevel * 100)}%
            </div>
          )}
          <div className="biometric-item stress-indicator">
            ⚡ {Math.round(userStressLevel * 100)}%
          </div>
        </BiometricIndicator>
      )}
      
      {/* Adaptive market panels */}
      <AnimatePresence>
        {prioritizedMarkets.map((market, index) => (
          <AdaptivePanel
            key={market.id}
            priority={market.priority}
            userExpertise={tradingExperience}
            stressLevel={userStressLevel}
            complexity={personalizedComplexity}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ delay: index * 0.1 }}
          >
            <AIInsightBar 
              confidence={market.aiConfidence} 
              urgency={market.volatility * market.timeToExpiry < 60 ? 1 : 0} 
            />
            
            <SmartTradingCard
              relevanceScore={market.userRelevanceScore}
              complexity={market.complexityLevel}
              userExpertise={tradingExperience}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <h3 className="typography-2032-display" style={{ 
                fontSize: userStressLevel > 0.6 ? '1.1rem' : '1.3rem',
                marginBottom: 'var(--space-atom)'
              }}>
                {market.title}
              </h3>
              
              <div className="outcomes-grid" style={{
                display: 'grid',
                gridTemplateColumns: personalizedComplexity === 'beginner' ? '1fr' : 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: 'var(--space-atom)',
                marginBottom: 'var(--space-molecule)'
              }}>
                {market.outcomes.slice(0, personalizedComplexity === 'beginner' ? 2 : 4).map((outcome) => (
                  <motion.div
                    key={outcome.id}
                    className="outcome-item"
                    style={{
                      padding: 'var(--space-atom)',
                      background: 'color-mix(in srgb, var(--nm-surface-base) 80%, transparent 20%)',
                      borderRadius: 'var(--radius-small)',
                      border: '1px solid color-mix(in srgb, var(--color-cosmic-ice) 10%, transparent 90%)',
                      cursor: 'pointer'
                    }}
                    whileHover={{ scale: 1.05, backgroundColor: 'color-mix(in srgb, var(--color-quantum-glow) 10%, var(--nm-surface-base) 90%)' }}
                    onClick={() => onTrade?.(market.id, outcome.id, 100)}
                  >
                    <div className="typography-2032-body" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                      {outcome.name}
                    </div>
                    <div className="typography-2032-data" style={{ 
                      fontSize: '0.8rem',
                      color: outcome.priceChange > 0 ? 'var(--color-profit-muted)' : 'var(--color-loss-muted)'
                    }}>
                      {Math.round(outcome.probability * 100)}%
                      <span className="secondary-info" style={{ marginLeft: 'var(--space-quantum)' }}>
                        {outcome.priceChange > 0 ? '+' : ''}{Math.round(outcome.priceChange * 100) / 100}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Advanced metrics for experienced users */}
              {tradingExperience > 0.5 && (
                <div className="advanced-metrics" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.7rem',
                  color: 'var(--color-starlight)',
                  opacity: userStressLevel > 0.6 ? 0.6 : 0.8
                }}>
                  <span>Vol: ${market.volume.toLocaleString()}</span>
                  <span>AI: {Math.round(market.aiConfidence * 100)}%</span>
                  <span className="expert-indicators">σ: {Math.round(market.volatility * 100)}</span>
                </div>
              )}
            </SmartTradingCard>
          </AdaptivePanel>
        ))}
      </AnimatePresence>
      
      {/* Adaptive quick actions */}
      <AdaptiveQuickActions
        expertise={tradingExperience}
        stressLevel={userStressLevel}
        sessionDuration={tradingSession?.duration || 0}
      >
        <button className="action-button" onClick={() => handleLayoutChange('adaptive-grid')}>
          🎯 Focus Mode
        </button>
        <button className="action-button advanced-action" onClick={() => handleLayoutChange('trading-floor')}>
          📊 Pro View
        </button>
        <button className="action-button" onClick={() => handleLayoutChange('yacht-navigation')}>
          🧘 Zen Mode
        </button>
        {tradingSession && tradingSession.duration > 120 && (
          <button className="action-button break-suggestion" style={{
            background: 'linear-gradient(135deg, var(--color-warning-amber), var(--color-cosmic-ice))',
            fontWeight: 700
          }}>
            ☕ Take Break
          </button>
        )}
      </AdaptiveQuickActions>
      
      {/* Global styles injection */}
      <style jsx global>{`
        @keyframes urgent-pulse {
          ${urgentPulse}
        }
        
        @keyframes neural-flow {
          ${neuralFlow}
        }
        
        @keyframes critical-pulse {
          ${criticalPulse}
        }
        
        @keyframes gentle-pulse {
          ${gentlePulse}
        }
      `}</style>
    </InterfaceContainer>
  );
};

// Utility function to calculate market priority based on user profile
const calculateMarketPriority = (
  market: PredictionMarket, 
  experience: number, 
  stress: number
): number => {
  let priority = market.userRelevanceScore * 0.4;
  
  // AI confidence weighting
  priority += market.aiConfidence * 0.3;
  
  // Experience-complexity matching
  const complexityMatch = 1 - Math.abs(market.complexityLevel - experience);
  priority += complexityMatch * 0.2;
  
  // Stress-based de-prioritization of complex markets
  if (stress > 0.6) {
    priority -= market.complexityLevel * 0.3;
  }
  
  // Time urgency
  if (market.timeToExpiry < 60) {
    priority += 0.2;
  }
  
  return Math.max(0, Math.min(1, priority));
};

export default AIAdaptiveTradingInterface2032;