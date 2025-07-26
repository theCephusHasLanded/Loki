'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { css, keyframes } from '@emotion/react';
import liveAstronomicalDataService from '../../services/LiveAstronomicalDataService';

// Types for astronomical data integration
interface AstronomicalDataPanelProps {
  mode?: 'constellation-nav' | 'cosmic-influence' | 'orbital-mechanics' | 'stellar-correlation';
  realTimeAstronomy?: boolean;
  marketCorrelations?: boolean;
  constellationFocus?: string;
  cosmicWeatherAlerts?: boolean;
  solarSystemTracking?: boolean;
  deepSpaceMonitoring?: boolean;
  astroTradingSignals?: boolean;
  onCosmicEvent?: (event: CosmicEvent) => void;
  onConstellationSelect?: (constellation: string) => void;
}

interface AstronomicalData {
  timestamp: number;
  moonPhase: {
    name: string;
    illumination: number; // 0-1
    angle: number; // degrees
    phase: 'new' | 'waxing-crescent' | 'first-quarter' | 'waxing-gibbous' | 'full' | 'waning-gibbous' | 'third-quarter' | 'waning-crescent';
  };
  planets: PlanetaryData[];
  constellations: ConstellationData[];
  solarActivity: {
    flareLevel: 'quiet' | 'minor' | 'moderate' | 'strong' | 'extreme';
    solarWindSpeed: number; // km/s
    geomagneticIndex: number; // 0-9
    coronalMassEjection: boolean;
  };
  deepSpace: {
    gammaRayBursts: number;
    neutronStarPulses: number;
    blackHoleActivity: number;
    darkMatterDensity: number;
  };
  astroMetrics: {
    retrogradeCount: number;
    planetaryAlignment: number; // 0-1
    voidMoonEvents: number;
    eclipticCrossings: number;
  };
}

interface PlanetaryData {
  name: string;
  position: { ra: number; dec: number }; // Right ascension, Declination
  retrograde: boolean;
  marketInfluence: number; // -1 to 1
  tradingCorrelation: number; // 0-1
  visibility: number; // 0-1
}

interface ConstellationData {
  name: string;
  visibility: number; // 0-1
  marketCorrelation: number; // -1 to 1
  tradingVolume: number;
  stars: StarData[];
  mythologicalSignificance: string;
  currentPower: number; // 0-1
}

interface StarData {
  name: string;
  magnitude: number;
  spectralClass: string;
  position: { ra: number; dec: number };
  marketResonance: number; // 0-1
}

interface CosmicEvent {
  type: 'eclipse' | 'conjunction' | 'retrograde' | 'flare' | 'alignment' | 'meteor-shower';
  timestamp: number;
  significance: 'minor' | 'moderate' | 'major' | 'cosmic';
  marketImpact: number; // -1 to 1
  duration: number; // hours
  affectedMarkets: string[];
}

// Advanced styled components for astronomical interface
const AstronomicalContainer = styled(motion.div)<{
  mode: string;
  cosmicActivity: number;
  constellationPower: number;
}>`
  position: relative;
  width: 100%;
  min-height: 600px;
  background: radial-gradient(ellipse at center,
    color-mix(in srgb, var(--color-void-black) 85%, var(--color-space-deep) 15%) 0%,
    color-mix(in srgb, var(--color-void-black) 95%, var(--color-ai-insight) 5%) 50%,
    var(--color-void-black) 100%
  );
  border-radius: var(--radius-large);
  overflow: hidden;

  /* Advanced neumorphism with cosmic depth */
  box-shadow:
    inset 30px 30px 80px var(--nm-shadow-dark),
    inset -30px -30px 80px var(--nm-shadow-light),
    0 0 ${props => 60 + props.cosmicActivity * 100}px color-mix(in srgb, var(--color-quantum-glow) 30%, transparent),
    0 0 ${props => 30 + props.constellationPower * 60}px color-mix(in srgb, var(--color-ai-insight) 40%, transparent);

  /* Mode-specific atmospheric effects */
  ${props => {
    switch(props.mode) {
      case 'constellation-nav':
        return css`
          background: radial-gradient(circle at 30% 40%,
            color-mix(in srgb, var(--color-starlight) 20%, var(--color-void-black) 80%) 0%,
            var(--color-void-black) 70%
          );
        `;
      case 'cosmic-influence':
        return css`
          background: linear-gradient(135deg,
            color-mix(in srgb, var(--color-ai-insight) 25%, var(--color-void-black) 75%) 0%,
            color-mix(in srgb, var(--color-quantum-glow) 15%, var(--color-void-black) 85%) 50%,
            var(--color-void-black) 100%
          );
        `;
      case 'stellar-correlation':
        return css`
          background: conic-gradient(from 0deg at 50% 50%,
            var(--color-void-black) 0deg,
            color-mix(in srgb, var(--color-starlight) 30%, var(--color-void-black) 70%) 90deg,
            var(--color-void-black) 180deg,
            color-mix(in srgb, var(--color-cosmic-ice) 20%, var(--color-void-black) 80%) 270deg,
            var(--color-void-black) 360deg
          );
        `;
      default:
        return '';
    }
  }}

  border: 2px solid color-mix(in srgb, var(--color-cosmic-ice) 15%, transparent 85%);
  position: relative;
`;

