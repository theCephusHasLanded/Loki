'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useMotionValue, useSpring } from 'framer-motion';
import styled from '@emotion/styled';
import { css, keyframes } from '@emotion/react';

// Types for the revolutionary header system
interface ConstellationHeaderProps {
  logo?: React.ReactNode;
  adaptiveTitle?: boolean;
  aiContext?: TradingSession;
  glowEffect?: boolean;
  marketVolatility?: number;
  userStress?: number;
  astronomicalData?: AstronomicalData;
}

interface TradingSession {
  activeMarkets: number;
  totalVolume: number;
  profitability: number;
  timeOfDay: string;
  mood: 'bullish' | 'bearish' | 'neutral' | 'volatile';
}

interface AstronomicalData {
  moonPhase: string;
  mercuryRetrograde: boolean;
  solarActivity: 'low' | 'moderate' | 'high' | 'extreme';
  planetaryAlignment: string;
}

// Advanced styled components with 2032 aesthetics
const HeaderContainer = styled.header<{ 
  volatility: number; 
  glowIntensity: number; 
  aiMood: string;
}>`
  position: relative;
  width: 100%;
  height: 80px;
  background: linear-gradient(135deg,
    color-mix(in srgb, var(--color-space-deep) 95%, transparent 5%) 0%,
    color-mix(in srgb, var(--color-maritime-steel) 80%, transparent 20%) 50%,
    color-mix(in srgb, var(--color-void-black) 90%, transparent 10%) 100%
  );
  backdrop-filter: blur(40px) saturate(1.4);
  border-bottom: 1px solid color-mix(in srgb, var(--color-cosmic-ice) 20%, transparent 80%);
  z-index: var(--z-floating);
  
  /* Dynamic glow based on market conditions */
  box-shadow: 
    0 4px 32px color-mix(in srgb, var(--color-quantum-glow) ${props => props.glowIntensity * 20}%, transparent),
    inset 0 1px 0 rgba(255,255,255,0.1),
    inset 0 -1px 0 rgba(0,0,0,0.2);
  
  /* AI mood color adaptation */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => {
      switch(props.aiMood) {
        case 'bullish': return 'linear-gradient(90deg, var(--color-profit-muted) 0%, transparent 100%)';
        case 'bearish': return 'linear-gradient(90deg, var(--color-loss-muted) 0%, transparent 100%)';
        case 'volatile': return 'linear-gradient(90deg, var(--color-warning-amber) 0%, transparent 100%)';
        default: return 'linear-gradient(90deg, var(--color-quantum-glow) 0%, transparent 100%)';
      }
    }};
    opacity: ${props => Math.min(props.volatility * 0.3, 0.2)};
    z-index: -1;
    transition: opacity var(--transition-smooth);
  }
  
  transition: all var(--transition-smooth) var(--ease-spacecraft);
`;

const LogoContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-molecule);
  height: 100%;
  padding: 0 var(--space-solar);
`;

const ConstellationLogo = styled.div<{ animated: boolean; intensity: number }>`
  width: 48px;
  height: 48px;
  position: relative;
  cursor: pointer;
  
  /* 3D constellation effect */
  perspective: 1000px;
  transform-style: preserve-3d;
  
  svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 0 20px var(--color-quantum-glow));
    transition: all var(--transition-dramatic) var(--ease-quantum);
  }
  
  &:hover svg {
    transform: rotateY(20deg) rotateX(10deg) scale(1.1);
    filter: drop-shadow(0 0 30px var(--color-quantum-glow));
  }
  
  /* Animated constellation lines */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: ${props => 60 + props.intensity * 20}px;
    height: ${props => 60 + props.intensity * 20}px;
    transform: translate(-50%, -50%);
    background: conic-gradient(
      from 0deg,
      var(--color-quantum-glow) 0deg,
      transparent 90deg,
      var(--color-ai-insight) 180deg,
      transparent 270deg,
      var(--color-quantum-glow) 360deg
    );
    border-radius: 50%;
    opacity: ${props => props.intensity * 0.3};
    animation: ${props => props.animated ? css`constellation-orbit 8s linear infinite` : 'none'};
    z-index: -1;
  }
`;

const AdaptiveTitleContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 400px;
`;

