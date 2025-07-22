import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { NeomorphicSurface } from '../loki-2032/NeomorphicSurface';
import { analyticsService, PerformanceMetric, Alert } from '../../services/AnalyticsService';

const AnalyticsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-molecule);
  height: 100%;
`;

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--space-molecule);
  margin-bottom: var(--space-solar);
`;

const MetricCard = styled(NeomorphicSurface)`
  padding: var(--space-molecule);
  text-align: center;
  
  .metric-label {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    font-weight: 400;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.2em;
    margin-bottom: var(--space-quantum);
    font-variant-numeric: tabular-nums;
  }
  
  .metric-value {
    font-family: var(--font-data);
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--color-text-primary);
    letter-spacing: 0.05em;
    margin-bottom: var(--space-quantum);
    font-variant-numeric: tabular-nums;
  }
  
  .metric-change {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 700;
    
    &.positive { color: var(--color-profit); }
    &.negative { color: var(--color-loss); }
  }
`;

const ChartContainer = styled(NeomorphicSurface)`
  flex: 1;
  padding: var(--space-molecule);
  display: flex;
  flex-direction: column;
  min-height: 300px;
  position: relative;
  overflow: hidden;
  
  /* Hypnotic financial data visualization background */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      linear-gradient(var(--color-glass-base), var(--color-glass-base)),
      url('https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&q=80&auto=format&fit=crop');
    background-size: cover;
    background-position: center;
    z-index: 0;
  }
  
  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-molecule);
    position: relative;
    z-index: 2;
    
    h3 {
      font-family: var(--font-display);
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--color-text-primary);
      text-transform: uppercase;
      letter-spacing: 0.2em;
      font-variant-numeric: tabular-nums;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
    }
    
    .time-selector {
      display: flex;
      gap: var(--space-quantum);
      position: relative;
      z-index: 2;
      
      button {
        background: var(--color-glass-panel);
        border: 1px solid var(--color-glass-border);
        border-radius: 4px;
        padding: 4px 8px;
        font-family: var(--font-mono);
        font-size: 0.65rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        color: var(--color-text-muted);
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
        font-variant-numeric: tabular-nums;
        backdrop-filter: var(--glass-blur-medium);
        
        &:hover, &.active {
          background: var(--color-glass-accent);
          color: var(--color-text-primary);
        }
      }
    }
  }
  
  .chart-placeholder {
    flex: 1;
    background: var(--color-glass-base);
    border: 1px solid var(--color-glass-border);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-muted);
    font-family: var(--font-mono);
    font-size: 0.8rem;
    font-weight: 200;
    letter-spacing: 0.05em;
    position: relative;
    overflow: hidden;
    z-index: 2;
    backdrop-filter: var(--glass-blur-strong);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
    
    /* Animated data visualization simulation */
    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, 
        var(--color-profit) 20%, 
        var(--color-accent-amber) 40%,
        var(--color-loss) 60%,
        var(--color-profit) 80%);
      animation: data-flow 3s ease-in-out infinite;
    }
  }
  
  @keyframes data-flow {
    0%, 100% { transform: translateX(-100%); }
    50% { transform: translateX(100%); }
  }
`;

const AlertsList = styled(NeomorphicSurface)`
  padding: var(--space-molecule);
  
  .alerts-header {
    font-family: var(--font-display);
    font-size: 0.9rem;
    font-weight: 200;
    color: var(--color-text-primary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: var(--space-molecule);
  }
  
  .alert-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-atom) 0;
    border-bottom: 1px solid var(--color-glass-border);
    
    &:last-child {
      border-bottom: none;
    }
    
    .alert-text {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 200;
      color: var(--color-text-secondary);
      flex: 1;
    }
    
    .alert-status {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      font-weight: 200;
      padding: 2px 6px;
      border-radius: 3px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      
      &.critical {
        background: var(--color-loss);
        color: white;
      }
      
      &.warning {
        background: var(--color-warning);
        color: white;
      }
      
      &.info {
        background: var(--color-glass-accent);
        color: white;
      }
    }
  }
`;

export const AnalyticsModal: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1D');

  useEffect(() => {
    // Load initial data
    const analyticsData = analyticsService.getAnalyticsData();
    setMetrics(analyticsData.performanceMetrics);
    setAlerts(analyticsData.alerts.slice(0, 8)); // Show only first 8 alerts

    // Start alert simulation for demo
    analyticsService.startAlertSimulation();

    // Update alerts every 30 seconds
    const alertInterval = setInterval(() => {
      const newAlerts = analyticsService.getAlerts().slice(0, 8);
      setAlerts(newAlerts);
    }, 30000);

    return () => clearInterval(alertInterval);
  }, []);

  return (
    <AnalyticsContainer>
      <MetricGrid>
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <MetricCard depth="medium" interactive>
              <div className="metric-label">{metric.label}</div>
              <div className="metric-value">{metric.value}</div>
              <div className={`metric-change ${metric.isPositive ? 'positive' : 'negative'}`}>
                {metric.change}
              </div>
            </MetricCard>
          </motion.div>
        ))}
      </MetricGrid>

      <ChartContainer depth="deep">
        <div className="chart-header">
          <h3>Performance Analytics</h3>
          <div className="time-selector">
            <button 
              className={selectedTimeframe === '1D' ? 'active' : ''}
              onClick={() => setSelectedTimeframe('1D')}
            >
              1D
            </button>
            <button 
              className={selectedTimeframe === '1W' ? 'active' : ''}
              onClick={() => setSelectedTimeframe('1W')}
            >
              1W
            </button>
            <button 
              className={selectedTimeframe === '1M' ? 'active' : ''}
              onClick={() => setSelectedTimeframe('1M')}
            >
              1M
            </button>
            <button 
              className={selectedTimeframe === '1Y' ? 'active' : ''}
              onClick={() => setSelectedTimeframe('1Y')}
            >
              1Y
            </button>
          </div>
        </div>
        <div className="chart-placeholder">
          Real-time Analytics Engine
        </div>
      </ChartContainer>

      <AlertsList depth="medium">
        <div className="alerts-header">Active Alerts</div>
        {alerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            className="alert-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            onClick={() => analyticsService.markAlertAsRead(alert.id)}
            style={{ 
              opacity: alert.isRead ? 0.6 : 1,
              cursor: 'pointer'
            }}
          >
            <span className="alert-text">
              {alert.title}: {alert.message}
              {alert.symbol && (
                <span style={{ 
                  color: 'var(--color-text-accent)', 
                  marginLeft: '8px',
                  fontSize: '0.7rem',
                  fontWeight: '700'
                }}>
                  [{alert.symbol}]
                </span>
              )}
            </span>
            <span className={`alert-status ${alert.type}`}>
              {alert.type}
            </span>
          </motion.div>
        ))}
      </AlertsList>
    </AnalyticsContainer>
  );
};

export default AnalyticsModal;