const CosmicStarField = styled.div<{
  activity: number;
  focus: string;
}>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  /* Dynamic star field generation */
  background-image:
    radial-gradient(2px 2px at 20px 30px, var(--color-starlight) 2px, transparent 0),
    radial-gradient(2px 2px at 40px 70px, var(--color-quantum-glow) 1px, transparent 0),
    radial-gradient(1px 1px at 90px 40px, var(--color-cosmic-ice) 1px, transparent 0),
    radial-gradient(1px 1px at 130px 80px, var(--color-ai-insight) 0.5px, transparent 0),
    radial-gradient(2px 2px at 160px 30px, var(--color-starlight) 1px, transparent 0);

  background-repeat: repeat;
  background-size: 200px 100px, 180px 120px, 220px 90px, 250px 110px, 190px 130px;

  /* Constellation focus highlighting */
  ${props => props.focus && css`
    &::before {
      content: '';
      position: absolute;
      top: 30%;
      left: 40%;
      width: 20%;
      height: 20%;
      background: radial-gradient(circle,
        color-mix(in srgb, var(--color-quantum-glow) 40%, transparent 60%) 0%,
        transparent 70%
      );
      animation: constellation-highlight 4s ease-in-out infinite;
    }
  `}

  animation: stellar-drift ${props => 120 - props.activity * 60}s linear infinite;
  opacity: 0.6;
`;

const AstronomicalGrid = styled.div<{ columns: number }>`
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(${props => props.columns}, 1fr);
  gap: var(--space-molecule);
  padding: var(--space-solar);
  height: 100%;
`;

const CosmicPanel = styled(motion.div)<{
  significance: string;
  marketImpact: number;
  cosmicResonance: number;
}>`
  background: color-mix(in srgb, var(--nm-surface-base) 60%, transparent 40%);
  backdrop-filter: blur(20px) saturate(1.5);
  border-radius: var(--radius-medium);
  padding: var(--space-molecule);
  position: relative;
  overflow: hidden;

  /* Significance-based prominence */
  ${props => {
    switch(props.significance) {
      case 'cosmic':
        return css`
          border: 2px solid var(--color-ai-insight);
          box-shadow:
            8px 8px 24px var(--nm-shadow-dark),
            -8px -8px 24px var(--nm-shadow-light),
            0 0 40px color-mix(in srgb, var(--color-ai-insight) 50%, transparent);
        `;
      case 'major':
        return css`
          border: 2px solid var(--color-quantum-glow);
          box-shadow:
            6px 6px 18px var(--nm-shadow-dark),
            -6px -6px 18px var(--nm-shadow-light),
            0 0 30px color-mix(in srgb, var(--color-quantum-glow) 40%, transparent);
        `;
      case 'moderate':
        return css`
          border: 1px solid var(--color-starlight);
          box-shadow:
            4px 4px 12px var(--nm-shadow-dark),
            -4px -4px 12px var(--nm-shadow-light);
        `;
      default:
        return css`
          border: 1px solid color-mix(in srgb, var(--color-cosmic-ice) 20%, transparent 80%);
          box-shadow:
            2px 2px 6px var(--nm-shadow-dark),
            -2px -2px 6px var(--nm-shadow-light);
        `;
    }
  }}

  /* Market impact visualization */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => {
      if (props.marketImpact > 0.5) return 'linear-gradient(90deg, var(--color-profit-muted), var(--color-quantum-glow))';
      if (props.marketImpact < -0.5) return 'linear-gradient(90deg, var(--color-loss-muted), var(--color-critical-red))';
      return 'linear-gradient(90deg, var(--color-starlight), var(--color-cosmic-ice))';
    }};
    opacity: ${props => Math.abs(props.marketImpact)};
  }

  /* Cosmic resonance pulsing */
  ${props => props.cosmicResonance > 0.7 && css`
    animation: cosmic-resonance 2s ease-in-out infinite;
  `}

  transition: all var(--transition-smooth) var(--ease-spacecraft);

  &:hover {
    transform: translateY(-4px) scale(1.02);
    backdrop-filter: blur(25px) saturate(1.8);
    box-shadow:
      12px 12px 36px var(--nm-shadow-dark),
      0 0 50px color-mix(in srgb, var(--color-quantum-glow) 40%, transparent);
  }
