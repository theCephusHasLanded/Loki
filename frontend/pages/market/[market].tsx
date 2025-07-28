import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Users, 
  Clock,
  Star,
  BarChart3,
  Zap,
  Calendar,
  Globe,
  DollarSign
} from 'lucide-react';

const DetailsContainer = styled.div`
  min-height: 100vh;
  background: var(--color-glass-base);
  color: var(--color-text-primary);
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  
  .back-button {
    background: var(--color-glass-surface);
    border: 1px solid var(--color-glass-border);
    border-radius: var(--radius-medium);
    padding: 0.75rem;
    color: var(--color-text-primary);
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background: var(--color-glass-accent);
      transform: translateX(-2px);
    }
  }
  
  .market-info {
    flex: 1;
    
    .market-title {
      font-size: 1.8rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin-bottom: 0.5rem;
    }
    
    .market-meta {
      display: flex;
      align-items: center;
      gap: 1rem;
      color: var(--color-text-secondary);
      font-size: 0.9rem;
    }
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Card = styled(motion.div)`
  background: var(--color-glass-surface);
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-large);
  padding: 2rem;
  backdrop-filter: var(--glass-blur-medium);
  
  h3 {
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const PriceCard = styled(Card)`
  text-align: center;
  
  .current-price {
    font-size: 3rem;
    font-weight: 600;
    color: var(--color-accent-gold);
    margin: 1rem 0;
  }
  
  .price-change {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }
  
  .ai-confidence {
    background: var(--color-glass-panel);
    border: 1px solid var(--color-glass-border);
    border-radius: var(--radius-medium);
    padding: 1rem;
    margin-top: 1rem;
    
    .confidence-label {
      color: var(--color-text-muted);
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }
    
    .confidence-value {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--color-text-accent);
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  
  .stat-item {
    background: var(--color-glass-panel);
    border: 1px solid var(--color-glass-border);
    border-radius: var(--radius-medium);
    padding: 1rem;
    text-align: center;
    
    .stat-icon {
      color: var(--color-text-accent);
      margin-bottom: 0.5rem;
    }
    
    .stat-label {
      color: var(--color-text-muted);
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }
    
    .stat-value {
      color: var(--color-text-primary);
      font-size: 1.1rem;
      font-weight: 600;
    }
  }
`;

const TradeButton = styled(motion.button)`
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, var(--color-glass-accent) 0%, rgba(0, 120, 204, 0.8) 100%);
  border: none;
  border-radius: var(--radius-medium);
  color: var(--color-text-primary);
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--glass-shadow-floating);
  }
`;

const Description = styled.div`
  .description-text {
    color: var(--color-text-secondary);
    line-height: 1.6;
    margin-bottom: 2rem;
  }
  
  .resolution-criteria {
    background: var(--color-glass-panel);
    border: 1px solid var(--color-glass-border);
    border-radius: var(--radius-medium);
    padding: 1rem;
    
    .criteria-title {
      color: var(--color-text-primary);
      font-weight: 500;
      margin-bottom: 0.5rem;
    }
    
    .criteria-text {
      color: var(--color-text-secondary);
      font-size: 0.9rem;
      line-height: 1.5;
    }
  }
`;

export default function MarketDetailsPage() {
  const router = useRouter();
  const { market } = router.query;

  // Mock market data - in real app, this would come from API
  const marketData = {
    title: market?.toString().replace(/-/g, ' ').toUpperCase() || 'Market Details',
    description: `This prediction market allows traders to speculate on whether ${market?.toString().replace(/-/g, ' ')} will occur by the specified deadline. The market uses advanced AI analysis and cosmic intelligence to provide probability assessments.`,
    currentPrice: 67.50,
    change: 12.5,
    volume: 12500000,
    aiConfidence: 87,
    liquidity: 5600000,
    traders: 1247,
    endDate: '2025-12-31',
    category: 'Cryptocurrency',
    created: '2025-01-15'
  };

  const isPositive = marketData.change >= 0;

  const handleTrade = () => {
    router.push(`/trade/${market}`);
  };

  return (
    <>
      <Head>
        <title>Market Details: {marketData.title} - LOKI 2032</title>
        <meta name="description" content={marketData.description} />
      </Head>
      
      <DetailsContainer>
        <Header>
          <button 
            className="back-button"
            onClick={() => router.push('/loki-2032-demo')}
          >
            <ArrowLeft size={20} />
          </button>
          <div className="market-info">
            <h1 className="market-title">{marketData.title}</h1>
            <div className="market-meta">
              <span><Globe size={14} /> {marketData.category}</span>
              <span><Calendar size={14} /> Ends {marketData.endDate}</span>
              <span><Users size={14} /> {marketData.traders} traders</span>
            </div>
          </div>
        </Header>

        <ContentGrid>
          <MainContent>
            <Card
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3>
                <BarChart3 size={20} />
                Market Overview
              </h3>
              <Description>
                <div className="description-text">
                  {marketData.description}
                </div>
                <div className="resolution-criteria">
                  <div className="criteria-title">Resolution Criteria:</div>
                  <div className="criteria-text">
                    This market will resolve to "YES" if the specified condition is met by the 
                    deadline as verified by official sources and our AI verification system. 
                    Resolution will be based on publicly available data and expert analysis.
                  </div>
                </div>
              </Description>
            </Card>

            <Card
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3>
                <Activity size={20} />
                Market Statistics
              </h3>
              <StatsGrid>
                <div className="stat-item">
                  <div className="stat-icon">
                    <DollarSign size={20} />
                  </div>
                  <div className="stat-label">Total Volume</div>
                  <div className="stat-value">${(marketData.volume / 1000000).toFixed(1)}M</div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">
                    <Activity size={20} />
                  </div>
                  <div className="stat-label">Liquidity</div>
                  <div className="stat-value">${(marketData.liquidity / 1000000).toFixed(1)}M</div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">
                    <Users size={20} />
                  </div>
                  <div className="stat-label">Active Traders</div>
                  <div className="stat-value">{marketData.traders}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">
                    <Clock size={20} />
                  </div>
                  <div className="stat-label">Days Remaining</div>
                  <div className="stat-value">
                    {Math.ceil((new Date(marketData.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                  </div>
                </div>
              </StatsGrid>
            </Card>

            <Card
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3>
                <Zap size={20} />
                AI Analysis & Cosmic Intelligence
              </h3>
              <div style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                <p style={{ marginBottom: '1rem' }}>
                  Our advanced AI system has analyzed multiple data sources including market sentiment, 
                  technical indicators, world events, and astrological patterns to generate predictions.
                </p>
                <div style={{ 
                  background: 'var(--color-glass-panel)',
                  border: '1px solid var(--color-glass-border)',
                  borderRadius: 'var(--radius-medium)',
                  padding: '1rem',
                  marginTop: '1rem'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    color: 'var(--color-text-accent)',
                    marginBottom: '0.5rem'
                  }}>
                    <Star size={16} />
                    <strong>Current Cosmic Alignment</strong>
                  </div>
                  <p style={{ fontSize: '0.9rem' }}>
                    Planetary positioning and market cycles suggest {marketData.aiConfidence}% probability. 
                    Recent celestial events and market correlations indicate {isPositive ? 'favorable' : 'cautious'} 
                    conditions for this prediction.
                  </p>
                </div>
              </div>
            </Card>
          </MainContent>

          <Sidebar>
            <PriceCard
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3>Current Price</h3>
              <div className="current-price">${marketData.currentPrice.toFixed(2)}</div>
              <div className="price-change" style={{ 
                color: isPositive ? 'var(--color-profit)' : 'var(--color-loss)' 
              }}>
                {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                {isPositive ? '+' : ''}{marketData.change.toFixed(2)}%
              </div>
              <div className="ai-confidence">
                <div className="confidence-label">AI Confidence Level</div>
                <div className="confidence-value">{marketData.aiConfidence}%</div>
              </div>
              <TradeButton
                onClick={handleTrade}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Trade Now
              </TradeButton>
            </PriceCard>

            <Card
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3>
                <Clock size={20} />
                Market Timeline
              </h3>
              <div style={{ color: 'var(--color-text-secondary)' }}>
                <div style={{ 
                  padding: '0.75rem 0',
                  borderBottom: '1px solid var(--color-glass-border)'
                }}>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    Market Created
                  </div>
                  <div style={{ color: 'var(--color-text-primary)', fontWeight: '500' }}>
                    {marketData.created}
                  </div>
                </div>
                <div style={{ 
                  padding: '0.75rem 0',
                  borderBottom: '1px solid var(--color-glass-border)'
                }}>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    Trading Ends
                  </div>
                  <div style={{ color: 'var(--color-text-primary)', fontWeight: '500' }}>
                    {marketData.endDate}
                  </div>
                </div>
                <div style={{ padding: '0.75rem 0' }}>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    Status
                  </div>
                  <div style={{ 
                    color: 'var(--color-profit)', 
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <Activity size={14} />
                    Active Trading
                  </div>
                </div>
              </div>
            </Card>
          </Sidebar>
        </ContentGrid>
      </DetailsContainer>
    </>
  );
}
