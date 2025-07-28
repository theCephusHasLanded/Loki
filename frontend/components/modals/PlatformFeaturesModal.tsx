'use client';

import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';

const ModalContent = styled.div`
  padding: 2rem;
  color: var(--color-text-primary);
  background: var(--color-glass-surface);
  border-radius: 16px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 212, 255, 0.2);
  max-height: 80vh;
  overflow-y: auto;
  position: relative;

  h2 {
    color: #00d4ff;
    font-size: 2rem;
    margin-bottom: 1rem;
    text-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .subtitle {
    text-align: center;
    color: #8892b0;
    font-size: 1.1rem;
    margin-bottom: 2rem;
    line-height: 1.4;
  }

  .lkhn-branding {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 1rem;
    background: rgba(0, 212, 255, 0.05);
    border-radius: 12px;
    border: 1px solid rgba(0, 212, 255, 0.1);
    
    .logo {
      width: 40px;
      height: 40px;
      color: #00d4ff;
    }
    
    .brand-text {
      font-size: 1.2rem;
      font-weight: 600;
      color: #00d4ff;
      letter-spacing: 0.1em;
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #00d4ff;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(0, 212, 255, 0.1);
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin: 2rem 0;
`;

const FeatureCard = styled.div`
  background: rgba(0, 212, 255, 0.05);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    background: rgba(0, 212, 255, 0.1);
    border-color: rgba(0, 212, 255, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 212, 255, 0.2);
  }

  .feature-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;

    .icon {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #9333ea, #7c3aed);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }

    .content {
      flex: 1;

      .title {
        font-size: 1rem;
        font-weight: 600;
        color: #ffffff;
        margin-bottom: 0.25rem;
      }

      .description {
        font-size: 0.8rem;
        color: #8892b0;
        line-height: 1.3;
      }
    }

    .percentage {
      font-size: 0.9rem;
      font-weight: 600;
      color: #00d4ff;
      margin-right: 0.5rem;
    }

    .arrow {
      color: #8892b0;
      font-size: 1rem;
      transition: transform 0.3s ease;
    }
  }

  &:hover .arrow {
    transform: translateX(2px);
  }
`;

const ExpandedContent = styled(motion.div)`
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  border-left: 4px solid #9333ea;

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.75rem;
    margin: 1rem 0;
  }

  .metric-card {
    background: rgba(0, 212, 255, 0.05);
    border: 1px solid rgba(0, 212, 255, 0.2);
    border-radius: 6px;
    padding: 0.75rem;
    text-align: center;

    .value {
      font-size: 1.2rem;
      font-weight: bold;
      color: #00d4ff;
      margin-bottom: 0.25rem;
    }

    .label {
      font-size: 0.75rem;
      color: #8892b0;
    }
  }

  .feature-list {
    list-style: none;
    padding: 0;
    margin: 1rem 0;

    li {
      padding: 0.375rem 0;
      border-bottom: 1px solid rgba(0, 212, 255, 0.1);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;

      &:before {
        content: '✓';
        color: #00ff41;
        font-weight: bold;
        font-size: 0.8rem;
      }
    }
  }

  .integration-demo {
    background: rgba(0, 212, 255, 0.03);
    border: 1px solid rgba(0, 212, 255, 0.1);
    border-radius: 6px;
    padding: 0.75rem;
    margin: 1rem 0;
    font-family: monospace;
    font-size: 0.8rem;

    .demo-header {
      color: #00ff41;
      margin-bottom: 0.5rem;
      font-size: 0.75rem;
    }

    .demo-code {
      color: #8892b0;
      white-space: pre-line;
      line-height: 1.4;
    }
  }
`;

interface PlatformFeaturesModalProps {
  onClose: () => void;
}