const MainTitle = styled.h1<{ mood: string; volatility: number }>`
  font-family: var(--font-display);
  font-variation-settings: "wght" 700, "wdth" 115;
  font-size: clamp(1.2rem, 2.5vw, 1.8rem);
  margin: 0;
  letter-spacing: 0.05em;
  line-height: 1;
  
  /* Dynamic title color based on market mood */
  background: ${props => {
    switch(props.mood) {
      case 'bullish': 
        return `linear-gradient(135deg, 
          var(--color-profit-muted) 0%, 
          var(--color-cosmic-ice) 50%,
          var(--color-quantum-glow) 100%)`;
      case 'bearish':
        return `linear-gradient(135deg, 
          var(--color-loss-muted) 0%, 
          var(--color-cosmic-ice) 50%,
          var(--color-starlight) 100%)`;
      case 'volatile':
        return `linear-gradient(135deg, 
          var(--color-warning-amber) 0%, 
          var(--color-cosmic-ice) 30%,
          var(--color-ai-insight) 60%,
          var(--color-quantum-glow) 100%)`;
      default:
        return `linear-gradient(135deg, 
          var(--color-starlight) 0%, 
          var(--color-cosmic-ice) 50%,
          var(--color-quantum-glow) 100%)`;
    }
  }};
  
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  /* Volatility-based text shadow */
  filter: drop-shadow(0 0 ${props => 10 + props.volatility * 20}px 
    color-mix(in srgb, var(--color-quantum-glow) 40%, transparent));
    
  transition: all var(--transition-smooth);
`;

const SubTitle = styled.div<{ aiActive: boolean }>`
  font-family: var(--font-primary);
  font-variation-settings: "wght" 500;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--color-starlight) 70%, transparent 30%);
  margin-top: var(--space-quantum);
  
  /* AI context indicator */
  &::before {
    content: '◉ ';
    color: ${props => props.aiActive ? 'var(--color-ai-insight)' : 'var(--color-starlight)'};
    animation: ${props => props.aiActive ? 'quantum-pulse 2s infinite' : 'none'};
  }
  
  transition: all var(--transition-smooth);
`;

const NavigationContainer = styled.nav`
  display: flex;
  align-items: center;
  gap: var(--space-molecule);
  padding-right: var(--space-solar);
`;

const AstronomicalIndicator = styled.div<{ active: boolean; type: string }>`
  display: flex;
  align-items: center;
  gap: var(--space-atom);
  padding: var(--space-atom) var(--space-molecule);
  border-radius: var(--radius-medium);
  background: color-mix(in srgb, var(--color-maritime-steel) 40%, transparent 60%);
  backdrop-filter: blur(10px);
  border: 1px solid color-mix(in srgb, var(--color-cosmic-ice) 15%, transparent 85%);
  
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--color-starlight);
  
  /* Type-specific glows */
  box-shadow: ${props => {
    if (!props.active) return 'none';
    switch(props.type) {
      case 'mercury': return '0 0 15px var(--color-warning-amber)';
      case 'moon': return '0 0 15px var(--color-cosmic-ice)';
      case 'solar': return '0 0 15px var(--color-critical-red)';
      default: return '0 0 15px var(--color-quantum-glow)';
    }
  }};
  
  transition: all var(--transition-smooth);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px color-mix(in srgb, var(--color-quantum-glow) 30%, transparent);
  }
`;

const MarketMoodIndicator = styled.div<{ mood: string; intensity: number }>`
  width: 32px;
  height: 32px;
  border-radius: var(--radius-orbital);
  position: relative;
  cursor: pointer;
  
  /* Base gradient based on mood */
  background: ${props => {
    switch(props.mood) {
      case 'bullish': return 'radial-gradient(circle, var(--color-profit-muted) 0%, transparent 70%)';
      case 'bearish': return 'radial-gradient(circle, var(--color-loss-muted) 0%, transparent 70%)';
      case 'volatile': return 'radial-gradient(circle, var(--color-warning-amber) 0%, transparent 70%)';
      default: return 'radial-gradient(circle, var(--color-quantum-glow) 0%, transparent 70%)';
    }
  }};
  
  /* Pulsing animation based on intensity */
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    background: inherit;
    transform: translate(-50%, -50%);
    animation: mood-pulse ${props => 2 - props.intensity}s infinite;
    z-index: -1;
  }
  
  transition: all var(--transition-smooth);
  
  &:hover {
    transform: scale(1.2);
  }
`;

// Keyframes for animations
const constellationOrbit = keyframes`
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
`;

const moodPulse = keyframes`
  0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.2); }
`;

