import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Activity, Brain, Zap, Shield, Clock, Globe } from 'lucide-react';
import { NeomorphicSurface } from './NeomorphicSurface';

interface TechnologyItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  currentStatus: {
    description: string;
    progress: number;
    capabilities: string[];
  };
  roadmap2032: {
    vision: string;
    keyMilestones: {
      year: string;
      milestone: string;
    }[];
    finalTarget: string;
  };
}

const technologyData: TechnologyItem[] = [
  {
    id: 'astrological-profiling',
    title: 'Astrological Market Profiling',
    subtitle: 'AI-powered cosmic personality trading that adapts to your astrological DNA',
    icon: Activity,
    currentStatus: {
      description: 'Revolutionary market prediction using real astronomical data and personalized birth charts',
      progress: 85,
      capabilities: [
        'Birth chart analysis for personalized trading strategies',
        'Real-time planetary transit impact on market behavior',
        'Mercury retrograde alerts with position sizing recommendations',
        'Moon phase correlation with your risk tolerance and timing'
      ]
    },
    roadmap2032: {
      vision: 'First platform to achieve 95%+ prediction accuracy using cosmic intelligence',
      keyMilestones: [
        { year: '2025', milestone: 'Launch personalized astrological trading algorithms' },
        { year: '2026', milestone: 'Integrate NASA astronomical data for market prediction' },
        { year: '2028', milestone: 'Deploy quantum astrological modeling with 90% accuracy' },
        { year: '2030', milestone: 'Achieve market prophecy through advanced cosmic AI' }
      ],
      finalTarget: 'World\'s first astrologically-guided prediction market with prophetic accuracy'
    }
  },
  {
    id: 'membership-tiers',
    title: 'Premium Membership Tiers',
    subtitle: 'Exclusive cosmic insights and priority market access for serious traders',
    icon: Brain,
    currentStatus: {
      description: 'Multi-tier subscription system with increasing astrological intelligence and market access',
      progress: 70,
      capabilities: [
        'Free Tier: Basic predictions, 3 markets per day',
        'Cosmic Tier ($29/mo): Full astrological analysis, unlimited markets',
        'Oracle Tier ($99/mo): Advanced AI insights, priority support',
        'Stellar Tier ($299/mo): Personal astrologer consultation, exclusive markets'
      ]
    },
    roadmap2032: {
      vision: 'Elite cosmic trading society with personalized astrological wealth management',
      keyMilestones: [
        { year: '2025', milestone: 'Launch tiered membership with astrological features' },
        { year: '2026', milestone: 'Add VIP tier with personal astrologer consultation' },
        { year: '2028', milestone: 'Create exclusive high-stakes cosmic markets' },
        { year: '2030', milestone: 'Elite society with cosmic wealth management' }
      ],
      finalTarget: 'Most exclusive trading community guided by cosmic intelligence'
    }
  },
  {
    id: 'banking-integration',
    title: 'Seamless Banking & Payments',
    subtitle: 'Instant deposits, withdrawals, and crypto-to-fiat conversion',
    icon: Zap,
    currentStatus: {
      description: 'Multi-currency support with instant settlements and regulatory compliance',
      progress: 60,
      capabilities: [
        'Instant ACH deposits and wire transfers',
        'Crypto wallet integration (MetaMask, Coinbase, etc.)',
        'USDC stablecoin markets with instant settlement',
        'Traditional bank account linking with Plaid integration'
      ]
    },
    roadmap2032: {
      vision: 'Universal financial access with cosmic-timed optimal deposit suggestions',
      keyMilestones: [
        { year: '2025', milestone: 'Full banking integration with major institutions' },
        { year: '2026', milestone: 'Launch cosmic-timed deposit recommendations' },
        { year: '2028', milestone: 'Implement astrological wealth optimization' },
        { year: '2030', milestone: 'Universal financial access across all markets' }
      ],
      finalTarget: 'World\'s most intelligent financial platform guided by cosmic timing'
    }
  },
  {
    id: 'market-categories',
    title: 'Diverse Prediction Markets',
    subtitle: 'From elections to entertainment, sports to crypto - all with cosmic insights',
    icon: Shield,
    currentStatus: {
      description: 'Comprehensive market categories with astrological correlation analysis',
      progress: 75,
      capabilities: [
        'Political Elections: Planetary alignments affecting voter behavior',
        'Sports Outcomes: Moon phases and team performance correlation',
        'Entertainment Awards: Celebrity birth charts and cosmic timing',
        'Economic Events: Astrological market timing for Fed decisions'
      ]
    },
    roadmap2032: {
      vision: 'Complete life prediction ecosystem with cosmic accuracy',
      keyMilestones: [
        { year: '2025', milestone: 'Launch 50+ market categories with cosmic analysis' },
        { year: '2026', milestone: 'Add personal life event predictions' },
        { year: '2028', milestone: 'Corporate merger and acquisition cosmic timing' },
        { year: '2030', milestone: 'Universal prediction markets for all events' }
      ],
      finalTarget: 'World\'s most comprehensive prediction platform with cosmic intelligence'
    }
  },
  {
    id: 'ai-astrologer',
    title: 'Personal AI Astrologer',
    subtitle: 'Your personal cosmic trading advisor powered by GPT-4 and astronomical data',
    icon: Clock,
    currentStatus: {
      description: '24/7 AI astrologer providing personalized trading guidance and market insights',
      progress: 80,
      capabilities: [
        'Daily personalized market forecasts based on your birth chart',
        'Real-time trading alerts during favorable cosmic conditions',
        'Risk management suggestions based on current planetary transits',
        'Voice-activated cosmic trading consultation'
      ]
    },
    roadmap2032: {
      vision: 'Most advanced AI astrologer with predictive accuracy exceeding human experts',
      keyMilestones: [
        { year: '2025', milestone: 'Launch GPT-4 powered astrological trading advisor' },
        { year: '2026', milestone: 'Add voice consultation and real-time coaching' },
        { year: '2028', milestone: 'Achieve 95% prediction accuracy with AI astrology' },
        { year: '2030', milestone: 'First AI astrologer to surpass human expertise' }
      ],
      finalTarget: 'World\'s most intelligent AI astrologer with prophetic trading abilities'
    }
  },
  {
    id: 'social-trading',
    title: 'Cosmic Social Trading',
    subtitle: 'Follow top astrological traders and copy their cosmic-guided strategies',
    icon: Globe,
    currentStatus: {
      description: 'Social platform connecting traders through astrological compatibility and performance',
      progress: 55,
      capabilities: [
        'Follow traders with compatible astrological profiles',
        'Copy trades from top performers during their favorable transits',
        'Astrological compatibility matching for trading partnerships',
        'Community discussions around cosmic market events'
      ]
    },
    roadmap2032: {
      vision: 'Global cosmic trading community with astrological strategy sharing',
      keyMilestones: [
        { year: '2025', milestone: 'Launch social trading with astrological matching' },
        { year: '2026', milestone: 'Add community-created cosmic strategies' },
        { year: '2028', milestone: 'Global astrological trading tournaments' },
        { year: '2030', milestone: 'Universal cosmic trading social network' }
      ],
      finalTarget: 'World\'s largest community of cosmically-guided traders'
    }
  }
];

