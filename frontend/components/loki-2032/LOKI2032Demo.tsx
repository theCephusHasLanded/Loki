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
import { useAuth } from '../../contexts/AuthContext';
import GeminiAgent from '../chat/GeminiAgent';
import SideModal from '../modals/SideModal';
import AnalyticsModal from '../modals/AnalyticsModal';
import TradingModal from '../modals/TradingModal';
import GuideModal from '../modals/GuideModal';
import CalendlyModal from '../modals/CalendlyModal';
import PlatformFeaturesModal from '../modals/PlatformFeaturesModal';

// Demo container with revolutionary styling
const DemoContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  color: var(--color-text-primary);
  overflow: hidden;
  
  /* Cryptic financial blockchain constellation */
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      /* Primary crypto trading network */
      url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1920&q=80&auto=format&fit=crop'),
      /* Tokenized data visualization */
      url('https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1920&q=40&auto=format&fit=crop'),
      /* Base gradient foundation */
      linear-gradient(135deg, var(--color-glass-base) 0%, var(--color-glass-surface) 100%);
    background-size: cover, cover, cover;
    background-position: center, center top, center;
    background-blend-mode: overlay, multiply, normal;
    backdrop-filter: var(--glass-blur-subtle);
    z-index: -2;
    pointer-events: none;
    animation: blockchain-constellation 50s ease-in-out infinite;
  }
  
  @keyframes blockchain-constellation {
    0%, 100% { 
      background-position: center, center top, center;
      opacity: 0.8;
    }
    33% { 
      background-position: center, center, center;
      opacity: 0.9;
    }
    66% { 
      background-position: center, center bottom, center;
      opacity: 1;
    }
  }
  
  /* Tokenized network overlay with hexagonal patterns */
  &::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      /* Crypto verification nodes */
      radial-gradient(ellipse at 20% 30%, rgba(0, 255, 150, 0.08) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 70%, rgba(0, 150, 255, 0.08) 0%, transparent 50%),
      /* Hexagonal blockchain pattern */
      radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.02) 0%, transparent 30%),
      /* Trading algorithm grid */
      linear-gradient(45deg, transparent 48%, rgba(0, 255, 150, 0.01) 50%, transparent 52%),
      linear-gradient(-45deg, transparent 48%, rgba(0, 150, 255, 0.01) 50%, transparent 52%);
    backdrop-filter: var(--glass-blur-subtle);
    z-index: -1;
    pointer-events: none;
    animation: crypto-network-flow 35s linear infinite;
  }
  
  @keyframes crypto-network-flow {
    0% { transform: rotate(0deg) scale(1); }
    100% { transform: rotate(360deg) scale(1.02); }
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
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.1;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  font-variant-numeric: tabular-nums;
`;

const Subtitle = styled.p`
  font-family: var(--font-mono);
  font-size: clamp(0.75rem, 1.5vw, 1rem);
  font-weight: 400;
  color: var(--color-text-secondary);
  margin: 8px 0 0 0;
  line-height: 1.2;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-variant-numeric: tabular-nums;
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
    font-size: 0.7rem;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.2em;
    margin-bottom: var(--space-quantum);
    font-weight: 400;
    font-variant-numeric: tabular-nums;
  }
  
  select, button {
    padding: var(--space-atom) var(--space-molecule);
    background: var(--color-glass-panel);
    backdrop-filter: var(--glass-blur-medium);
    border: 1px solid var(--color-glass-border);
    border-radius: var(--radius-small);
    color: var(--color-text-primary);
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 400;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-variant-numeric: tabular-nums;
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
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 4vw, 32px);
  padding: clamp(16px, 4vw, 32px);
  max-width: 1400px;
  margin: 0 auto;