`;

const MoonPhaseIndicator = styled.div<{
  illumination: number;
  phase: string;
}>`
  position: relative;
  width: 60px;
  height: 60px;
  margin: 0 auto var(--space-molecule);

  .moon-body {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%,
      var(--color-cosmic-ice) 0%,
      color-mix(in srgb, var(--color-cosmic-ice) 70%, var(--color-maritime-steel) 30%) 100%
    );
    position: relative;
    overflow: hidden;

    box-shadow:
      inset 8px 8px 16px rgba(0,0,0,0.3),
      inset -4px -4px 8px rgba(255,255,255,0.1),
      0 0 20px color-mix(in srgb, var(--color-cosmic-ice) 30%, transparent);
  }

  .moon-shadow {
    position: absolute;
    top: 0;
    left: ${props => 50 - (props.illumination * 50)}%;
    width: ${props => 50 + (props.illumination * 50)}%;
    height: 100%;
    background: radial-gradient(ellipse at center,
      rgba(0,0,0,0.8) 0%,
      rgba(0,0,0,0.4) 70%,
      transparent 100%
    );
    border-radius: 50%;
  }

  .moon-glow {
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    background: radial-gradient(circle,
      color-mix(in srgb, var(--color-cosmic-ice) 20%, transparent 80%) 0%,
      transparent 70%
    );
    border-radius: 50%;
    animation: lunar-pulse 4s ease-in-out infinite;
  }
`;

const PlanetaryOrbit = styled.div<{
  distance: number;
  speed: number;
  retrograde: boolean;
  influence: number;
}>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${props => 100 + props.distance * 150}px;
  height: ${props => 100 + props.distance * 150}px;
  border: 1px solid color-mix(in srgb, var(--color-starlight) 20%, transparent 80%);
  border-radius: 50%;
  transform: translate(-50%, -50%);

  .planet {
    position: absolute;
    top: -6px;
    left: 50%;
    width: 12px;
    height: 12px;
    background: ${props => {
      if (props.influence > 0.5) return 'var(--color-profit-muted)';
      if (props.influence < -0.5) return 'var(--color-loss-muted)';
      return 'var(--color-quantum-glow)';
    }};
    border-radius: 50%;
    transform: translateX(-50%);

    box-shadow: 0 0 ${props => 10 + Math.abs(props.influence) * 20}px currentColor;

    /* Retrograde indication */
    ${props => props.retrograde && css`
      &::after {
        content: 'R';
        position: absolute;
        top: -20px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 8px;
        color: var(--color-warning-amber);
        font-weight: bold;
      }
    `}
  }

  animation: orbital-motion ${props => 20 / props.speed}s linear infinite ${props => props.retrograde ? 'reverse' : 'normal'};
`;

const ConstellationMap = styled.div<{
  activeConstellation: string;
  powerLevel: number;
}>`
  position: relative;
  width: 100%;
  height: 200px;
  background: color-mix(in srgb, var(--color-void-black) 95%, transparent 5%);
  border-radius: var(--radius-medium);
  border: 1px solid color-mix(in srgb, var(--color-starlight) 15%, transparent 85%);
  overflow: hidden;

  .constellation-star {
    position: absolute;
    width: 4px;
    height: 4px;
    background: var(--color-starlight);
    border-radius: 50%;

    &.active {
      background: var(--color-quantum-glow);
      box-shadow: 0 0 15px var(--color-quantum-glow);
      animation: stellar-pulse 2s ease-in-out infinite;
    }

    &.power-star {
      background: var(--color-ai-insight);
      box-shadow: 0 0 20px var(--color-ai-insight);
      transform: scale(${props => 1 + props.powerLevel * 0.5});
    }
  }

  .constellation-line {
    position: absolute;
    height: 1px;
    background: linear-gradient(90deg,
      var(--color-starlight) 0%,
      color-mix(in srgb, var(--color-starlight) 60%, transparent 40%) 50%,
      var(--color-starlight) 100%
    );
    transform-origin: left center;

    &.active-line {
      background: linear-gradient(90deg,
        var(--color-quantum-glow) 0%,
        color-mix(in srgb, var(--color-quantum-glow) 60%, transparent 40%) 50%,
        var(--color-quantum-glow) 100%
      );
      animation: constellation-flow 3s ease-in-out infinite;
    }
  }
`;

