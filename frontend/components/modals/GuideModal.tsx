import React from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { 
  X, 
  Star, 
  TrendingUp, 
  Brain, 
  Globe, 
  Shield, 
  BarChart3,
  Zap,
  Calendar,
  DollarSign,
  Activity,
  AlertTriangle
} from 'lucide-react';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const ModalContent = styled(motion.div)`
  background: var(--color-glass-surface);
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-large);
  padding: 2rem;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  backdrop-filter: var(--glass-blur-strong);
  box-shadow: var(--glass-shadow-floating);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--color-glass-panel);
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-small);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--color-glass-accent);
    color: var(--color-text-primary);
  }
`;

const GuideHeader = styled.div`
  margin-bottom: 2rem;
  
  .guide-icon {
    width: 60px;
    height: 60px;
    background: var(--color-glass-accent);
    border-radius: var(--radius-medium);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    color: var(--color-text-primary);
  }
  
  .guide-title {
    font-size: 2rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 0.5rem;
  }
  
  .guide-subtitle {
    color: var(--color-text-secondary);
    font-size: 1.1rem;
    line-height: 1.6;
  }
`;

const GuideSection = styled.section`
  margin-bottom: 2rem;
  
  h3 {
    font-size: 1.4rem;
    font-weight: 500;
    color: var(--color-text-primary);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  p {
    color: var(--color-text-secondary);
    line-height: 1.6;
    margin-bottom: 1rem;
  }
  
  ul {
    color: var(--color-text-secondary);
    line-height: 1.8;
    padding-left: 1.5rem;
    
    li {
      margin-bottom: 0.5rem;
    }
  }
`;

const StepCard = styled.div`
  background: var(--color-glass-panel);
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-medium);
  padding: 1.5rem;
  margin: 1rem 0;
  
  .step-number {
    background: var(--color-glass-accent);
    color: var(--color-text-primary);
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  
  .step-title {
    font-size: 1.2rem;
    font-weight: 500;
    color: var(--color-text-primary);
    margin-bottom: 0.5rem;
  }
  
  .step-content {
    color: var(--color-text-secondary);
    line-height: 1.6;
  }
`;

