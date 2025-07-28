import React from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { 
  BarChart3, 
  Brain, 
  Zap, 
  Shield, 
  Globe, 
  Settings,
  TrendingUp,
  Activity,
  Eye,
  Lock,
  Cpu,
  Database
} from 'lucide-react';

const ModalContent = styled.div`
  padding: 2rem;
  height: 100%;
  overflow-y: auto;
  background: var(--color-glass-base);
  color: var(--color-text-primary);
`;

const Section = styled.section`
  margin-bottom: 3rem;
  
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  h3 {
    font-size: 1.2rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    margin: 1.5rem 0 0.5rem;
  }
  
  p {
    color: var(--color-text-secondary);
    line-height: 1.6;
    margin-bottom: 1rem;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`;

const FeatureCard = styled(motion.div)`
  background: var(--color-glass-surface);
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-medium);
  padding: 1.5rem;
  backdrop-filter: var(--glass-blur-medium);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--glass-shadow-floating);
    border-color: var(--color-glass-accent);
  }
  
  .feature-icon {
    width: 40px;
    height: 40px;
    background: var(--color-glass-accent);
    border-radius: var(--radius-small);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    color: var(--color-text-primary);
  }
  
  .feature-title {
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--color-text-primary);
    margin-bottom: 0.5rem;
  }
  
  .feature-description {
    color: var(--color-text-secondary);
    font-size: 0.9rem;
    line-height: 1.5;
  }
`;

const SpecsList = styled.ul`
  list-style: none;
  padding: 0;
  
  li {
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--color-glass-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    &:last-child {
      border-bottom: none;
    }
    
    .spec-name {
      color: var(--color-text-secondary);
    }
    
    .spec-value {
      color: var(--color-text-primary);
      font-weight: 500;
    }
  }
`;

export const FeaturesServicesModal: React.FC = () => {
  const features = [
    {
      icon: <BarChart3 size={20} />,
      title: "Advanced Analytics",
      description: "Real-time market analysis with machine learning insights and predictive modeling capabilities."
    },
    {
      icon: <Brain size={20} />,
      title: "AI-Powered Intelligence",
      description: "Cosmic pattern recognition using IBM Watson AI for astrological market correlations."
    },
    {
      icon: <Zap size={20} />,
      title: "Lightning Execution",
      description: "Sub-millisecond trade execution with direct NYSE/NASDAQ connectivity."
    },
    {
      icon: <Shield size={20} />,
      title: "Enterprise Security",
      description: "Bank-grade encryption and multi-layer security protocols protecting your assets."
    },
    {
      icon: <Globe size={20} />,
      title: "Global Markets",
      description: "Access to worldwide prediction markets with 24/7 trading capabilities."
    },
    {
      icon: <Activity size={20} />,
      title: "Real-Time Data",
      description: "Live market feeds, astronomical data, and world event correlations."
    }
  ];

  return (
    <ModalContent>
      <Section>
        <h2>
          <Settings size={24} />
          Platform Features & Services
        </h2>
        <p>
          LOKI 2032 represents the next evolution in prediction market trading, combining 
          traditional financial markets with cosmic intelligence and AI-powered insights.
        </p>
      </Section>

      <Section>
        <h3>Core Features</h3>
        <FeatureGrid>
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="feature-icon">
                {feature.icon}
              </div>
              <div className="feature-title">{feature.title}</div>
              <div className="feature-description">{feature.description}</div>
            </FeatureCard>
          ))}
        </FeatureGrid>
      </Section>

      <Section>
        <h3>
          <Cpu size={20} />
          Technical Specifications
        </h3>
        <SpecsList>
          <li>
            <span className="spec-name">Trading Latency</span>
            <span className="spec-value">0.34ms</span>
          </li>
          <li>
            <span className="spec-name">Market Data Feeds</span>
            <span className="spec-value">NYSE, NASDAQ, Real-time</span>
          </li>
          <li>
            <span className="spec-name">AI Processing Power</span>
            <span className="spec-value">IBM Watson Integration</span>
          </li>
          <li>
            <span className="spec-name">Astronomical Data</span>
            <span className="spec-value">NASA APIs, Live Updates</span>
          </li>
          <li>
            <span className="spec-name">Security Protocol</span>
            <span className="spec-value">AES-256, Multi-factor Auth</span>
          </li>
          <li>
            <span className="spec-name">Uptime Guarantee</span>
            <span className="spec-value">99.9% SLA</span>
          </li>
        </SpecsList>
      </Section>

      <Section>
        <h3>
          <Database size={20} />
          Premium Services
        </h3>
        <FeatureGrid>
          <FeatureCard
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="feature-icon">
              <Eye size={20} />
            </div>
            <div className="feature-title">Cosmic Market Intelligence</div>
            <div className="feature-description">
              Exclusive access to astrological pattern analysis and celestial event correlations
              with market movements.
            </div>
          </FeatureCard>
          
          <FeatureCard
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="feature-icon">
              <Lock size={20} />
            </div>
            <div className="feature-title">Institutional Access</div>
            <div className="feature-description">
              White-glove service for institutional clients with dedicated support and 
              custom integration capabilities.
            </div>
          </FeatureCard>
        </FeatureGrid>
      </Section>

      <Section>
        <h3>
          <TrendingUp size={20} />
          Market Coverage
        </h3>
        <p>
          Our platform covers a comprehensive range of prediction markets including:
        </p>
        <ul style={{ 
          color: 'var(--color-text-secondary)', 
          paddingLeft: '1.5rem',
          lineHeight: '1.8'
        }}>
          <li>Cryptocurrency price predictions</li>
          <li>Stock market movements and earnings</li>
          <li>Economic indicators and policy changes</li>
          <li>Technology breakthrough predictions</li>
          <li>Geopolitical event outcomes</li>
          <li>Climate and environmental predictions</li>
          <li>Space exploration milestones</li>
          <li>Astrological correlation markets</li>
        </ul>
      </Section>
    </ModalContent>
  );
};

export default FeaturesServicesModal;