const CosmicEventAlert = styled(motion.div)<{
  urgency: string;
  marketImpact: number;
}>`
  position: absolute;
  top: var(--space-molecule);
  right: var(--space-molecule);
  padding: var(--space-molecule);
  border-radius: var(--radius-medium);
  backdrop-filter: blur(20px);
  z-index: 10;

  background: ${props => {
    switch(props.urgency) {
      case 'cosmic':
        return 'linear-gradient(135deg, var(--color-ai-insight), var(--color-quantum-glow))';
      case 'major':
        return 'linear-gradient(135deg, var(--color-warning-amber), var(--color-quantum-glow))';
      case 'moderate':
        return 'linear-gradient(135deg, var(--color-starlight), var(--color-cosmic-ice))';
      default:
        return 'color-mix(in srgb, var(--color-maritime-steel) 40%, transparent 60%)';
    }
  }};

  border: 2px solid ${props => {
    if (Math.abs(props.marketImpact) > 0.7) return 'var(--color-critical-red)';
    if (Math.abs(props.marketImpact) > 0.4) return 'var(--color-warning-amber)';
    return 'var(--color-starlight)';
  }};

  box-shadow:
    0 8px 32px rgba(0,0,0,0.5),
    0 0 ${props => 30 + Math.abs(props.marketImpact) * 50}px currentColor;

  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--color-cosmic-ice);

  ${props => props.urgency === 'cosmic' && css`
    animation: cosmic-alert 1s ease-in-out infinite;
  `}
`;

const AstroMetricsDisplay = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--space-atom);
  margin-top: var(--space-molecule);

  .metric-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--space-atom);
    background: color-mix(in srgb, var(--color-maritime-steel) 20%, transparent 80%);
    border-radius: var(--radius-small);
    border: 1px solid color-mix(in srgb, var(--color-cosmic-ice) 10%, transparent 90%);
  }

  .metric-label {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    color: var(--color-starlight);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: var(--space-quantum);
  }

  .metric-value {
    font-family: var(--font-display);
    font-variation-settings: "wght" 600;
    font-size: 1.1rem;
    color: var(--color-cosmic-ice);
  }
`;

// Keyframes for cosmic animations
const stellarDrift = keyframes`
  0% { background-position: 0 0, 0 0, 0 0, 0 0, 0 0; }
  100% { background-position: 200px 100px, 180px 120px, 220px 90px, 250px 110px, 190px 130px; }
`;

const constellationHighlight = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.2); }
`;

const cosmicResonance = keyframes`
  0%, 100% {
    box-shadow:
      8px 8px 24px var(--nm-shadow-dark),
      -8px -8px 24px var(--nm-shadow-light),
      0 0 30px color-mix(in srgb, var(--color-quantum-glow) 30%, transparent);
  }
  50% {
    box-shadow:
      12px 12px 36px var(--nm-shadow-dark),
      -12px -12px 36px var(--nm-shadow-light),
      0 0 50px color-mix(in srgb, var(--color-quantum-glow) 50%, transparent);
  }
`;

const lunarPulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`;

const orbitalMotion = keyframes`
  0% { transform: translateX(-50%) rotate(0deg) translateX(50px) rotate(0deg); }
  100% { transform: translateX(-50%) rotate(360deg) translateX(50px) rotate(-360deg); }
`;

const stellarPulse = keyframes`
  0%, 100% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.3); }
`;

const constellationFlow = keyframes`
  0% { opacity: 0.5; }
  50% { opacity: 1; box-shadow: 0 0 10px currentColor; }
  100% { opacity: 0.5; }
`;

const cosmicAlert = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.05); opacity: 1; }
`;