const GuideContent = {
  'creating-your-first-cosmic-trade': {
    icon: <Star size={24} />,
    title: 'Creating Your First Cosmic Trade',
    subtitle: 'Learn to place intelligent trades using astrological timing and market analysis',
    content: {
      overview: 'Cosmic trading combines traditional market analysis with astrological insights to identify optimal trading opportunities. This guide will walk you through your first cosmic trade.',
      sections: [
        {
          title: 'Understanding Cosmic Timing',
          icon: <Calendar size={20} />,
          content: 'Astrological events create predictable patterns in market behavior. Learn to identify these cosmic windows of opportunity.',
          steps: [
            { title: 'Monitor Planetary Movements', content: 'Track major planetary transits and their historical correlation with market movements.' },
            { title: 'Identify Market Cycles', content: 'Understand how lunar phases and seasonal patterns affect trading sentiment.' },
            { title: 'Time Your Entry', content: 'Use cosmic alignments to determine optimal entry and exit points.' }
          ]
        },
        {
          title: 'Market Analysis Integration',
          icon: <BarChart3 size={20} />,
          content: 'Combine cosmic insights with traditional technical and fundamental analysis for maximum effectiveness.',
          steps: [
            { title: 'Technical Confirmation', content: 'Validate cosmic signals with chart patterns and technical indicators.' },
            { title: 'Risk Assessment', content: 'Use position sizing based on both cosmic confidence and market volatility.' },
            { title: 'Execute Your Trade', content: 'Place trades with confidence backed by both cosmic and market intelligence.' }
          ]
        }
      ]
    }
  },
  'ibm-watson-ai-cosmic-analysis': {
    icon: <Brain size={24} />,
    title: 'IBM Watson AI Cosmic Analysis',
    subtitle: 'Harness AI-powered astrological insights for advanced trading strategies',
    content: {
      overview: 'Our IBM Watson AI integration processes vast amounts of astrological and market data to generate actionable trading insights.',
      sections: [
        {
          title: 'AI Pattern Recognition',
          icon: <Zap size={20} />,
          content: 'Watson AI identifies complex patterns between celestial events and market movements that would be impossible to detect manually.',
          steps: [
            { title: 'Data Processing', content: 'Watson analyzes real-time astronomical data, market feeds, and historical correlations.' },
            { title: 'Pattern Identification', content: 'AI identifies subtle patterns and correlations across multiple timeframes and markets.' },
            { title: 'Confidence Scoring', content: 'Each prediction receives an AI confidence score based on historical accuracy.' }
          ]
        },
        {
          title: 'Predictive Modeling',
          icon: <TrendingUp size={20} />,
          content: 'Advanced machine learning models predict market movements based on cosmic alignments.',
          steps: [
            { title: 'Model Training', content: 'Continuous learning from market outcomes and celestial events.' },
            { title: 'Real-time Analysis', content: 'Live processing of cosmic and market data for immediate insights.' },
            { title: 'Adaptive Algorithms', content: 'Self-improving models that adapt to changing market conditions.' }
          ]
        }
      ]
    }
  },
  'reading-cosmic-market-patterns': {
    icon: <Activity size={24} />,
    title: 'Reading Cosmic Market Patterns',
    subtitle: 'Master the art of astrological pattern recognition in financial markets',
    content: {
      overview: 'Learn to identify and interpret the cosmic patterns that influence market behavior and trader psychology.',
      sections: [
        {
          title: 'Planetary Influences',
          icon: <Globe size={20} />,
          content: 'Different planets and their movements create distinct patterns in market behavior.',
          steps: [
            { title: 'Mercury Retrograde Effects', content: 'Understanding communication and technology sector impacts during Mercury retrograde periods.' },
            { title: 'Mars Transits', content: 'Identifying increased volatility and aggressive trading during Mars aspects.' },
            { title: 'Jupiter Expansions', content: 'Recognizing growth opportunities and bullish sentiment during Jupiter transits.' }
          ]
        },
        {
          title: 'Lunar Cycle Trading',
          icon: <Star size={20} />,
          content: 'The lunar cycle has a measurable impact on market sentiment and trading volume.',
          steps: [
            { title: 'New Moon Opportunities', content: 'Identifying new trend beginnings and fresh market opportunities.' },
            { title: 'Full Moon Volatility', content: 'Managing increased volatility and emotional trading during full moons.' },
            { title: 'Quarter Phase Reversals', content: 'Recognizing potential trend reversals during quarter moon phases.' }
          ]
        }
      ]
    }
  },
  'world-events-cosmic-correlations': {
    icon: <Globe size={24} />,
    title: 'World Events & Cosmic Correlations',
    subtitle: 'Connect global happenings with astrological cycles for predictive trading',
    content: {
      overview: 'Major world events often coincide with significant astrological transits. Learn to predict and trade around these correlations.',
      sections: [
        {
          title: 'Economic Announcements',
          icon: <DollarSign size={20} />,
          content: 'Federal Reserve meetings, GDP releases, and major economic announcements often align with specific planetary aspects.',
          steps: [
            { title: 'Saturn Cycles', content: 'Long-term economic policies and structural changes often occur during Saturn transits.' },
            { title: 'Venus Commerce', content: 'Trade agreements and commerce deals frequently align with Venus aspects.' },
            { title: 'Uranus Disruptions', content: 'Unexpected economic announcements and market surprises during Uranus transits.' }
          ]
        },
        {
          title: 'Geopolitical Events',
          icon: <AlertTriangle size={20} />,
          content: 'Political developments, conflicts, and international relations are influenced by cosmic cycles.',
          steps: [
            { title: 'Mars Conflicts', content: 'Military actions and conflicts often occur during Mars conjunctions and oppositions.' },
            { title: 'Pluto Power Shifts', content: 'Major political changes and power transitions during Pluto transits.' },
            { title: 'Neptune Confusion', content: 'Misinformation campaigns and unclear situations during Neptune aspects.' }
          ]
        }
      ]
    }
  },
  'advanced-cosmic-trading-strategies': {
    icon: <BarChart3 size={24} />,
    title: 'Advanced Cosmic Trading Strategies',
    subtitle: 'Professional-level techniques combining technical analysis with astrological timing',
    content: {
      overview: 'Advanced strategies that integrate multiple cosmic indicators with sophisticated trading techniques for professional results.',
      sections: [
        {
          title: 'Multi-Timeframe Cosmic Analysis',
          icon: <Calendar size={20} />,
          content: 'Combining short-term lunar cycles with long-term planetary transits for comprehensive market timing.',
          steps: [
            { title: 'Yearly Cycles', content: 'Using outer planet transits for long-term portfolio positioning.' },
            { title: 'Monthly Patterns', content: 'Leveraging lunar cycles for medium-term swing trading strategies.' },
            { title: 'Daily Timing', content: 'Precise entry and exit timing using planetary hours and aspects.' }
          ]
        },
        {
          title: 'Cosmic Portfolio Management',
          icon: <Shield size={20} />,
          content: 'Advanced portfolio techniques that account for cosmic influences on different asset classes.',
          steps: [
            { title: 'Sector Rotation', content: 'Rotating between sectors based on planetary influences and cosmic timing.' },
            { title: 'Risk Adjustment', content: 'Adjusting position sizes based on cosmic volatility predictions.' },
            { title: 'Hedge Strategies', content: 'Using cosmic correlations to hedge portfolio risk during volatile periods.' }
          ]
        }
      ]
    }
  },
  'cosmic-risk-management': {
    icon: <Shield size={24} />,
    title: 'Cosmic Risk Management',
    subtitle: 'Protect your capital using astrological risk assessment and position sizing',
    content: {
      overview: 'Sophisticated risk management techniques that incorporate cosmic cycles and astrological indicators to protect trading capital.',
      sections: [
        {
          title: 'Cosmic Volatility Prediction',
          icon: <Activity size={20} />,
          content: 'Using astrological indicators to predict and prepare for periods of increased market volatility.',
          steps: [
            { title: 'Volatile Aspects', content: 'Identifying high-risk periods through planetary aspects and configurations.' },
            { title: 'Safe Harbors', content: 'Finding stable periods during harmonious cosmic alignments.' },
            { title: 'Position Adjustment', content: 'Scaling position sizes based on cosmic volatility forecasts.' }
          ]
        },
        {
          title: 'Cosmic Stop Loss Strategies',
          icon: <AlertTriangle size={20} />,
          content: 'Advanced stop-loss techniques that consider both technical levels and cosmic timing.',
          steps: [
            { title: 'Cosmic Support Levels', content: 'Using astrological price levels as dynamic support and resistance.' },
            { title: 'Time-Based Exits', content: 'Exiting trades based on cosmic timing rather than just price movement.' },
            { title: 'Adaptive Risk', content: 'Adjusting risk parameters based on changing cosmic conditions.' }
          ]
        }
      ]
    }
  }
};

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  guideKey: string;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose, guideKey }) => {
  if (!isOpen) return null;

  const guide = GuideContent[guideKey as keyof typeof GuideContent];
  if (!guide) return null;

  return (
    <ModalOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <ModalContent
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <CloseButton onClick={onClose}>
          <X size={20} />
        </CloseButton>

        <GuideHeader>
          <div className="guide-icon">
            {guide.icon}
          </div>
          <h1 className="guide-title">{guide.title}</h1>
          <p className="guide-subtitle">{guide.subtitle}</p>
        </GuideHeader>

        <GuideSection>
          <p>{guide.content.overview}</p>
        </GuideSection>

        {guide.content.sections.map((section, index) => (
          <GuideSection key={index}>
            <h3>
              {section.icon}
              {section.title}
            </h3>
            <p>{section.content}</p>
            
            {section.steps.map((step, stepIndex) => (
              <StepCard key={stepIndex}>
                <div className="step-number">{stepIndex + 1}</div>
                <div className="step-title">{step.title}</div>
                <div className="step-content">{step.content}</div>
              </StepCard>
            ))}
          </GuideSection>
        ))}
      </ModalContent>
    </ModalOverlay>
  );
};

export default GuideModal;
