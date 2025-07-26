import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Star, Zap, TrendingUp, Globe, Bot, Moon, Sun } from 'lucide-react';
import { NeomorphicSurface } from './NeomorphicSurface';

interface GuideStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  details: {
    overview: string;
    steps: string[];
    cosmicFactors: string[];
    worldEvents: string[];
    example: string;
  };
}

const tradingGuideData: GuideStep[] = [
  {
    id: 'create-trade',
    title: 'Creating Your First Cosmic Trade',
    description: 'Learn to place intelligent trades using astrological timing and market analysis',
    icon: Play,
    details: {
      overview: 'LOKI 2032 combines traditional market analysis with cosmic intelligence to optimize your trading decisions. Every trade is enhanced by real-time astronomical data.',
      steps: [
        'Select a prediction market from our curated list',
        'Analyze the current moon phase and planetary transits',
        'Check your personalized astrological timing score',
        'Review AI-generated cosmic confidence levels',
        'Enter your position size based on risk tolerance',
        'Confirm trade with cosmic timing optimization'
      ],
      cosmicFactors: [
        'Moon Phase: New moons favor new positions, full moons indicate volatility',
        'Mercury Status: Avoid major trades during retrograde periods',
        'Planetary Alignments: Conjunctions create market momentum',
        'Your Birth Chart: Personal planetary transits affect decision making'
      ],
      worldEvents: [
        'Presidential Election 2024 ➜ Connected to Jupiter-Saturn alignments',
        'Federal Reserve Decisions ➜ Correlated with Mercury transits',
        'Major Tech Earnings ➜ Influenced by Uranus innovation cycles',
        'Global Economic Summits ➜ Timed with Pluto transformation periods'
      ],
      example: 'Example: "Will Bitcoin reach $100K by Q4 2025?" - Currently showing 67.5% probability with Venus in favorable aspect, suggesting bullish sentiment aligned with your Leo rising.'
    }
  },
  {
    id: 'watson-ai',
    title: 'IBM Watson AI Cosmic Analysis',
    description: 'Harness AI-powered astrological insights for advanced trading strategies',
    icon: Bot,
    details: {
      overview: 'Our IBM Watson AI integration analyzes thousands of astrological patterns, world events, and market correlations to provide unprecedented trading intelligence.',
      steps: [
        'Connect your birth data for personalized cosmic profile',
        'Ask Watson: "Analyze current market conditions"',
        'Review AI-generated astrological market forecast',
        'Get specific trade recommendations based on cosmic timing',
        'Monitor real-time alerts for favorable trading windows',
        'Track performance correlation with astrological events'
      ],
      cosmicFactors: [
        'Conjunctions: Planets align creating unified energy and market trends',
        'Squares: 90° angles indicate tension and potential market volatility',
        'Oppositions: 180° aspects create polarity and dramatic reversals',
        'Trines: 120° harmonious aspects support smooth market movements'
      ],
      worldEvents: [
        'Tesla Stock Predictions ➜ Elon Musk\'s natal chart transits analyzed',
        'Crypto Market Timing ➜ Saturn cycles correlate with regulatory changes',
        'Sports Betting Markets ➜ Team mascot astrological compatibility',
        'Political Outcomes ➜ Candidate birth chart analysis and electability'
      ],
      example: 'Watson Analysis: "Current Mars-Jupiter trine in your 2nd house of money suggests favorable trading conditions for growth-oriented positions. Avoid short positions during this 3-day window."'
    }
  },
  {
    id: 'cosmic-patterns',
    title: 'Reading Cosmic Market Patterns',
    description: 'Master the art of astrological pattern recognition in financial markets',
    icon: Star,
    details: {
      overview: 'Learn to identify powerful astrological patterns that historically correlate with significant market movements and world events.',
      steps: [
        'Study major planetary cycles and their market impact',
        'Identify your optimal trading days based on personal transits',
        'Track lunar cycles and volatility patterns',
        'Monitor eclipse periods for major market shifts',
        'Use retrograde periods for position adjustments',
        'Apply cosmic timing to entry and exit strategies'
      ],
      cosmicFactors: [
        'Solar Eclipses: Major beginnings, often coincide with market tops/bottoms',
        'Lunar Eclipses: Emotional releases, increased volatility periods',
        'Saturn Returns: 29-year cycles affecting long-term market structures',
        'Jupiter-Saturn Conjunctions: 20-year cycles marking major economic shifts'
      ],
      worldEvents: [
        '2008 Financial Crisis ➜ Pluto entering Capricorn (transformation of systems)',
        'COVID-19 Market Crash ➜ Saturn-Pluto conjunction in Capricorn',
        'GameStop Short Squeeze ➜ Aquarius stellium (revolutionary group action)',
        'FTX Collapse ➜ Mars retrograde in Gemini (communication/trust issues)'
      ],
      example: 'Pattern Alert: Upcoming Venus-Mars conjunction in Scorpio suggests intense activity in luxury goods and beauty industry stocks. Historical data shows 73% accuracy in related market movements.'
    }
  },
  {
    id: 'world-events',
    title: 'World Events & Cosmic Correlations',
    description: 'Connect global happenings with astrological cycles for predictive trading',
    icon: Globe,
    details: {
      overview: 'Understand how major world events correlate with astrological cycles, giving you predictive insights into market-moving news before it happens.',
      steps: [
        'Monitor planetary transits affecting world leader birth charts',
        'Track eclipse cycles and their historical event correlations',
        'Analyze collective planetary aspects for social trends',
        'Correlate natural disasters with astrological patterns',
        'Study geopolitical tensions through Mars cycles',
        'Predict economic policy changes via Saturn transits'
      ],
      cosmicFactors: [
        'Outer Planet Transits: Generational changes affecting long-term trends',
        'Cardinal Crosses: Crisis points requiring decisive action',
        'Mutable T-Squares: Communication breakdowns and adaptability needs',
        'Fixed Grand Crosses: Resistance to change creating market tension'
      ],
      worldEvents: [
        'Russia-Ukraine Conflict ➜ Mars-Pluto aspects affecting energy markets',
        'China Economic Policy ➜ President Xi\'s Saturn return cycle',
        'US Elections ➜ Candidate compatibility with national birth chart',
        'Climate Events ➜ Uranus in Earth signs correlating with natural disasters'
      ],
      example: 'Current Insight: Mercury retrograde in Capricorn (Dec 2024) suggests potential delays in government economic decisions. Position accordingly in policy-sensitive markets like healthcare and energy.'
    }
  },
  {
    id: 'advanced-strategies',
    title: 'Advanced Cosmic Trading Strategies',
    description: 'Professional-level techniques combining technical analysis with astrological timing',
    icon: TrendingUp,
    details: {
      overview: 'Develop sophisticated trading strategies that layer traditional financial analysis with precise astrological timing for maximum market advantage.',
      steps: [
        'Combine technical indicators with lunar cycle timing',
        'Use planetary hours for optimal trade execution',
        'Apply void-of-course moon rules for market entry',
        'Integrate solar return charts for annual strategy planning',
        'Employ electional astrology for major position changes',
        'Create cosmic portfolio allocation based on element balance'
      ],
      cosmicFactors: [
        'Planetary Hours: Each hour ruled by different planet affecting trade success',
        'Void Moon Periods: Times when markets drift without clear direction',
        'Planetary Dignities: Planets in their strongest signs boost related sectors',
        'Retrograde Strategies: Different approaches for each retrograde planet'
      ],
      worldEvents: [
        'Tech Sector Timing ➜ Uranus transits for innovation breakthrough predictions',
        'Banking Sector ➜ Saturn cycles correlating with regulatory changes',
        'Energy Markets ➜ Mars cycles affecting oil and gas price volatility',
        'Precious Metals ➜ Venus cycles influencing gold and silver trends'
      ],
      example: 'Advanced Strategy: Layer Fibonacci retracements with lunar mansions for precision entry points. Current setup shows BTC at 61.8% retracement coinciding with favorable 2nd lunar mansion for wealth accumulation.'
    }
  },
  {
    id: 'risk-management',
    title: 'Cosmic Risk Management',
    description: 'Protect your capital using astrological risk assessment and position sizing',
    icon: Zap,
    details: {
      overview: 'Learn to manage risk using cosmic intelligence, adjusting position sizes and stop-losses based on astrological volatility indicators.',
      steps: [
        'Calculate position size based on current lunar phase volatility',
        'Set stop-losses considering planetary aspect patterns',
        'Adjust portfolio allocation for eclipse season protection',
        'Use cosmic diversification across astrological elements',
        'Implement planetary transit-based rebalancing',
        'Apply birth chart risk tolerance analysis'
      ],
      cosmicFactors: [
        'High Risk Periods: Eclipse seasons, Mars retrograde, Mercury combust',
        'Low Risk Periods: Stable earth sign transits, harmonious Venus aspects',
        'Volatility Indicators: Mutable sign emphasis, outer planet hard aspects',
        'Stability Factors: Fixed sign dominance, trine and sextile patterns'
      ],
      worldEvents: [
        'Market Crash Prediction ➜ Saturn-Pluto conjunctions every 35 years',
        'Black Swan Events ➜ Uranus-Pluto aspects creating sudden disruption',
        'Currency Crises ➜ Neptune transits dissolving financial structures',
        'Bull Market Peaks ➜ Jupiter-Uranus conjunctions marking euphoria tops'
      ],
      example: 'Risk Alert: Approaching Mars-Saturn square suggests market tension. Reduce position sizes by 25% and avoid new leveraged positions for next 5 trading days. Historical accuracy: 81%.'
    }
  }
];

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
`;

const TitleSection = styled.div`
  text-align: center;
  margin-bottom: 40px;
  
  h2 {
    font-family: var(--font-display);
    font-size: 1.8rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0 0 12px 0;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  
  p {
    font-family: var(--font-primary);
    font-size: 1rem;
    color: var(--color-text-secondary);
    margin: 0;
    line-height: 1.6;
    max-width: 600px;
    margin: 0 auto;
  }
`;

const GuideGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const GuideCard = styled(NeomorphicSurface)`
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
`;

const IconContainer = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--color-accent-gold), var(--color-accent-blue));
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-background-primary);
`;

const CardContent = styled.div`
  h3 {
    font-family: var(--font-display);
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0 0 8px 0;
    letter-spacing: 0.05em;
  }
  
  p {
    font-family: var(--font-primary);
    font-size: 0.9rem;
    color: var(--color-text-secondary);
    margin: 0;
    line-height: 1.5;
  }
`;

const DetailModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-glass-base);
  backdrop-filter: var(--glass-blur-strong);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ModalContent = styled(NeomorphicSurface)`
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 32px;
  position: relative;
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 16px;
  right: 16px;
  background: var(--color-glass-accent);
  border: 1px solid var(--color-glass-border);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-text-primary);
  font-size: 18px;
  font-weight: bold;
`;