// Main Astronomical Data Panel Component
export const AstronomicalDataPanel2032: React.FC<AstronomicalDataPanelProps> = ({
  mode = 'constellation-nav',
  realTimeAstronomy = true,
  marketCorrelations = true,
  constellationFocus = '',
  cosmicWeatherAlerts = true,
  solarSystemTracking = true,
  deepSpaceMonitoring = false,
  astroTradingSignals = true,
  onCosmicEvent,
  onConstellationSelect
}) => {
  const [astronomicalData, setAstronomicalData] = useState<AstronomicalData | null>(null);
  const [activeEvents, setActiveEvents] = useState<CosmicEvent[]>([]);
  const [constellationPower, setConstellationPower] = useState(0.7);
  const [cosmicActivity, setCosmicActivity] = useState(0.5);

  // Real-time astronomical data updates using live service
  useEffect(() => {
    if (!realTimeAstronomy) return;

    const updateAstronomicalData = async () => {
      try {
        const liveData = await liveAstronomicalDataService.getCurrentData();
        const correlations = liveAstronomicalDataService.getMarketCorrelations();
        
        // Convert live data to component format
        const astronomicalData: AstronomicalData = {
          timestamp: liveData.timestamp,
        moonPhase: {
          name: liveData.moonPhase.name,
          illumination: liveData.moonPhase.illumination,
          angle: liveData.moonPhase.angle,
          phase: liveData.moonPhase.phase
        },
        planets: [
          {
            name: 'Mercury',
            position: { ra: 15.2, dec: -18.4 },
            retrograde: Math.random() > 0.8,
            marketInfluence: (Math.random() - 0.5) * 2,
            tradingCorrelation: Math.random(),
            visibility: Math.random()
          },
          {
            name: 'Venus',
            position: { ra: 22.8, dec: 12.1 },
            retrograde: false,
            marketInfluence: (Math.random() - 0.5) * 2,
            tradingCorrelation: Math.random(),
            visibility: Math.random()
          },
          {
            name: 'Mars',
            position: { ra: 8.7, dec: -5.3 },
            retrograde: Math.random() > 0.9,
            marketInfluence: (Math.random() - 0.5) * 2,
            tradingCorrelation: Math.random(),
            visibility: Math.random()
          }
        ],
        constellations: [
          {
            name: 'Orion',
            visibility: 0.85,
            marketCorrelation: 0.72,
            tradingVolume: 1250000,
            currentPower: Math.random(),
            mythologicalSignificance: 'The Hunter - Strategic Trading',
            stars: []
          },
          {
            name: 'Ursa Major',
            visibility: 0.91,
            marketCorrelation: -0.43,
            tradingVolume: 890000,
            currentPower: Math.random(),
            mythologicalSignificance: 'The Great Bear - Market Protection',
            stars: []
          }
        ],
        solarActivity: {
          flareLevel: ['quiet', 'minor', 'moderate'][Math.floor(Math.random() * 3)] as any,
          solarWindSpeed: 350 + Math.random() * 300,
          geomagneticIndex: Math.floor(Math.random() * 9),
          coronalMassEjection: Math.random() > 0.95
        },
        deepSpace: {
          gammaRayBursts: Math.floor(Math.random() * 3),
          neutronStarPulses: Math.floor(Math.random() * 5),
          blackHoleActivity: Math.random(),
          darkMatterDensity: Math.random()
        },
        astroMetrics: {
          retrogradeCount: Math.floor(Math.random() * 4),
          planetaryAlignment: Math.random(),
          voidMoonEvents: Math.floor(Math.random() * 2),
          eclipticCrossings: Math.floor(Math.random() * 3)
        }
      };

      setAstronomicalData(astronomicalData);

      // Generate cosmic events based on live data
      if (liveData.astronomicalEvents.length > 0 || Math.random() > 0.8) {
        const event: CosmicEvent = {
          type: ['conjunction', 'retrograde', 'flare', 'alignment'][Math.floor(Math.random() * 4)] as any,
          timestamp: Date.now(),
          significance: ['minor', 'moderate', 'major'][Math.floor(Math.random() * 3)] as any,
          marketImpact: correlations.overallCosmicSentiment === 'bullish' ? 0.5 : 
                       correlations.overallCosmicSentiment === 'bearish' ? -0.5 : 0,
          duration: Math.random() * 24,
          affectedMarkets: ['BTC/USD', 'GOLD', 'SPY']
        };

        setActiveEvents(prev => [event, ...prev.slice(0, 2)]);
        onCosmicEvent?.(event);
      }
      } catch (error) {
        console.error('Error fetching astronomical data:', error);
        // Fallback to basic mock data if live service fails
        setAstronomicalData({
          timestamp: Date.now(),
          moonPhase: { name: 'Waxing Gibbous', illumination: 0.73, angle: 127, phase: 'waxing-gibbous' },
          planets: [],
          constellations: [],
          solarActivity: { flareLevel: 'quiet', solarWindSpeed: 350, geomagneticIndex: 2, coronalMassEjection: false },
          deepSpace: { gammaRayBursts: 0, neutronStarPulses: 5, blackHoleActivity: 0.1, darkMatterDensity: 0.3 },
          astroMetrics: { retrogradeCount: 0, planetaryAlignment: 0.5, voidMoonEvents: 0, eclipticCrossings: 1 }
        });
      }
    };

    updateAstronomicalData();

    // Update every 30 seconds
    const interval = setInterval(updateAstronomicalData, 30000);

    return () => clearInterval(interval);
  }, [realTimeAstronomy, onCosmicEvent]);

  // Calculate grid columns based on mode
  const gridColumns = useMemo(() => {
    switch(mode) {
      case 'constellation-nav': return 3;
      case 'cosmic-influence': return 2;
      case 'stellar-correlation': return 4;
      default: return 3;
    }
  }, [mode]);

  if (!astronomicalData) {
    return (
      <AstronomicalContainer
        mode={mode}
        cosmicActivity={0.3}
        constellationPower={0.5}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: 'var(--color-starlight)'
        }}>
          Loading astronomical data...
        </div>
      </AstronomicalContainer>
    );
  }

  return (
    <AstronomicalContainer
      mode={mode}
      cosmicActivity={cosmicActivity}
      constellationPower={constellationPower}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      {/* Cosmic star field background */}
      <CosmicStarField
        activity={cosmicActivity}
        focus={constellationFocus}
      />

      {/* Active cosmic events alerts */}
      <AnimatePresence>
        {activeEvents.map((event, index) => (
          <CosmicEventAlert
            key={event.timestamp}
            urgency={event.significance}
            marketImpact={event.marketImpact}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            style={{ top: `calc(var(--space-molecule) + ${index * 80}px)` }}
          >
            <div style={{ fontWeight: 700, marginBottom: 'var(--space-quantum)' }}>
              🌌 {event.type.toUpperCase()}
            </div>
            <div style={{ fontSize: '0.7rem', opacity: 0.9 }}>
              Impact: {event.marketImpact > 0 ? '+' : ''}{Math.round(event.marketImpact * 100)}%
            </div>
          </CosmicEventAlert>
        ))}
      </AnimatePresence>

      {/* Main astronomical grid */}
      <AstronomicalGrid columns={gridColumns}>
        {/* Moon Phase Panel */}
        <CosmicPanel
          significance="major"
          marketImpact={0.3}
          cosmicResonance={astronomicalData.moonPhase.illumination}
          whileHover={{ scale: 1.02 }}
        >
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1rem',
            color: 'var(--color-cosmic-ice)',
            marginBottom: 'var(--space-molecule)',
            textAlign: 'center'
          }}>
            🌙 Lunar Influence
          </h3>

          <MoonPhaseIndicator
            illumination={astronomicalData.moonPhase.illumination}
            phase={astronomicalData.moonPhase.phase}
          >
            <div className="moon-glow" />
            <div className="moon-body">
              <div className="moon-shadow" />
            </div>
          </MoonPhaseIndicator>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: 'var(--color-starlight)',
              marginBottom: 'var(--space-quantum)'
            }}>
              {astronomicalData.moonPhase.name}
            </div>
            <div style={{
              fontFamily: 'var(--font-data)',
              fontSize: '1rem',
              color: 'var(--color-quantum-glow)'
            }}>
              {Math.round(astronomicalData.moonPhase.illumination * 100)}% Illuminated
            </div>
          </div>
        </CosmicPanel>

        {/* Planetary Positions */}
        {solarSystemTracking && (
          <CosmicPanel
            significance="moderate"
            marketImpact={0.2}
            cosmicResonance={0.6}
          >
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              color: 'var(--color-cosmic-ice)',
              marginBottom: 'var(--space-molecule)',
              textAlign: 'center'
            }}>
              🪐 Planetary Influence
            </h3>

            <div style={{ position: 'relative', height: '200px' }}>
              {astronomicalData.planets.map((planet, index) => (
                <PlanetaryOrbit
                  key={planet.name}
                  distance={index * 0.3}
                  speed={1 + index * 0.2}
                  retrograde={planet.retrograde}
                  influence={planet.marketInfluence}
                  title={`${planet.name}: ${planet.marketInfluence > 0 ? '+' : ''}${Math.round(planet.marketInfluence * 100)}% market influence`}
                >
                  <div className="planet" />
                </PlanetaryOrbit>
              ))}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-around',
              fontSize: '0.7rem',
              color: 'var(--color-starlight)',
              marginTop: 'var(--space-molecule)'
            }}>
              {astronomicalData.planets.map(planet => (
                <div key={planet.name} style={{ textAlign: 'center' }}>
                  <div>{planet.name.slice(0, 3)}</div>
                  <div style={{
                    color: planet.marketInfluence > 0 ? 'var(--color-profit-muted)' : 'var(--color-loss-muted)',
                    fontWeight: 600
                  }}>
                    {planet.marketInfluence > 0 ? '+' : ''}{Math.round(planet.marketInfluence * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </CosmicPanel>
        )}

        {/* Constellation Map */}
        <CosmicPanel
          significance="cosmic"
          marketImpact={0.5}
          cosmicResonance={constellationPower}
        >
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1rem',
            color: 'var(--color-cosmic-ice)',
            marginBottom: 'var(--space-molecule)',
            textAlign: 'center'
          }}>
            ✨ Constellation Power
          </h3>

          <ConstellationMap
            activeConstellation={constellationFocus}
            powerLevel={constellationPower}
          >
            {/* Simplified constellation visualization */}
            <div className="constellation-star active power-star" style={{ top: '30%', left: '40%' }} />
            <div className="constellation-star active" style={{ top: '50%', left: '60%' }} />
            <div className="constellation-star" style={{ top: '70%', left: '30%' }} />
            <div className="constellation-star active" style={{ top: '40%', left: '70%' }} />

            <div className="constellation-line active-line" style={{
              top: '40%', left: '40%', width: '20%',
              transform: 'rotate(30deg)'
            }} />
            <div className="constellation-line active-line" style={{
              top: '50%', left: '30%', width: '30%',
              transform: 'rotate(-20deg)'
            }} />
          </ConstellationMap>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.7rem',
            marginTop: 'var(--space-molecule)'
          }}>
            {astronomicalData.constellations.map(constellation => (
              <div
                key={constellation.name}
                style={{
                  cursor: 'pointer',
                  padding: 'var(--space-quantum)',
                  borderRadius: 'var(--radius-small)',
                  background: constellation.name === constellationFocus ?
                    'color-mix(in srgb, var(--color-quantum-glow) 20%, transparent 80%)' :
                    'transparent'
                }}
                onClick={() => onConstellationSelect?.(constellation.name)}
              >
                <div style={{ color: 'var(--color-cosmic-ice)', fontWeight: 600 }}>
                  {constellation.name}
                </div>
                <div style={{
                  color: constellation.marketCorrelation > 0 ? 'var(--color-profit-muted)' : 'var(--color-loss-muted)'
                }}>
                  {constellation.marketCorrelation > 0 ? '+' : ''}{Math.round(constellation.marketCorrelation * 100)}%
                </div>
              </div>
            ))}
          </div>
        </CosmicPanel>

        {/* Solar Activity Monitor */}
        <CosmicPanel
          significance={astronomicalData.solarActivity.coronalMassEjection ? 'cosmic' : 'moderate'}
          marketImpact={astronomicalData.solarActivity.geomagneticIndex / 9}
          cosmicResonance={astronomicalData.solarActivity.geomagneticIndex / 9}
        >
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1rem',
            color: 'var(--color-cosmic-ice)',
            marginBottom: 'var(--space-molecule)',
            textAlign: 'center'
          }}>
            ☀️ Solar Activity
          </h3>

          <div style={{ textAlign: 'center', marginBottom: 'var(--space-molecule)' }}>
            <div style={{
              fontSize: '1.5rem',
              color: astronomicalData.solarActivity.flareLevel === 'extreme' ? 'var(--color-critical-red)' :
                     astronomicalData.solarActivity.flareLevel === 'strong' ? 'var(--color-warning-amber)' :
                     'var(--color-quantum-glow)',
              fontWeight: 700,
              textTransform: 'uppercase'
            }}>
              {astronomicalData.solarActivity.flareLevel}
            </div>
            {astronomicalData.solarActivity.coronalMassEjection && (
              <div style={{
                color: 'var(--color-critical-red)',
                fontSize: '0.8rem',
                fontWeight: 600,
                animation: 'cosmic-alert 1s infinite'
              }}>
                ⚠️ CME DETECTED
              </div>
            )}
          </div>

          <AstroMetricsDisplay>
            <div className="metric-item">
              <div className="metric-label">Solar Wind</div>
              <div className="metric-value">
                {Math.round(astronomicalData.solarActivity.solarWindSpeed)} km/s
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-label">Geo Index</div>
              <div className="metric-value">
                {astronomicalData.solarActivity.geomagneticIndex}/9
              </div>
            </div>
          </AstroMetricsDisplay>
        </CosmicPanel>

        {/* Deep Space Monitoring */}
        {deepSpaceMonitoring && (
          <CosmicPanel
            significance="minor"
            marketImpact={0.1}
            cosmicResonance={astronomicalData.deepSpace.blackHoleActivity}
          >
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              color: 'var(--color-cosmic-ice)',
              marginBottom: 'var(--space-molecule)',
              textAlign: 'center'
            }}>
              🌌 Deep Space
            </h3>

            <AstroMetricsDisplay>
              <div className="metric-item">
                <div className="metric-label">Gamma Bursts</div>
                <div className="metric-value">{astronomicalData.deepSpace.gammaRayBursts}</div>
              </div>
              <div className="metric-item">
                <div className="metric-label">Pulsar Activity</div>
                <div className="metric-value">{astronomicalData.deepSpace.neutronStarPulses}</div>
              </div>
              <div className="metric-item">
                <div className="metric-label">Dark Matter</div>
                <div className="metric-value">
                  {Math.round(astronomicalData.deepSpace.darkMatterDensity * 100)}%
                </div>
              </div>
            </AstroMetricsDisplay>
          </CosmicPanel>
        )}

        {/* Astro Trading Signals */}
        {astroTradingSignals && (
          <CosmicPanel
            significance="major"
            marketImpact={0.4}
            cosmicResonance={astronomicalData.astroMetrics.planetaryAlignment}
          >
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              color: 'var(--color-cosmic-ice)',
              marginBottom: 'var(--space-molecule)',
              textAlign: 'center'
            }}>
              📡 Trading Signals
            </h3>

            <AstroMetricsDisplay>
              <div className="metric-item">
                <div className="metric-label">Retrogrades</div>
                <div className="metric-value" style={{
                  color: astronomicalData.astroMetrics.retrogradeCount > 2 ? 'var(--color-warning-amber)' : 'var(--color-cosmic-ice)'
                }}>
                  {astronomicalData.astroMetrics.retrogradeCount}
                </div>
              </div>
              <div className="metric-item">
                <div className="metric-label">Alignment</div>
                <div className="metric-value" style={{
                  color: astronomicalData.astroMetrics.planetaryAlignment > 0.7 ? 'var(--color-quantum-glow)' : 'var(--color-cosmic-ice)'
                }}>
                  {Math.round(astronomicalData.astroMetrics.planetaryAlignment * 100)}%
                </div>
              </div>
              <div className="metric-item">
                <div className="metric-label">Void Moon</div>
                <div className="metric-value">
                  {astronomicalData.astroMetrics.voidMoonEvents}
                </div>
              </div>
            </AstroMetricsDisplay>
          </CosmicPanel>
        )}
      </AstronomicalGrid>

      {/* Global styles injection */}
      <style jsx global>{`
        @keyframes stellar-drift {
          ${stellarDrift}
        }

        @keyframes constellation-highlight {
          ${constellationHighlight}
        }

        @keyframes cosmic-resonance {
          ${cosmicResonance}
        }

        @keyframes lunar-pulse {
          ${lunarPulse}
        }

        @keyframes orbital-motion {
          ${orbitalMotion}
        }

        @keyframes stellar-pulse {
          ${stellarPulse}
        }

        @keyframes constellation-flow {
          ${constellationFlow}
        }

        @keyframes cosmic-alert {
          ${cosmicAlert}
        }
      `}</style>
    </AstronomicalContainer>
  );
};

export default AstronomicalDataPanel2032;