`;

const MarketGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
  gap: clamp(12px, 3vw, 20px);
  margin-bottom: clamp(20px, 4vw, 32px);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const WelcomePanel = styled(NeomorphicSurface)`
  grid-column: 1 / -1;
  padding: clamp(20px, 5vw, 32px);
  text-align: center;
  margin-bottom: clamp(20px, 4vw, 32px);
  position: relative;
  overflow: hidden;
  
  /* Cryptic institutional trading intelligence */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      /* Base layer */
      linear-gradient(var(--color-glass-base), var(--color-glass-base)),
      /* Advanced trading algorithms */
      url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80&auto=format&fit=crop'),
      /* Blockchain verification network */
      url('https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1200&q=50&auto=format&fit=crop');
    background-size: cover, cover, cover;
    background-position: center, center, center bottom;
    background-blend-mode: normal, overlay, multiply;
    z-index: 0;
    animation: institutional-intelligence 30s ease-in-out infinite;
  }
  
  /* Tokenized welcome verification */
  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, 
      rgba(0, 255, 150, 0.1) 0%, 
      transparent 25%, 
      transparent 50%, 
      rgba(0, 150, 255, 0.05) 75%, 
      transparent 100%);
    border-radius: inherit;
    z-index: -1;
    animation: welcome-token-verification 15s linear infinite;
  }
  
  @keyframes institutional-intelligence {
    0%, 100% { background-position: center, center, center bottom; }
    50% { background-position: center, center top, center; }
  }
  
  @keyframes welcome-token-verification {
    0% { opacity: 0.3; transform: rotate(0deg); }
    50% { opacity: 0.8; transform: rotate(180deg); }
    100% { opacity: 0.3; transform: rotate(360deg); }
  }
  
  /* Content overlay */
  & > * {
    position: relative;
    z-index: 2;
  }
`;

const WelcomeTitle = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(1.1rem, 2.2vw, 1.75rem);
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0 0 16px 0;
  line-height: 1.2;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-variant-numeric: tabular-nums;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
`;

const WelcomeText = styled.p`
  font-family: var(--font-primary);
  font-size: clamp(0.85rem, 1.8vw, 1rem);
  font-weight: 400;
  color: var(--color-text-secondary);
  line-height: 1.5;
  max-width: 800px;
  margin: 0 auto;
  letter-spacing: 0.08em;
  font-variant-numeric: tabular-nums;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
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
  position: relative;
  overflow: hidden;
  
  /* Cryptic tokenized backgrounds for each feature */
  &:nth-child(1) {
    background-image: 
      linear-gradient(var(--color-glass-base), var(--color-glass-base)),
      /* Advanced Analytics - Data visualization */
      url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&q=80&auto=format&fit=crop'),
      url('https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&q=40&auto=format&fit=crop');
    background-size: cover, cover, cover;
    background-position: center, center, center bottom;
    background-blend-mode: normal, overlay, multiply;
    animation: analytics-crypto-flow 20s ease-in-out infinite;
  }
  
  &:nth-child(2) {
    background-image: 
      linear-gradient(var(--color-glass-base), var(--color-glass-base)),
      /* Machine Learning - Blockchain algorithms */
      url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80&auto=format&fit=crop'),
      url('https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&q=50&auto=format&fit=crop');
    background-size: cover, cover, cover;
    background-position: center, center, center top;
    background-blend-mode: normal, overlay, soft-light;
    animation: ml-token-pulse 18s ease-in-out infinite;
  }
  
  &:nth-child(3) {
    background-image: 
      linear-gradient(var(--color-glass-base), var(--color-glass-base)),
      /* Smart Execution - Trading networks */
      url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&q=80&auto=format&fit=crop'),
      url('https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&q=60&auto=format&fit=crop');
    background-size: cover, cover, cover;
    background-position: center, center, center;
    background-blend-mode: normal, overlay, multiply;
    animation: execution-crypto-sweep 16s ease-in-out infinite;
  }
  
  &:nth-child(4) {
    background-image: 
      linear-gradient(var(--color-glass-base), var(--color-glass-base)),
      /* Risk Management - Security protocols */
      url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80&auto=format&fit=crop'),
      url('https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&q=45&auto=format&fit=crop');
    background-size: cover, cover, cover;
    background-position: center, center bottom, center;
    background-blend-mode: normal, overlay, multiply;
    animation: risk-token-guard 22s ease-in-out infinite;
  }
  
  &:nth-child(5) {
    background-image: 
      linear-gradient(var(--color-glass-base), var(--color-glass-base)),
      /* Ultra-Low Latency - Speed networks */
      url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&q=80&auto=format&fit=crop'),
      url('https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&q=55&auto=format&fit=crop');
    background-size: cover, cover, cover;
    background-position: center, center top, center;
    background-blend-mode: normal, overlay, multiply;
    animation: latency-crypto-speed 14s ease-in-out infinite;
  }
  
  &:nth-child(6) {
    background-image: 
      linear-gradient(var(--color-glass-base), var(--color-glass-base)),
      /* Global Markets - Worldwide blockchain */
      url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80&auto=format&fit=crop'),
      url('https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&q=35&auto=format&fit=crop');
    background-size: cover, cover, cover;
    background-position: center, center, center bottom;
    background-blend-mode: normal, overlay, soft-light;
    animation: global-token-network 25s ease-in-out infinite;
  }
  
  @keyframes analytics-crypto-flow {
    0%, 100% { background-position: center, center, center bottom; }
    50% { background-position: center, center top, center; }
  }
  
  @keyframes ml-token-pulse {
    0%, 100% { opacity: 0.9; background-position: center, center, center top; }
    50% { opacity: 1; background-position: center, center bottom, center; }
  }
  
  @keyframes execution-crypto-sweep {
    0%, 100% { background-position: center, center, center; }
    50% { background-position: center, center top, center bottom; }
  }
  
  @keyframes risk-token-guard {
    0%, 100% { background-position: center, center bottom, center; }
    50% { background-position: center, center, center top; }
  }
  
  @keyframes latency-crypto-speed {
    0%, 100% { background-position: center, center top, center; }
    50% { background-position: center, center bottom, center; }
  }
  
  @keyframes global-token-network {
    0%, 100% { background-position: center, center, center bottom; }
    50% { background-position: center, center top, center; }
  }
  
  .feature-icon {
    color: var(--color-text-accent);
    margin-bottom: var(--space-molecule);
    display: inline-flex;
    align-items: center;
    justify-content: center;

    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    z-index: 2;
    
    &:hover {
      transform: scale(1.1);
      color: #00d4ff;
      filter: drop-shadow(0 0 8px rgba(0, 212, 255, 0.5));
    }
  }
  
  .feature-title {
    font-family: var(--font-display);
    font-size: 1.0rem;
    font-weight: 500;
    color: var(--color-text-primary);
    margin-bottom: var(--space-atom);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-variant-numeric: tabular-nums;
    position: relative;
    z-index: 2;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  }
  
  .feature-description {
    font-family: var(--font-primary);
    font-size: 0.85rem;
    font-weight: 400;
    color: var(--color-text-secondary);
    line-height: 1.4;
    letter-spacing: 0.06em;
    font-variant-numeric: tabular-nums;
    position: relative;
    z-index: 2;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
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
  font-size: 0.7rem;
  font-weight: 400;
  color: var(--color-text-muted);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  font-variant-numeric: tabular-nums;
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
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }
  }
`;