const Container = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
`;

const TitleSection = styled.div`
  text-align: center;
  margin-bottom: 32px;
  
  h2 {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0 0 8px 0;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  
  p {
    font-family: var(--font-primary);
    font-size: 0.9rem;
    color: var(--color-text-secondary);
    margin: 0;
    line-height: 1.5;
  }
`;

const TechnologyCard = styled(NeomorphicSurface)`
  margin-bottom: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 24px;
  gap: 16px;
`;

const IconContainer = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--color-glass-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-accent-gold);
`;

const CardInfo = styled.div`
  flex: 1;
  
  h3 {
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0 0 4px 0;
    letter-spacing: 0.05em;
  }
  
  p {
    font-family: var(--font-primary);
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    margin: 0;
    line-height: 1.4;
  }
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 120px;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 6px;
  background: var(--color-glass-panel);
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, var(--color-accent-blue), var(--color-accent-gold));
  width: ${props => props.progress}%;
  transition: width 0.5s ease;
`;

const ProgressText = styled.span`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-text-accent);
  font-weight: 600;
  min-width: 35px;
`;

const ChevronIcon = styled(motion.div)`
  color: var(--color-text-secondary);
  transition: color 0.2s ease;
`;

const ExpandedContent = styled(motion.div)`
  border-top: 1px solid var(--color-glass-border);
  background: var(--color-glass-panel);
`;

const ContentSection = styled.div`
  padding: 24px;
  
  h4 {
    font-family: var(--font-display);
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0 0 12px 0;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  
  p {
    font-family: var(--font-primary);
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    margin: 0 0 16px 0;
    line-height: 1.5;
  }
`;

const CapabilitiesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 24px 0;
  
  li {
    font-family: var(--font-primary);
    font-size: 0.8rem;
    color: var(--color-text-secondary);
    margin: 8px 0;
    padding-left: 16px;
    position: relative;
    
    &:before {
      content: '⚡';
      position: absolute;
      left: 0;
      color: var(--color-accent-gold);
    }
  }
`;

const RoadmapGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Milestone = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin: 8px 0;
  
  .year {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--color-accent-gold);
    font-weight: 600;
    min-width: 40px;
  }
  
  .description {
    font-family: var(--font-primary);
    font-size: 0.8rem;
    color: var(--color-text-secondary);
    line-height: 1.4;
  }
`;

const FinalTarget = styled.div`
  background: var(--color-glass-accent);
  border: 1px solid var(--color-accent-gold);
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
  text-align: center;
  
  .label {
    font-family: var(--font-display);
    font-size: 0.7rem;
    color: var(--color-accent-gold);
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  
  .target {
    font-family: var(--font-primary);
    font-size: 0.85rem;
    color: var(--color-text-primary);
    font-weight: 500;
    line-height: 1.4;
  }
`;

export const TechnologyRoadmap2032: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <Container>
      <TitleSection>
        <h2>Platform Features & Services</h2>
        <p>Revolutionary astrological prediction markets with premium cosmic intelligence</p>
      </TitleSection>

      {technologyData.map((item) => {
        const isExpanded = expandedItems.has(item.id);
        const IconComponent = item.icon;

        return (
          <TechnologyCard
            key={item.id}
          >
            <CardHeader onClick={() => toggleExpand(item.id)}>
              <IconContainer>
                <IconComponent size={24} />
              </IconContainer>
              
              <CardInfo>
                <h3>{item.title}</h3>
                <p>{item.subtitle}</p>
              </CardInfo>
              
              <ProgressContainer>
                <ProgressBar>
                  <ProgressFill progress={item.currentStatus.progress} />
                </ProgressBar>
                <ProgressText>{item.currentStatus.progress}%</ProgressText>
              </ProgressContainer>
              
              <ChevronIcon
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight size={20} />
              </ChevronIcon>
            </CardHeader>

            <AnimatePresence>
              {isExpanded && (
                <ExpandedContent
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <RoadmapGrid>
                    <ContentSection>
                      <h4>Current Status</h4>
                      <p>{item.currentStatus.description}</p>
                      <CapabilitiesList>
                        {item.currentStatus.capabilities.map((capability, index) => (
                          <li key={index}>{capability}</li>
                        ))}
                      </CapabilitiesList>
                    </ContentSection>

                    <ContentSection>
                      <h4>2032 Vision</h4>
                      <p>{item.roadmap2032.vision}</p>
                      
                      {item.roadmap2032.keyMilestones.map((milestone, index) => (
                        <Milestone key={index}>
                          <span className="year">{milestone.year}</span>
                          <span className="description">{milestone.milestone}</span>
                        </Milestone>
                      ))}
                      
                      <FinalTarget>
                        <div className="label">Ultimate Goal</div>
                        <div className="target">{item.roadmap2032.finalTarget}</div>
                      </FinalTarget>
                    </ContentSection>
                  </RoadmapGrid>
                </ExpandedContent>
              )}
            </AnimatePresence>
          </TechnologyCard>
        );
      })}
    </Container>
  );
};

export default TechnologyRoadmap2032;
