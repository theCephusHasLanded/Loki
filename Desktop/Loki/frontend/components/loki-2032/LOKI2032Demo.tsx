'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { NeomorphicSurface } from './NeomorphicSurface';
import { LokiConstellation } from './LokiConstellation';
import { MarketCard } from './MarketCard';
import { 
  AnalyticsIcon, 
  MachineLearningIcon, 
  ExecutionIcon, 
  RiskIcon, 
  LatencyIcon, 
  GlobalIcon 
} from '../icons/TradingIcons';
import RealTimeTicker from '../ticker/RealTimeTicker';
import { useTheme } from '../../contexts/ThemeContext';
import GeminiAgent from '../chat/GeminiAgent';

// Demo container with revolutionary styling
const DemoContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  color: var(--color-text-primary);
  overflow: hidden;
  
  /* Layered glass background for depth */
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(ellipse at 20% 30%, var(--color-glass-panel) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 70%, var(--color-glass-surface) 0%, transparent 50%);
    backdrop-filter: var(--glass-blur-subtle);
    z-index: -1;
    pointer-events: none;
  }
  
  /* Floating glass particles */
  &::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 15% 15%, rgba(255, 255, 255, 0.02) 0%, transparent 2px),
      radial-gradient(circle at 85% 25%, rgba(0, 180, 255, 0.03) 0%, transparent 3px),
      radial-gradient(circle at 25% 85%, rgba(180, 220, 255, 0.02) 0%, transparent 2px),
      radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.01) 0%, transparent 4px);
    background-size: 800px 600px, 600px 800px, 900px 700px, 1000px 800px;
    background-position: 0 0, 200px 100px, 400px 300px, 600px 200px;
    animation: glass-float 120s linear infinite;
    z-index: -1;
    pointer-events: none;
    opacity: 0.6;
  }
  
  @keyframes glass-float {
    0% { 
      background-position: 0 0, 200px 100px, 400px 300px, 600px 200px; 
    }
    100% { 
      background-position: 400px 200px, 600px 300px, 800px 500px, 1000px 400px; 
    }
  }
`;

const Header = styled(motion.header)`
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: clamp(16px, 4vw, 32px) clamp(16px, 4vw, 32px) 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-molecule);
`;

const Title = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 2.5vw, 2rem);
  font-weight: 400;
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.2;
  letter-spacing: 0.05em;
`;

const Subtitle = styled.p`
  font-family: var(--font-primary);
  font-size: clamp(0.75rem, 1.5vw, 1rem);
  color: var(--color-text-secondary);
  margin: 8px 0 0 0;
  line-height: 1.3;
`;

const ControlPanel = styled(NeomorphicSurface)`
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 100;
  padding: 16px;
  min-width: min(250px, calc(100vw - 32px));
  max-width: calc(100vw - 32px);
  
  @media (max-width: 768px) {
    top: 10px;
    right: 10px;
    min-width: min(220px, calc(100vw - 20px));
    padding: 12px;
  }
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-atom);
  margin-bottom: var(--space-molecule);
  
  label {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: var(--space-quantum);
    font-weight: 500;
  }
  
  select, button {
    padding: var(--space-atom) var(--space-molecule);
    background: var(--color-glass-panel);
    backdrop-filter: var(--glass-blur-medium);
    border: 1px solid var(--color-glass-border);
    border-radius: var(--radius-small);
    color: var(--color-text-primary);
    font-family: var(--font-mono);
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:hover {
      background: var(--color-glass-surface);
      border-color: var(--color-text-accent);
      box-shadow: var(--glass-shadow-depth);
      transform: translateY(-1px);
    }
  }
`;

const MainGrid = styled.div`
  position: relative;
  z-index: 5;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr));
  gap: clamp(16px, 4vw, 32px);
  padding: clamp(16px, 4vw, 32px);
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 16px;
  }
`;

const WelcomePanel = styled(NeomorphicSurface)`
  grid-column: 1 / -1;
  padding: clamp(20px, 5vw, 32px);
  text-align: center;
  margin-bottom: clamp(20px, 4vw, 32px);
`;