const AIAgentContainer = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  
  /* AI agent positioned relative to page content */
  & > * {
    position: absolute;
    bottom: 100px;
    right: 20px;
  }
`;

const LOKI2032Demo: React.FC = () => {
  const { currentTheme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const [showControls, setShowControls] = useState(true);
  const [performanceMode, setPerformanceMode] = useState<'ultra' | 'high' | 'balanced'>('high');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  
  // Modal states
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showTrading, setShowTrading] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState<{ isOpen: boolean; content: string }>({ isOpen: false, content: '' });
  const [showCalendlyModal, setShowCalendlyModal] = useState(false);
  const [showPlatformFeatures, setShowPlatformFeatures] = useState(false);

  const demoMarkets = [
    {
      title: "BTC/USD > $100K by Q4 2025",
      price: 87.50,
      change: 12.5,
      aiConfidence: 0.87,
      volume: 12500000
    },
    {
      title: "TSLA Q1 2025 Earnings Beat Est.",
      price: 68.20,
      change: 8.7,
      aiConfidence: 0.72,
      volume: 8900000
    },
    {
      title: "Fed Rate Cut March 2025",
      price: 78.90,
      change: 8.7,
      aiConfidence: 0.94,
      volume: 21000000
    },
    {
      title: "NVDA Stock Split Q1 2025",
      price: 89.35,
      change: 18.2,
      aiConfidence: 0.79,
      volume: 34500000
    },
    {
      title: "Apple Vision Pro Sales Target",
      price: 34.60,
      change: -7.3,
      aiConfidence: 0.61,
      volume: 18200000
    },
    {
      title: "ETH 2.0 Staking Rewards > 6%",
      price: 91.20,
      change: 22.4,
      aiConfidence: 0.88,
      volume: 28700000
    },
    {
      title: "SPY ATH Before EOY 2024",
      price: 73.15,
      change: 9.2,
      aiConfidence: 0.83,
      volume: 45600000
    },
    {
      title: "Oil Prices Breach $100/barrel",
      price: 42.80,
      change: -12.6,
      aiConfidence: 0.68,
      volume: 15300000
    },
    {
      title: "Meta VR Headset Market Share",
      price: 56.90,
      change: 5.4,
      aiConfidence: 0.75,
      volume: 22100000
    },
    {
      title: "Google AI Breakthrough Event",
      price: 89.45,
      change: 18.7,
      aiConfidence: 0.92,
      volume: 31800000
    },
    {
      title: "China GDP Growth > 5.5%",
      price: 28.30,
      change: -15.2,
      aiConfidence: 0.58,
      volume: 19500000
    },
    {
      title: "Tesla Cybertruck Production Target",
      price: 64.70,
      change: 11.3,
      aiConfidence: 0.77,
      volume: 26900000
    }
  ];

  const features = [
    {
      icon: (
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M12 2L2 7L12 12L22 7L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17L12 22L22 17" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="1" fill="currentColor"/>
        </svg>
      ),
      title: 'Creating Your First Cosmic Trade',
      description: 'Learn to place intelligent trades using astrological timing and market analysis',
      splash: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(147, 51, 234, 0.1))'
    },
    {
      icon: (
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1V12L6 18" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 16L12 12L18 6" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="10" strokeDasharray="2 2"/>
        </svg>
      ),
      title: 'IBM Watson AI Cosmic Analysis',
      description: 'Harness AI-powered astrological insights for advanced trading strategies',
      splash: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(168, 85, 247, 0.1))'
    },
    {
      icon: (
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="8" cy="10" r="1" fill="currentColor"/>
          <circle cx="16" cy="10" r="1" fill="currentColor"/>
          <circle cx="12" cy="14" r="1" fill="currentColor"/>
          <path d="M12 2L12 22" strokeDasharray="1 1" opacity="0.5"/>
        </svg>
      ),
      title: 'Reading Cosmic Market Patterns',
      description: 'Master the art of astrological pattern recognition in financial markets',
      splash: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(139, 92, 246, 0.1))'
    },
    {
      icon: (
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12H22" strokeLinecap="round"/>
          <path d="M12 2V22" strokeLinecap="round"/>
          <circle cx="6" cy="8" r="1" fill="currentColor"/>
          <circle cx="18" cy="8" r="1" fill="currentColor"/>
          <circle cx="6" cy="16" r="1" fill="currentColor"/>
          <circle cx="18" cy="16" r="1" fill="currentColor"/>
        </svg>
      ),
      title: 'World Events & Cosmic Correlations',
      description: 'Connect global happenings with astrological cycles for predictive trading',
      splash: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.1))'
    },
    {
      icon: (
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M12 2L15 9L22 9L17 14L20 21L12 17L4 21L7 14L2 9L9 9L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="3" strokeDasharray="1 1" opacity="0.5"/>
        </svg>
      ),
      title: 'Advanced Cosmic Trading Strategies',
      description: 'Professional-level techniques combining technical analysis with astrological timing',
      splash: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(109, 40, 217, 0.1))'
    },
    {
      icon: (
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="12" cy="12" r="8"/>
          <path d="M8 12L12 8L16 12L12 16L8 12Z" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="5" r="1" fill="currentColor"/>
          <circle cx="19" cy="12" r="1" fill="currentColor"/>
          <circle cx="12" cy="19" r="1" fill="currentColor"/>
          <circle cx="5" cy="12" r="1" fill="currentColor"/>
        </svg>
      ),
      title: 'Cosmic Risk Management',
      description: 'Protect your capital using astrological risk assessment and position sizing',
      splash: 'linear-gradient(135deg, rgba(109, 40, 217, 0.1), rgba(91, 33, 182, 0.1))'
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
      {/* Book Chat Button - Right Side (Circular) */}
      <motion.button
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        onClick={() => setShowCalendlyModal(true)}
        style={{
          position: 'fixed',
          right: '20px',
          bottom: '100px',
          zIndex: 999999,
          width: '70px',
          height: '70px',
          background: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
          border: '2px solid #ffffff',
          borderRadius: '50%',
          color: '#0a0f1c',
          fontFamily: 'JetBrains Mono, monospace',
          fontWeight: 'bold',
          fontSize: '0.7rem',
          cursor: 'pointer',
          backdropFilter: 'blur(20px) saturate(180%)',
          boxShadow: '0 8px 32px rgba(0, 212, 255, 0.8), 0 0 0 4px rgba(255, 255, 255, 0.5), 0 4px 20px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          pointerEvents: 'auto',
          isolation: 'isolate',
          transform: 'translateZ(0)',
          willChange: 'transform'
        }}
        whileHover={{ 
          scale: 1.05,
          x: -5,
          y: -2,
          boxShadow: '0 12px 48px rgba(0, 212, 255, 0.5)',
          filter: 'brightness(1.1)'
        }}
        animate={{ 
          y: [0, -2, 0],
          x: [0, -1, 0],
          boxShadow: [
            '0 8px 32px rgba(0, 212, 255, 0.3)',
            '0 10px 36px rgba(0, 212, 255, 0.4)',
            '0 8px 32px rgba(0, 212, 255, 0.3)'
          ]
        }}
        transition={{ 
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        whileTap={{ scale: 0.95 }}
      >
        BOOK
      </motion.button>

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
              <label style={{ textShadow: '0 0 8px var(--color-text-accent)' }}>Theme</label>
              <select 
                value={currentTheme} 
                onChange={(e) => setTheme(e.target.value as any)}
                style={{ textShadow: '0 0 8px var(--color-text-accent)' }}
              >
                <option value="space-maritime">Space Maritime</option>
                <option value="cosmic-ice">Cosmic Ice</option>
                <option value="void-black">Void Black</option>
                <option value="quantum-glow">Quantum Glow</option>
                <option value="pure-monochrome">Pure Monochrome</option>
                <option value="nebula-purple">Nebula Purple</option>
                <option value="solar-flare">Solar Flare</option>
                <option value="deep-space">Deep Space</option>
              </select>
            </ControlGroup>

            <ControlGroup>
              <label style={{ textShadow: '0 0 8px var(--color-text-accent)' }}>Performance</label>
              <select 
                value={performanceMode} 
                onChange={(e) => setPerformanceMode(e.target.value as any)}
                style={{ textShadow: '0 0 8px var(--color-text-accent)' }}
              >
                <option value="ultra">Ultra Quality</option>
                <option value="high">High Quality</option>
                <option value="balanced">Balanced</option>
              </select>
            </ControlGroup>

            <button 
              onClick={() => setShowControls(false)}
              style={{ 
                marginTop: 'var(--space-molecule)',
                textShadow: '0 0 10px var(--color-text-accent), 0 0 20px var(--color-text-accent), 0 0 30px var(--color-text-accent)'
              }}
            >
              Hide Controls
            </button>

            <ControlGroup>
              <label style={{ textShadow: '0 0 8px var(--color-text-accent)' }}>LKHN Technologies Platform</label>
              <button 
                onClick={() => setShowPlatformFeatures(true)}
                style={{ textShadow: '0 0 10px var(--color-text-accent), 0 0 20px var(--color-text-accent)' }}
              >
                Platform Features
              </button>
              <button 
                onClick={() => setShowAnalytics(true)}
                style={{ textShadow: '0 0 10px var(--color-text-accent), 0 0 20px var(--color-text-accent)' }}
              >
                Analytics
              </button>
              <button 
                onClick={() => setShowTrading(true)}
                style={{ textShadow: '0 0 10px var(--color-text-accent), 0 0 20px var(--color-text-accent)' }}
              >
                Trading
              </button>
            </ControlGroup>
            
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem',
              background: 'var(--color-glass-accent)',
              border: '1px solid var(--color-glass-border)',
              borderRadius: '8px',
              fontSize: '0.7rem',
              color: 'var(--color-text-secondary)',
              textAlign: 'center'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.5rem',
                marginBottom: '0.25rem'
              }}>
                <svg width="16" height="16" viewBox="0 0 100 100" fill="currentColor" style={{ 
                  color: 'var(--color-text-accent)',
                  filter: 'drop-shadow(0 0 8px var(--color-text-accent))'
                }}>
                  <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" stroke="currentColor" strokeWidth="3" fill="none"/>
                  <path d="M30,30 L70,70 M70,30 L30,70 M50,15 L50,85 M15,50 L85,50" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="25" cy="25" r="2" fill="currentColor"/>
                  <circle cx="75" cy="25" r="2" fill="currentColor"/>
                  <circle cx="75" cy="75" r="2" fill="currentColor"/>
                  <circle cx="25" cy="75" r="2" fill="currentColor"/>
                </svg>
                <span 
                  style={{ 
                    color: 'var(--color-text-accent)', 
                    fontWeight: 'bold',
                    textShadow: '0 0 10px var(--color-text-accent)',
                    cursor: 'pointer'
                  }}
                  onClick={() => window.open('https://lkhntech.com', '_blank')}
                >LKHN Technologies</span>
              </div>
              <div style={{ textShadow: '0 0 6px var(--color-text-accent)' }}>Powered by Cosmic Intelligence</div>
            </div>
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
        
        {/* Auth Status */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem',
          fontSize: '0.9rem',
          color: user?.isLoggedIn ? '#00ff88' : '#8892b0'
        }}>
          {user?.isLoggedIn ? (
            <>
              <span>USER: {user.email || user.walletAddress}</span>
              <button 
                onClick={logout}
                style={{
                  background: 'rgba(255, 80, 80, 0.2)',
                  border: '1px solid rgba(255, 80, 80, 0.3)',
                  color: '#ff5050',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <span>AUTH: Not Connected</span>
          )}
        </div>
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

        {/* Market Cards Grid */}
        <MarketGrid>
          {demoMarkets.map((market, index) => (
            <motion.div
              key={market.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
            >
              <MarketCard {...market} />
            </motion.div>
          ))}
        </MarketGrid>

        {/* Trading Guide & Cosmic Intelligence Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          style={{ 
            marginBottom: '2rem',
            textAlign: 'center'
          }}
        >
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: '#00d4ff',
            marginBottom: '1rem',
            textShadow: '0 0 20px rgba(0, 212, 255, 0.3)'
          }}>
            Trading Guide & Cosmic Intelligence
          </h2>
          <p style={{ 
            fontSize: '1.1rem', 
            color: '#8892b0',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Master the art of astrological prediction trading with IBM Watson AI. Learn to combine cosmic timing with world events for unparalleled market insights.
          </p>
        </motion.div>

        {/* Feature Showcase */}
        <FeatureShowcase>
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
            >
              <FeatureCard 
                depth="medium" 
                interactive
                onClick={() => setShowGuideModal({ isOpen: true, content: feature.title })}
                style={{ 
                  cursor: 'pointer',
                  background: feature.splash,
                  border: '1px solid rgba(0, 212, 255, 0.2)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: feature.splash,
                  opacity: 0.5,
                  zIndex: 0
                }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div className="feature-icon">{feature.icon}</div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
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
      <AIAgentContainer>
        <GeminiAgent />
      </AIAgentContainer>

      {/* Side-sliding Modals */}
      <SideModal
        isOpen={showAnalytics}
        onClose={() => setShowAnalytics(false)}
        position="left"
        size="large"
        title="Analytics Dashboard"
      >
        <AnalyticsModal />
      </SideModal>

      <SideModal
        isOpen={showTrading}
        onClose={() => setShowTrading(false)}
        position="right"
        size="large"
        title="Trading Interface"
      >
        <TradingModal />
      </SideModal>

      <SideModal
        isOpen={showGuideModal.isOpen}
        onClose={() => setShowGuideModal({ isOpen: false, content: '' })}
        position="top"
        size="large"
        title=""
      >
        <GuideModal 
          content={showGuideModal.content} 
          onClose={() => setShowGuideModal({ isOpen: false, content: '' })}
        />
      </SideModal>

      <SideModal
        isOpen={showCalendlyModal}
        onClose={() => setShowCalendlyModal(false)}
        position="top"
        size="large"
        title=""
      >
        <CalendlyModal onClose={() => setShowCalendlyModal(false)} />
      </SideModal>

      <SideModal
        isOpen={showPlatformFeatures}
        onClose={() => setShowPlatformFeatures(false)}
        position="center"
        size="large"
        title=""
      >
        <PlatformFeaturesModal onClose={() => setShowPlatformFeatures(false)} />
      </SideModal>
    </DemoContainer>
  );
};

export default LOKI2032Demo;