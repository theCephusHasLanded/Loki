'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { NeomorphicSurface } from '../components/loki-2032/NeomorphicSurface';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: var(--color-glass-base);
  position: relative;
  
  /* Trading background */
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1920&q=80&auto=format&fit=crop'),
      linear-gradient(135deg, var(--color-glass-base) 0%, var(--color-glass-surface) 100%);
    background-size: cover, cover;
    background-position: center, center;
    background-blend-mode: overlay, normal;
    backdrop-filter: var(--glass-blur-subtle);
    z-index: -1;
    pointer-events: none;
  }
`;

const DashboardHeader = styled.header`
  background: var(--color-glass-panel);
  backdrop-filter: var(--glass-blur-strong);
  border-bottom: 1px solid var(--color-glass-border);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTitle = styled.h1`
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: 0.1em;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
`;

const UserName = styled.span`
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text-primary);
`;

const UserRole = styled.span`
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const LogoutButton = styled(motion.button)`
  background: rgba(255, 68, 68, 0.1);
  border: 1px solid rgba(255, 68, 68, 0.3);
  border-radius: var(--radius-medium);
  padding: 0.5rem 1rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: #ff4444;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 68, 68, 0.2);
    border-color: rgba(255, 68, 68, 0.5);
  }
`;

const DashboardContent = styled.div`
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const DashboardCard = styled(NeomorphicSurface)`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CardTitle = styled.h2`
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
  letter-spacing: 0.05em;
`;

const CardDescription = styled.p`
  font-family: var(--font-primary);
  font-size: 0.9rem;
  color: var(--color-text-muted);
  line-height: 1.5;
`;

const ActionButton = styled(motion.button)`
  background: linear-gradient(135deg, var(--color-accent-gold) 0%, rgba(248, 179, 25, 0.8) 100%);
  color: #0a0f1c;
  border: none;
  border-radius: var(--radius-medium);
  padding: 0.75rem 1.5rem;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;
  
  &:hover {
    background: linear-gradient(135deg, rgba(248, 179, 25, 0.9) 0%, var(--color-accent-gold) 100%);
    box-shadow: 0 4px 20px rgba(248, 179, 25, 0.3);
  }
`;

const SecondaryButton = styled(motion.button)`
  background: var(--color-glass-panel);
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-medium);
  padding: 0.75rem 1.5rem;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;
  
  &:hover {
    background: var(--color-glass-surface);
    border-color: var(--color-text-accent);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 1rem;
  background: var(--color-glass-base);
  border-radius: var(--radius-medium);
  border: 1px solid var(--color-glass-border);
`;

const StatValue = styled.div`
  font-family: var(--font-mono);
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-text-accent);
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const Dashboard: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <DashboardContainer>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh' 
        }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem'
            }}
          >
            Loading dashboard...
          </motion.div>
        </div>
      </DashboardContainer>
    );
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  return (
    <DashboardContainer>
      <DashboardHeader>
        <HeaderTitle>LOKI 2032 Dashboard</HeaderTitle>
        <HeaderActions>
          <UserInfo>
            <UserName>{user.name}</UserName>
            <UserRole>{user.role || 'Trader'} • {user.company || 'Institution'}</UserRole>
          </UserInfo>
          <LogoutButton
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Logout
          </LogoutButton>
        </HeaderActions>
      </DashboardHeader>

      <DashboardContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <DashboardCard depth="medium">
            <CardTitle>Trading Platform</CardTitle>
            <CardDescription>
              Access the full LOKI 2032 trading interface with real-time market data, 
              advanced analytics, and institutional-grade execution tools.
            </CardDescription>
            <ActionButton
              onClick={() => router.push('/loki-2032-demo')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Launch Platform
            </ActionButton>
          </DashboardCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DashboardCard depth="medium">
            <CardTitle>Account Overview</CardTitle>
            <CardDescription>
              Your institutional trading account performance and key metrics.
            </CardDescription>
            <StatsGrid>
              <StatItem>
                <StatValue>$2.4M</StatValue>
                <StatLabel>Portfolio</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>+12.8%</StatValue>
                <StatLabel>YTD Return</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>0.87</StatValue>
                <StatLabel>Sharpe Ratio</StatLabel>
              </StatItem>
            </StatsGrid>
          </DashboardCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DashboardCard depth="medium">
            <CardTitle>Risk Management</CardTitle>
            <CardDescription>
              Monitor portfolio risk metrics and compliance with institutional guidelines.
            </CardDescription>
            <StatsGrid>
              <StatItem>
                <StatValue>18.2%</StatValue>
                <StatLabel>Volatility</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>-4.1%</StatValue>
                <StatLabel>Max Drawdown</StatLabel>
              </StatItem>
            </StatsGrid>
            <SecondaryButton
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View Risk Reports
            </SecondaryButton>
          </DashboardCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <DashboardCard depth="medium">
            <CardTitle>Market Research</CardTitle>
            <CardDescription>
              Access institutional research reports, market analysis, and quantitative insights.
            </CardDescription>
            <SecondaryButton
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Research Portal
            </SecondaryButton>
          </DashboardCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <DashboardCard depth="medium">
            <CardTitle>LKHN Technologies</CardTitle>
            <CardDescription>
              Learn more about our institutional trading technology and request additional services.
            </CardDescription>
            <ActionButton
              onClick={() => window.open('https://lkhntech.com', '_blank')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Visit LKHN Tech
            </ActionButton>
          </DashboardCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <DashboardCard depth="medium">
            <CardTitle>Support & Documentation</CardTitle>
            <CardDescription>
              Access API documentation, user guides, and institutional support resources.
            </CardDescription>
            <SecondaryButton
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Help Center
            </SecondaryButton>
          </DashboardCard>
        </motion.div>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default Dashboard;