const WelcomeTitle = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(1.1rem, 2.2vw, 1.75rem);
  font-weight: 400;
  color: var(--color-text-primary);
  margin: 0 0 16px 0;
  line-height: 1.3;
  letter-spacing: 0.03em;
`;

const WelcomeText = styled.p`
  font-family: var(--font-primary);
  font-size: clamp(0.85rem, 1.8vw, 1rem);
  color: var(--color-text-secondary);
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
`;

const FeatureShowcase = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-molecule);
  margin-top: var(--space-solar);
`;

const FeatureCard = styled(NeomorphicSurface)`
  padding: var(--space-molecule);
  text-align: center;
  
  .feature-icon {
    color: var(--color-text-accent);
    background: var(--color-glass-panel);
    backdrop-filter: var(--glass-blur-subtle);
    border: 1px solid var(--color-glass-border);
    border-radius: 8px;
    padding: 12px;
    margin-bottom: var(--space-molecule);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:hover {
      transform: scale(1.05);
      background: var(--color-glass-surface);
      box-shadow: var(--glass-shadow-depth);
    }
  }
  
  .feature-title {
    font-family: var(--font-display);
    font-size: 1.1rem;
    font-weight: 400;
    color: var(--color-text-primary);
    margin-bottom: var(--space-atom);
    letter-spacing: 0.02em;
  }
  
  .feature-description {
    font-family: var(--font-primary);
    font-size: 0.9rem;
    color: var(--color-text-secondary);
    line-height: 1.5;
  }
`;

const TerminalStatusBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 36px;
  background: var(--color-glass-base);
  backdrop-filter: var(--glass-blur-strong);
  border-top: 1px solid var(--color-glass-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-molecule);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-text-muted);
  z-index: 1000;
  
  /* Glass reflection effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(255, 255, 255, 0.15) 50%, 
      transparent 100%);
  }
`;

const StatusSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-molecule);
  
  .status-item {
    display: flex;
    align-items: center;
    gap: var(--space-quantum);
    
    .status-label {
      color: var(--color-text-muted);
    }
    
    .status-value {
      color: var(--color-text-accent);
      font-weight: 600;
    }
  }
`;

const LOKI2032Demo: React.FC = () => {
  const { currentTheme, setTheme } = useTheme();
  const [showControls, setShowControls] = useState(true);
  const [performanceMode, setPerformanceMode] = useState<'ultra' | 'high' | 'balanced'>('high');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  const demoMarkets = [
    {
      title: "BTC/USD > $100K by Q4 2024",
      price: 67.50,
      change: 12.5,
      aiConfidence: 0.87,
      volume: 12500000
    },
    {
      title: "TSLA Q4 Earnings Beat Est.",
      price: 45.20,
      change: -3.2,
      aiConfidence: 0.72,
      volume: 8900000
    },
    {
      title: "Fed Rate Cut March 2025",
      price: 78.90,
      change: 8.7,
      aiConfidence: 0.94,
      volume: 21000000
    }
  ];

  const features = [
    {
      icon: <AnalyticsIcon size={20} />,
      title: 'Advanced Analytics',
      description: 'Institutional-grade data processing with real-time market intelligence'
    },
    {
      icon: <MachineLearningIcon size={20} />,
      title: 'Machine Learning',
      description: 'Quantitative models with confidence intervals and risk assessment'
    },
    {
      icon: <ExecutionIcon size={20} />,
      title: 'Smart Execution',
      description: 'Algorithmic order routing with optimal execution strategies'
    },
    {
      icon: <RiskIcon size={20} />,
      title: 'Risk Management',
      description: 'Real-time position monitoring with dynamic hedging protocols'
    },
    {
      icon: <LatencyIcon size={20} />,
      title: 'Ultra-Low Latency',
      description: 'Sub-millisecond execution with direct market access infrastructure'
    },
    {
      icon: <GlobalIcon size={20} />,
      title: 'Global Markets',
      description: 'Multi-asset class coverage across international exchanges'
    }
  ];

  // Handle client-side hydration for time display
  useEffect(() => {
    setIsClient(true);
    const updateTime = () => {
      setCurrentTime(new Date().toISOString().slice(11, 19));
    };
    
    updateTime(); // Set initial time
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <DemoContainer>
      {/* Control Panel */}
      <AnimatePresence>
        {showControls && (
          <ControlPanel
            depth="deep"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
          >
            <ControlGroup>
              <label>Theme</label>
              <select 
                value={currentTheme} 
                onChange={(e) => setTheme(e.target.value as any)}
              >
                <option value="space-maritime">Space Maritime</option>
                <option value="cosmic-ice">Cosmic Ice</option>
                <option value="void-black">Void Black</option>
                <option value="quantum-glow">Quantum Glow</option>
              </select>
            </ControlGroup>

            <ControlGroup>
              <label>Performance</label>
              <select 
                value={performanceMode} 
                onChange={(e) => setPerformanceMode(e.target.value as any)}
              >
                <option value="ultra">Ultra Quality</option>
                <option value="high">High Quality</option>
                <option value="balanced">Balanced</option>
              </select>
            </ControlGroup>

            <button 
              onClick={() => setShowControls(false)}
              style={{ marginTop: 'var(--space-molecule)' }}
            >
              Hide Controls
            </button>
          </ControlPanel>
        )}
      </AnimatePresence>

      {!showControls && (
        <motion.button
          onClick={() => setShowControls(true)}
          style={{
            position: 'fixed',
            top: 'var(--space-molecule)',
            right: 'var(--space-molecule)',
            zIndex: 100,
            background: 'var(--color-glass-accent)',
            backdropFilter: 'var(--glass-blur-medium)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-glass-border)',
            borderRadius: 'var(--radius-medium)',
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: '600',
            letterSpacing: '0.1em',
            boxShadow: 'var(--glass-shadow-depth)'
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          CTRL
        </motion.button>
      )}

      {/* Header */}
      <Header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Logo>
          <LokiConstellation size={80} />
          <div>
            <Title>LOKI 2032</Title>
            <Subtitle>Institutional Trading Platform</Subtitle>
          </div>
        </Logo>
      </Header>

      {/* Main Content */}
      <MainGrid>
        {/* Welcome Panel */}
        <WelcomePanel
          depth="deep"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <WelcomeTitle>LOKI 2032 Trading Platform</WelcomeTitle>
          <WelcomeText>
            Institutional-grade prediction markets with quantitative analytics, 
            machine learning insights, and real-time execution infrastructure. 
            Professional trading tools designed for institutional capital deployment.
          </WelcomeText>
        </WelcomePanel>

        {/* Market Cards */}
        {demoMarkets.map((market, index) => (
          <motion.div
            key={market.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 + index * 0.2 }}
          >
            <MarketCard {...market} />
          </motion.div>
        ))}

        {/* Feature Showcase */}
        <FeatureShowcase>
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
            >
              <FeatureCard depth="medium" interactive>
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </FeatureCard>
            </motion.div>
          ))}
        </FeatureShowcase>
      </MainGrid>

      {/* Bloomberg Terminal-inspired Status Bar */}
      <TerminalStatusBar>
        <StatusSection>
          <div className="status-item">
            <span className="status-label">SYS:</span>
            <span className="status-value">ONLINE</span>
          </div>
          <div className="status-item">
            <span className="status-label">LATENCY:</span>
            <span className="status-value">0.34ms</span>
          </div>
          <div className="status-item">
            <span className="status-label">CONN:</span>
            <span className="status-value">NYSE/NASDAQ</span>
          </div>
        </StatusSection>

        <RealTimeTicker />

        <StatusSection>
          <div className="status-item">
            <span className="status-label">P&L:</span>
            <span className="status-value">+$127.4K</span>
          </div>
          <div className="status-item">
            <span className="status-label">UTC:</span>
            <span className="status-value">{isClient ? currentTime : '--:--:--'}</span>
          </div>
        </StatusSection>
      </TerminalStatusBar>

      {/* Gemini-powered Agent Bot */}
      <GeminiAgent />
    </DemoContainer>
  );
};

export default LOKI2032Demo;