const PlatformFeaturesModal: React.FC<PlatformFeaturesModalProps> = ({ onClose }) => {
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  const features = [
    {
      id: 'astrological-profiling',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1V12L6 18"/>
          <path d="M21 16L12 12L18 6"/>
          <circle cx="12" cy="12" r="10" strokeDasharray="2 2"/>
        </svg>
      ),
      title: 'Astrological Market Profiling',
      description: 'AI-powered cosmic personality trading that adapts to your astrological DNA',
      percentage: '85%',
      content: {
        overview: 'Revolutionary birth chart analysis combined with market behavior patterns to create personalized trading strategies.',
        metrics: [
          { value: '12,847', label: 'Birth Charts Analyzed' },
          { value: '94.3%', label: 'Accuracy Rate' },
          { value: '€2.4M', label: 'Managed Capital' },
          { value: '847', label: 'Active Profiles' }
        ],
        features: [
          'Real-time natal chart integration',
          'Planetary transit impact scoring',
          'Personalized risk tolerance based on elemental balance',
          'Daily cosmic market timing alerts',
          'Compatibility analysis with market sectors'
        ],
        demo: {
          header: 'Live Profile Analysis:',
          code: `User: Leo Sun, Scorpio Moon, Virgo Rising
Mars Transit: +15% tech sector affinity
Current Score: 87/100 for growth positions
Optimal Window: Next 3 hours (Venus trine)`
        }
      }
    },
    {
      id: 'premium-membership',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M12 2L15 9L22 9L17 14L20 21L12 17L4 21L7 14L2 9L9 9L12 2Z"/>
        </svg>
      ),
      title: 'Premium Membership Tiers',
      description: 'Exclusive cosmic insights and priority market access for serious traders',
      percentage: '70%',
      content: {
        overview: 'Multi-tier premium access system with escalating cosmic intelligence features and market privileges.',
        metrics: [
          { value: '3,247', label: 'Premium Members' },
          { value: '€127', label: 'Avg Monthly Revenue' },
          { value: '42%', label: 'Member Retention' },
          { value: '5.7x', label: 'ROI Multiplier' }
        ],
        features: [
          'Cosmic Insider (€29/month) - Basic planetary alerts',
          'Stellar Trader (€79/month) - AI predictions + natal analysis',
          'Galaxy Elite (€197/month) - Priority markets + private signals',
          'Universe Master (€497/month) - 1-on-1 cosmic strategist',
          'Exclusive beta access to new prediction markets'
        ],
        demo: {
          header: 'Membership Benefits Matrix:',
          code: `✓ Basic: Moon phase alerts, market mood indicators
✓ Stellar: Personal AI astrologer, sector recommendations  
✓ Galaxy: Priority betting limits, insider cosmic events
✓ Universe: Private strategist, whale alert system`
        }
      }
    },
    {
      id: 'seamless-banking',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M12 1L3 5V11C3 16 6 20 12 23C18 20 21 16 21 11V5L12 1Z"/>
          <path d="M9 12L11 14L15 10"/>
        </svg>
      ),
      title: 'Seamless Banking & Payments',
      description: 'Instant deposits, withdrawals, and crypto-to-fiat conversion',
      percentage: '60%',
      content: {
        overview: 'Advanced financial infrastructure supporting traditional banking, cryptocurrency, and innovative payment methods.',
        metrics: [
          { value: '€4.7M', label: 'Monthly Volume' },
          { value: '2.3s', label: 'Avg Transaction Time' },
          { value: '99.97%', label: 'Uptime Rate' },
          { value: '0.25%', label: 'Transaction Fee' }
        ],
        features: [
          'Instant SEPA/ACH bank transfers',
          'Cryptocurrency deposits (BTC, ETH, USDC, USDT)',
          'Apple Pay / Google Pay integration',
          'Automatic profit withdrawal scheduling',
          'Multi-currency support (EUR, USD, GBP, CHF)'
        ],
        demo: {
          header: 'Payment Flow Demo:',
          code: `Bank → LOKI (2-3 seconds)
Crypto → LOKI (1 confirmation)
LOKI → Bank (instant settlement)
Withdrawal: €10 minimum, no daily limits`
        }
      }
    },
    {
      id: 'diverse-markets',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12H22"/>
          <path d="M12 2V22"/>
          <circle cx="6" cy="8" r="1" fill="currentColor"/>
          <circle cx="18" cy="8" r="1" fill="currentColor"/>
          <circle cx="6" cy="16" r="1" fill="currentColor"/>
          <circle cx="18" cy="16" r="1" fill="currentColor"/>
        </svg>
      ),
      title: 'Diverse Prediction Markets',
      description: 'From elections to entertainment, sports to crypto - all with cosmic insights',
      percentage: '75%',
      content: {
        overview: 'Comprehensive prediction market ecosystem covering global events with integrated astrological analysis.',
        metrics: [
          { value: '127', label: 'Active Markets' },
          { value: '€890K', label: 'Daily Volume' },
          { value: '23', label: 'Market Categories' },
          { value: '89.4%', label: 'Resolution Rate' }
        ],
        features: [
          'Political elections & referendums with candidate natal charts',
          'Sports outcomes with team astrological compatibility',
          'Cryptocurrency price predictions with planetary cycles',
          'Entertainment awards with celebrity birth chart analysis',
          'Economic indicators with Federal Reserve astrological timing'
        ],
        demo: {
          header: 'Current Hot Markets:',
          code: `🗳️ "Will Trump win 2024?" - Jupiter return analysis
₿ "Bitcoin $150K by Q2 2025?" - Uranus conjunction timing
🏆 "Oscars Best Picture 2025" - Venus transit predictions
📈 "Fed Rate Cut March 2025?" - Mercury retrograde alert`
        }
      }
    },
    {
      id: 'ai-astrologer',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M21 15A2 2 0 0 1 19 17H5A2 2 0 0 1 3 15V9A2 2 0 0 1 5 7H19A2 2 0 0 1 21 9Z"/>
          <polyline points="10,9 9,11 11,11 10,13"/>
          <circle cx="15" cy="11" r="1"/>
        </svg>
      ),
      title: 'Personal AI Astrologer',
      description: 'Your personal cosmic trading advisor powered by GPT-4 and astronomical data',
      percentage: '80%',
      content: {
        overview: 'Advanced AI system combining GPT-4 language processing with real-time astronomical data for personalized trading guidance.',
        metrics: [
          { value: '24/7', label: 'Availability' },
          { value: '847', label: 'Daily Interactions' },
          { value: '4.8/5', label: 'User Rating' },
          { value: '73%', label: 'Prediction Accuracy' }
        ],
        features: [
          'Real-time conversation with cosmic trading insights',
          'Personalized daily market briefings based on your chart',
          'Interactive learning modules for astrological trading',
          'Voice-activated trading commands with cosmic timing',
          'Integration with WhatsApp, Telegram, and Discord'
        ],
        demo: {
          header: 'AI Conversation Example:',
          code: `You: "Should I buy Bitcoin today?"
AI: "Mars square Saturn suggests caution. Your natal Jupiter 
transit peaks Thursday - wait 48 hours for optimal entry. 
Current cosmic confidence: 34/100"`
        }
      }
    },
    {
      id: 'social-trading',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21V19C23 17.1362 21.7252 15.5701 20 15.126"/>
          <path d="M16 3.126C17.7252 3.57006 19 5.13616 19 7C19 8.86384 17.7252 10.4299 16 10.874"/>
        </svg>
      ),
      title: 'Cosmic Social Trading',
      description: 'Follow top astrological traders and copy their cosmic-guided strategies',
      percentage: '55%',
      content: {
        overview: 'Social trading platform where users can follow and automatically copy trades from verified astrological experts.',
        metrics: [
          { value: '147', label: 'Verified Astro-Traders' },
          { value: '2,847', label: 'Copy Trading Users' },
          { value: '€347K', label: 'Copied Volume/Day' },
          { value: '+23.7%', label: 'Avg Follower ROI' }
        ],
        features: [
          'Verified astrologer leaderboards with performance metrics',
          'Automatic copy trading with cosmic risk management',
          'Social feed with real-time trade explanations',
          'Astrologer chat rooms and educational webinars',
          'Commission sharing with top-performing cosmic traders'
        ],
        demo: {
          header: 'Top Astro-Trader Feed:',
          code: `@CosmicCarl: "Jupiter trine in my 8th house - going long 
on renewable energy markets. Mars supports innovation."
[Auto-copied by 247 followers] - ROI: +15.3% this month`
        }
      }
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <ModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>
        
        <h2>Platform Features & Services</h2>
        <p className="subtitle">
          Revolutionary astrological prediction markets with premium cosmic intelligence
        </p>

        <div className="lkhn-branding">
          <div className="logo">
            <svg viewBox="0 0 100 100" fill="currentColor">
              <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M30,30 L70,70 M70,30 L30,70 M50,15 L50,85 M15,50 L85,50" stroke="currentColor" strokeWidth="2"/>
              <circle cx="25" cy="25" r="2" fill="currentColor"/>
              <circle cx="75" cy="25" r="2" fill="currentColor"/>
              <circle cx="75" cy="75" r="2" fill="currentColor"/>
              <circle cx="25" cy="75" r="2" fill="currentColor"/>
            </svg>
          </div>
          <div className="brand-text">LKHN Technologies</div>
        </div>

        <FeaturesGrid>
          {features.map((feature) => (
            <FeatureCard 
              key={feature.id}
              onClick={() => setExpandedFeature(
                expandedFeature === feature.id ? null : feature.id
              )}
            >
              <div className="feature-header">
                <div className="icon">{feature.icon}</div>
                <div className="content">
                  <div className="title">{feature.title}</div>
                  <div className="description">{feature.description}</div>
                </div>
                <div className="percentage">{feature.percentage}</div>
                <div className="arrow">
                  {expandedFeature === feature.id ? '▼' : '▶'}
                </div>
              </div>

              <AnimatePresence>
                {expandedFeature === feature.id && (
                  <ExpandedContent
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h4 style={{ color: '#00d4ff', marginBottom: '1rem', fontSize: '0.9rem' }}>
                      {feature.content.overview}
                    </h4>

                    <div className="metrics-grid">
                      {feature.content.metrics.map((metric, index) => (
                        <div key={index} className="metric-card">
                          <div className="value">{metric.value}</div>
                          <div className="label">{metric.label}</div>
                        </div>
                      ))}
                    </div>

                    <ul className="feature-list">
                      {feature.content.features.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>

                    <div className="integration-demo">
                      <div className="demo-header">{feature.content.demo.header}</div>
                      <div className="demo-code">{feature.content.demo.code}</div>
                    </div>
                  </ExpandedContent>
                )}
              </AnimatePresence>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </ModalContent>
    </motion.div>
  );
};

export default PlatformFeaturesModal;