const DetailSection = styled.div`
  margin-bottom: 24px;
  
  h4 {
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-accent-gold);
    margin: 0 0 12px 0;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  
  p {
    font-family: var(--font-primary);
    font-size: 0.9rem;
    color: var(--color-text-secondary);
    margin: 0 0 16px 0;
    line-height: 1.6;
  }
`;

const StepsList = styled.ol`
  padding-left: 20px;
  margin: 0 0 16px 0;
  
  li {
    font-family: var(--font-primary);
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    margin: 8px 0;
    line-height: 1.5;
  }
`;

const FactorsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 16px 0;
  
  li {
    font-family: var(--font-primary);
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    margin: 8px 0;
    padding-left: 20px;
    position: relative;
    line-height: 1.5;
    
    &:before {
      content: '⭐';
      position: absolute;
      left: 0;
      color: var(--color-accent-gold);
    }
  }
`;

const ExampleBox = styled.div`
  background: var(--color-glass-panel);
  border: 1px solid var(--color-accent-blue);
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
  
  .label {
    font-family: var(--font-display);
    font-size: 0.75rem;
    color: var(--color-accent-blue);
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  
  .content {
    font-family: var(--font-primary);
    font-size: 0.85rem;
    color: var(--color-text-primary);
    line-height: 1.5;
    font-style: italic;
  }
`;

export const TradingGuide2032: React.FC = () => {
  const [selectedGuide, setSelectedGuide] = useState<GuideStep | null>(null);

  return (
    <Container>
      <TitleSection>
        <h2>Trading Guide & Cosmic Intelligence</h2>
        <p>
          Master the art of astrological prediction trading with IBM Watson AI. 
          Learn to combine cosmic timing with world events for unparalleled market insights.
        </p>
      </TitleSection>

      <GuideGrid>
        {tradingGuideData.map((guide) => {
          const IconComponent = guide.icon;
          
          return (
            <div onClick={() => setSelectedGuide(guide)}>
              <GuideCard
                key={guide.id}
              >
                <CardHeader>
                  <IconContainer>
                    <IconComponent size={24} />
                  </IconContainer>
                  <CardContent>
                    <h3>{guide.title}</h3>
                    <p>{guide.description}</p>
                  </CardContent>
                </CardHeader>
              </GuideCard>
            </div>
          );
        })}
      </GuideGrid>

      <AnimatePresence>
        {selectedGuide && (
          <DetailModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedGuide(null)}
          >
            <motion.div 
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <ModalContent
              >
              <CloseButton
                onClick={() => setSelectedGuide(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ×
              </CloseButton>

              <CardHeader>
                <IconContainer>
                  <selectedGuide.icon size={24} />
                </IconContainer>
                <CardContent>
                  <h3>{selectedGuide.title}</h3>
                  <p>{selectedGuide.description}</p>
                </CardContent>
              </CardHeader>

              <DetailSection>
                <h4>Overview</h4>
                <p>{selectedGuide.details.overview}</p>
              </DetailSection>

              <DetailSection>
                <h4>Step-by-Step Process</h4>
                <StepsList>
                  {selectedGuide.details.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </StepsList>
              </DetailSection>

              <DetailSection>
                <h4>Cosmic Factors</h4>
                <FactorsList>
                  {selectedGuide.details.cosmicFactors.map((factor, index) => (
                    <li key={index}>{factor}</li>
                  ))}
                </FactorsList>
              </DetailSection>

              <DetailSection>
                <h4>World Event Correlations</h4>
                <FactorsList>
                  {selectedGuide.details.worldEvents.map((event, index) => (
                    <li key={index}>{event}</li>
                  ))}
                </FactorsList>
              </DetailSection>

              <ExampleBox>
                <div className="label">Live Example</div>
                <div className="content">{selectedGuide.details.example}</div>
              </ExampleBox>
              </ModalContent>
            </motion.div>
          </DetailModal>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default TradingGuide2032;