// LOKI Constellation SVG Component
const LokiConstellationSVG: React.FC<{ animated?: boolean }> = ({ animated = true }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Constellation stars */}
    <circle cx="8" cy="12" r="2" fill="var(--color-quantum-glow)">
      {animated && <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" />}
    </circle>
    <circle cx="24" cy="8" r="2.5" fill="var(--color-ai-insight)">
      {animated && <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />}
    </circle>
    <circle cx="40" cy="16" r="2" fill="var(--color-quantum-glow)">
      {animated && <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" repeatCount="indefinite" />}
    </circle>
    <circle cx="12" cy="32" r="1.5" fill="var(--color-cosmic-ice)">
      {animated && <animate attributeName="opacity" values="0.8;1;0.8" dur="4s" repeatCount="indefinite" />}
    </circle>
    <circle cx="36" cy="36" r="2" fill="var(--color-starlight)">
      {animated && <animate attributeName="opacity" values="0.4;1;0.4" dur="3.5s" repeatCount="indefinite" />}
    </circle>
    
    {/* Constellation lines */}
    <path 
      d="M8 12 L24 8 L40 16 M24 8 L36 36 M12 32 L36 36" 
      stroke="var(--color-quantum-glow)" 
      strokeWidth="1" 
      opacity="0.6"
      strokeDasharray="2,2"
    >
      {animated && (
        <animate 
          attributeName="stroke-dashoffset" 
          values="0;4;0" 
          dur="4s" 
          repeatCount="indefinite" 
        />
      )}
    </path>
    
    {/* Central LOKI symbol */}
    <circle cx="24" cy="24" r="3" fill="none" stroke="var(--color-ai-insight)" strokeWidth="2">
      {animated && (
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 24 24;360 24 24"
          dur="8s"
          repeatCount="indefinite"
        />
      )}
    </circle>
  </svg>
);

// Main ConstellationHeader2032 Component
export const ConstellationHeader2032: React.FC<ConstellationHeaderProps> = ({
  logo,
  adaptiveTitle = true,
  aiContext,
  glowEffect = false,
  marketVolatility = 0.3,
  userStress = 0.2,
  astronomicalData
}) => {
  const [currentTitle, setCurrentTitle] = useState("LOKI Prediction Markets");
  const [aiActive, setAiActive] = useState(false);
  const controls = useAnimation();
  
  // Adaptive title generation based on AI context
  useEffect(() => {
    if (!adaptiveTitle || !aiContext) return;
    
    const titles = {
      bullish: "LOKI • Stellar Opportunities",
      bearish: "LOKI • Navigate Uncertainty", 
      volatile: "LOKI • Quantum Markets",
      neutral: "LOKI • Constellation Trading"
    };
    
    setCurrentTitle(titles[aiContext.mood] || titles.neutral);
  }, [adaptiveTitle, aiContext]);
  
  // AI activity indicator
  useEffect(() => {
    const aiActivityTimer = setInterval(() => {
      setAiActive(prev => !prev);
    }, 3000);
    
    return () => clearInterval(aiActivityTimer);
  }, []);
  
  // Dynamic glow intensity calculation
  const glowIntensity = Math.min(
    (marketVolatility * 0.7) + (userStress * 0.3) + (glowEffect ? 0.5 : 0),
    1.0
  );
  
  const aiMood = aiContext?.mood || 'neutral';
  
  return (
    <HeaderContainer 
      volatility={marketVolatility} 
      glowIntensity={glowIntensity}
      aiMood={aiMood}
      role="banner"
    >
      <LogoContainer>
        <ConstellationLogo 
          animated={true} 
          intensity={glowIntensity}
          role="img"
          aria-label="LOKI Constellation Logo"
        >
          {logo || <LokiConstellationSVG animated={true} />}
        </ConstellationLogo>
        
        {adaptiveTitle && (
          <AdaptiveTitleContainer>
            <MainTitle mood={aiMood} volatility={marketVolatility}>
              {currentTitle}
            </MainTitle>
            <SubTitle aiActive={aiActive}>
              AI-Enhanced Trading • {new Date().toLocaleTimeString()}
            </SubTitle>
          </AdaptiveTitleContainer>
        )}
      </LogoContainer>
      
      <NavigationContainer>
        {/* Astronomical Data Indicators */}
        {astronomicalData?.mercuryRetrograde && (
          <AstronomicalIndicator active={true} type="mercury" title="Mercury Retrograde Active">
            ☿ R
          </AstronomicalIndicator>
        )}
        
        {astronomicalData?.solarActivity !== 'low' && (
          <AstronomicalIndicator 
            active={astronomicalData?.solarActivity === 'extreme'} 
            type="solar"
            title={`Solar Activity: ${astronomicalData?.solarActivity}`}
          >
            ☉ {astronomicalData?.solarActivity?.charAt(0).toUpperCase()}
          </AstronomicalIndicator>
        )}
        
        {astronomicalData?.moonPhase && (
          <AstronomicalIndicator active={true} type="moon" title={`Moon Phase: ${astronomicalData.moonPhase}`}>
            ☽ {astronomicalData.moonPhase.charAt(0)}
          </AstronomicalIndicator>
        )}
        
        {/* Market Mood Indicator */}
        <MarketMoodIndicator 
          mood={aiMood} 
          intensity={marketVolatility}
          title={`Market Mood: ${aiMood} (${Math.round(marketVolatility * 100)}% volatility)`}
          role="status"
          aria-label={`Current market sentiment is ${aiMood} with ${Math.round(marketVolatility * 100)}% volatility`}
        />
      </NavigationContainer>
      
      {/* Global styles injection */}
      <style jsx global>{`
        @keyframes constellation-orbit {
          ${constellationOrbit}
        }
        
        @keyframes mood-pulse {
          ${moodPulse}
        }
        
        @keyframes quantum-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </HeaderContainer>
  );
};

export default ConstellationHeader2032;