'use client';

import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const ModalContent = styled.div`
  padding: 2rem;
  color: var(--color-text-primary);
  background: var(--color-glass-surface);
  border-radius: 16px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 212, 255, 0.2);
  max-height: 80vh;
  overflow-y: auto;

  h2 {
    color: #00d4ff;
    font-size: 2rem;
    margin-bottom: 1rem;
    text-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
  }

  h3 {
    color: #ffd700;
    font-size: 1.4rem;
    margin: 1.5rem 0 1rem 0;
    border-bottom: 1px solid rgba(255, 215, 0, 0.3);
    padding-bottom: 0.5rem;
  }

  h4 {
    color: #00d4ff;
    margin: 1rem 0 0.5rem 0;
  }

  p {
    line-height: 1.6;
    margin-bottom: 1rem;
    color: #8892b0;
  }

  .step-list {
    list-style: none;
    padding: 0;
    margin: 1rem 0;

    li {
      padding: 0.5rem 0;
      border-bottom: 1px solid rgba(0, 212, 255, 0.1);
      position: relative;
      padding-left: 2rem;

      &:before {
        content: counter(step-counter);
        counter-increment: step-counter;
        position: absolute;
        left: 0;
        top: 0.5rem;
        background: #00d4ff;
        color: #0a0f1c;
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        font-weight: bold;
      }
    }
  }

  .cosmic-factors {
    background: rgba(0, 212, 255, 0.05);
    padding: 1rem;
    border-radius: 8px;
    border-left: 4px solid #00d4ff;
    margin: 1rem 0;

    p {
      margin: 0.5rem 0;
      font-size: 0.9rem;
    }
  }

  .example-box {
    background: rgba(255, 215, 0, 0.05);
    padding: 1rem;
    border-radius: 8px;
    border-left: 4px solid #ffd700;
    margin: 1rem 0;
  }

  .correlations {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
    margin: 1rem 0;

    .correlation-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem;
      background: rgba(0, 212, 255, 0.05);
      border-radius: 4px;
      font-size: 0.9rem;

      .event {
        color: #8892b0;
      }

      .cosmic {
        color: #00d4ff;
      }
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

interface GuideModalProps {
  content: string;
  onClose: () => void;
}

const GuideModal: React.FC<GuideModalProps> = ({ content, onClose }) => {
  const getModalContent = () => {
    switch (content) {
      case 'Creating Your First Cosmic Trade':
        return (
          <>
            <h2>Creating Your First Cosmic Trade</h2>
            <p>Learn to place intelligent trades using astrological timing and market analysis</p>
            
            <h3>OVERVIEW</h3>
            <p>LOKI 2032 combines traditional market analysis with cosmic intelligence to optimize your trading decisions. Every trade is enhanced by real-time astronomical data.</p>
            
            <h3>STEP-BY-STEP PROCESS</h3>
            <ol className="step-list" style={{ counterReset: 'step-counter' }}>
              <li>Select a prediction market from our curated list</li>
              <li>Analyze the current moon phase and planetary transits</li>
              <li>Check your personalized astrological timing score</li>
              <li>Review AI-generated cosmic confidence levels</li>
              <li>Enter your position size based on risk tolerance</li>
              <li>Confirm trade with cosmic timing optimization</li>
            </ol>
            
            <div className="cosmic-factors">
              <h4>COSMIC FACTORS</h4>
              <p><strong>Moon Phase:</strong> New moons favor new positions, full moons indicate volatility</p>
              <p><strong>Mercury Status:</strong> Avoid major trades during retrograde periods</p>
              <p><strong>Planetary Alignments:</strong> Conjunctions create market momentum</p>
              <p><strong>Your Birth Chart:</strong> Personal planetary transits affect decision making</p>
            </div>
            
            <h3>WORLD EVENT CORRELATIONS</h3>
            <div className="correlations">
              <div className="correlation-item">
                <span className="event">Presidential Election 2024</span>
                <span className="cosmic">Connected to Jupiter-Saturn alignments</span>
              </div>
              <div className="correlation-item">
                <span className="event">Federal Reserve Decisions</span>
                <span className="cosmic">Correlated with Mercury transits</span>
              </div>
              <div className="correlation-item">
                <span className="event">Major Tech Earnings</span>
                <span className="cosmic">Influenced by Uranus innovation cycles</span>
              </div>
              <div className="correlation-item">
                <span className="event">Global Economic Summits</span>
                <span className="cosmic">Timed with Pluto transformation periods</span>
              </div>
            </div>
            
            <div className="example-box">
              <h4>LIVE EXAMPLE</h4>
              <p>Example: "Will Bitcoin reach $100K by Q4 2025?" - Currently showing 67.5% probability with Venus in favorable aspect, suggesting bullish sentiment aligned with your Leo rising.</p>
            </div>
          </>
        );
      
      case 'IBM Watson AI Cosmic Analysis':
        return (
          <>
            <h2>IBM Watson AI Cosmic Analysis</h2>
            <p>Harness AI-powered astrological insights for advanced trading strategies</p>
            
            <h3>OVERVIEW</h3>
            <p>Our IBM Watson AI integration analyzes thousands of astrological patterns, world events, and market correlations to provide unprecedented trading intelligence.</p>
            
            <h3>STEP-BY-STEP PROCESS</h3>
            <ol className="step-list" style={{ counterReset: 'step-counter' }}>
              <li>Connect your birth data for personalized cosmic profile</li>
              <li>Ask Watson: "Analyze current market conditions"</li>
              <li>Review AI-generated astrological market forecast</li>
              <li>Get specific trade recommendations based on cosmic timing</li>
              <li>Monitor real-time alerts for favorable trading windows</li>
              <li>Track performance correlation with astrological events</li>
            </ol>
            
            <div className="cosmic-factors">
              <h4>COSMIC FACTORS</h4>
              <p><strong>Conjunctions:</strong> Planets align creating unified energy and market trends</p>
              <p><strong>Squares:</strong> 90° angles indicate tension and potential market volatility</p>
              <p><strong>Oppositions:</strong> 180° aspects create polarity and dramatic reversals</p>
              <p><strong>Trines:</strong> 120° harmonious aspects support smooth market movements</p>
            </div>
            
            <h3>WORLD EVENT CORRELATIONS</h3>
            <div className="correlations">
              <div className="correlation-item">
                <span className="event">Tesla Stock Predictions</span>
                <span className="cosmic">Elon Musk's natal chart transits analyzed</span>
              </div>
              <div className="correlation-item">
                <span className="event">Crypto Market Timing</span>
                <span className="cosmic">Saturn cycles correlate with regulatory changes</span>
              </div>
              <div className="correlation-item">
                <span className="event">Sports Betting Markets</span>
                <span className="cosmic">Team mascot astrological compatibility</span>
              </div>
              <div className="correlation-item">
                <span className="event">Political Outcomes</span>
                <span className="cosmic">Candidate birth chart analysis and electability</span>
              </div>
            </div>
            
            <div className="example-box">
              <h4>WATSON ANALYSIS</h4>
              <p>"Current Mars-Jupiter trine in your 2nd house of money suggests favorable trading conditions for growth-oriented positions. Avoid short positions during this 3-day window."</p>
            </div>
          </>
        );
      
      case 'Reading Cosmic Market Patterns':
        return (
          <>
            <h2>Reading Cosmic Market Patterns</h2>
            <p>Master the art of astrological pattern recognition in financial markets</p>
            
            <h3>OVERVIEW</h3>
            <p>Learn to identify powerful astrological patterns that historically correlate with significant market movements and world events.</p>
            
            <h3>STEP-BY-STEP PROCESS</h3>
            <ol className="step-list" style={{ counterReset: 'step-counter' }}>
              <li>Study major planetary cycles and their market impact</li>
              <li>Identify your optimal trading days based on personal transits</li>
              <li>Track lunar cycles and volatility patterns</li>
              <li>Monitor eclipse periods for major market shifts</li>
              <li>Use retrograde periods for position adjustments</li>
              <li>Apply cosmic timing to entry and exit strategies</li>
            </ol>
            
            <div className="cosmic-factors">
              <h4>COSMIC FACTORS</h4>
              <p><strong>Solar Eclipses:</strong> Major beginnings, often coincide with market tops/bottoms</p>
              <p><strong>Lunar Eclipses:</strong> Emotional releases, increased volatility periods</p>
              <p><strong>Saturn Returns:</strong> 29-year cycles affecting long-term market structures</p>
              <p><strong>Jupiter-Saturn Conjunctions:</strong> 20-year cycles marking major economic shifts</p>
            </div>
            
            <h3>WORLD EVENT CORRELATIONS</h3>
            <div className="correlations">
              <div className="correlation-item">
                <span className="event">2008 Financial Crisis</span>
                <span className="cosmic">Pluto entering Capricorn (transformation of systems)</span>
              </div>
              <div className="correlation-item">
                <span className="event">COVID-19 Market Crash</span>
                <span className="cosmic">Saturn-Pluto conjunction in Capricorn</span>
              </div>
              <div className="correlation-item">
                <span className="event">GameStop Short Squeeze</span>
                <span className="cosmic">Aquarius stellium (revolutionary group action)</span>
              </div>
              <div className="correlation-item">
                <span className="event">FTX Collapse</span>
                <span className="cosmic">Mars retrograde in Gemini (communication/trust issues)</span>
              </div>
            </div>
            
            <div className="example-box">
              <h4>PATTERN ALERT</h4>
              <p>Upcoming Venus-Mars conjunction in Scorpio suggests intense activity in luxury goods and beauty industry stocks. Historical data shows 73% accuracy in related market movements.</p>
            </div>
          </>
        );
      
      case 'World Events & Cosmic Correlations':
        return (
          <>
            <h2>World Events & Cosmic Correlations</h2>
            <p>Connect global happenings with astrological cycles for predictive trading</p>
            
            <h3>OVERVIEW</h3>
            <p>Understand how major world events correlate with astrological cycles, giving you predictive insights into market-moving news before it happens.</p>
            
            <h3>STEP-BY-STEP PROCESS</h3>
            <ol className="step-list" style={{ counterReset: 'step-counter' }}>
              <li>Monitor planetary transits affecting world leader birth charts</li>
              <li>Track eclipse cycles and their historical event correlations</li>
              <li>Analyze collective planetary aspects for social trends</li>
              <li>Correlate natural disasters with astrological patterns</li>
              <li>Study geopolitical tensions through Mars cycles</li>
              <li>Predict economic policy changes via Saturn transits</li>
            </ol>
            
            <div className="cosmic-factors">
              <h4>COSMIC FACTORS</h4>
              <p><strong>Outer Planet Transits:</strong> Generational changes affecting long-term trends</p>
              <p><strong>Cardinal Crosses:</strong> Crisis points requiring decisive action</p>
              <p><strong>Mutable T-Squares:</strong> Communication breakdowns and adaptability needs</p>
              <p><strong>Fixed Grand Crosses:</strong> Resistance to change creating market tension</p>
            </div>
            
            <h3>WORLD EVENT CORRELATIONS</h3>
            <div className="correlations">
              <div className="correlation-item">
                <span className="event">Russia-Ukraine Conflict</span>
                <span className="cosmic">Mars-Pluto aspects affecting energy markets</span>
              </div>
              <div className="correlation-item">
                <span className="event">China Economic Policy</span>
                <span className="cosmic">President Xi's Saturn return cycle</span>
              </div>
              <div className="correlation-item">
                <span className="event">US Elections</span>
                <span className="cosmic">Candidate compatibility with national birth chart</span>
              </div>
              <div className="correlation-item">
                <span className="event">Climate Events</span>
                <span className="cosmic">Uranus in Earth signs correlating with natural disasters</span>
              </div>
            </div>
            
            <div className="example-box">
              <h4>CURRENT INSIGHT</h4>
              <p>Mercury retrograde in Capricorn (Dec 2024) suggests potential delays in government economic decisions. Position accordingly in policy-sensitive markets like healthcare and energy.</p>
            </div>
          </>
        );
      
      case 'Advanced Cosmic Trading Strategies':
        return (
          <>
            <h2>Advanced Cosmic Trading Strategies</h2>
            <p>Professional-level techniques combining technical analysis with astrological timing</p>
            
            <h3>OVERVIEW</h3>
            <p>Develop sophisticated trading strategies that layer traditional financial analysis with precise astrological timing for maximum market advantage.</p>
            
            <h3>STEP-BY-STEP PROCESS</h3>
            <ol className="step-list" style={{ counterReset: 'step-counter' }}>
              <li>Combine technical indicators with lunar cycle timing</li>
              <li>Use planetary hours for optimal trade execution</li>
              <li>Apply void-of-course moon rules for market entry</li>
              <li>Integrate solar return charts for annual strategy planning</li>
              <li>Employ electional astrology for major position changes</li>
              <li>Create cosmic portfolio allocation based on element balance</li>
            </ol>
            
            <div className="cosmic-factors">
              <h4>COSMIC FACTORS</h4>
              <p><strong>Planetary Hours:</strong> Each hour ruled by different planet affecting trade success</p>
              <p><strong>Void Moon Periods:</strong> Times when markets drift without clear direction</p>
              <p><strong>Planetary Dignities:</strong> Planets in their strongest signs boost related sectors</p>
              <p><strong>Retrograde Strategies:</strong> Different approaches for each retrograde planet</p>
            </div>
            
            <h3>WORLD EVENT CORRELATIONS</h3>
            <div className="correlations">
              <div className="correlation-item">
                <span className="event">Tech Sector Timing</span>
                <span className="cosmic">Uranus transits for innovation breakthrough predictions</span>
              </div>
              <div className="correlation-item">
                <span className="event">Banking Sector</span>
                <span className="cosmic">Saturn cycles correlating with regulatory changes</span>
              </div>
              <div className="correlation-item">
                <span className="event">Energy Markets</span>
                <span className="cosmic">Mars cycles affecting oil and gas price volatility</span>
              </div>
              <div className="correlation-item">
                <span className="event">Precious Metals</span>
                <span className="cosmic">Venus cycles influencing gold and silver trends</span>
              </div>
            </div>
            
            <div className="example-box">
              <h4>ADVANCED STRATEGY</h4>
              <p>Layer Fibonacci retracements with lunar mansions for precision entry points. Current setup shows BTC at 61.8% retracement coinciding with favorable 2nd lunar mansion for wealth accumulation.</p>
            </div>
          </>
        );
      
      case 'Cosmic Risk Management':
        return (
          <>
            <h2>Cosmic Risk Management</h2>
            <p>Protect your capital using astrological risk assessment and position sizing</p>
            
            <h3>OVERVIEW</h3>
            <p>Learn to manage risk using cosmic intelligence, adjusting position sizes and stop-losses based on astrological volatility indicators.</p>
            
            <h3>STEP-BY-STEP PROCESS</h3>
            <ol className="step-list" style={{ counterReset: 'step-counter' }}>
              <li>Calculate position size based on current lunar phase volatility</li>
              <li>Set stop-losses considering planetary aspect patterns</li>
              <li>Adjust portfolio allocation for eclipse season protection</li>
              <li>Use cosmic diversification across astrological elements</li>
              <li>Implement planetary transit-based rebalancing</li>
              <li>Apply birth chart risk tolerance analysis</li>
            </ol>
            
            <div className="cosmic-factors">
              <h4>COSMIC FACTORS</h4>
              <p><strong>High Risk Periods:</strong> Eclipse seasons, Mars retrograde, Mercury combust</p>
              <p><strong>Low Risk Periods:</strong> Stable earth sign transits, harmonious Venus aspects</p>
              <p><strong>Volatility Indicators:</strong> Mutable sign emphasis, outer planet hard aspects</p>
              <p><strong>Stability Factors:</strong> Fixed sign dominance, trine and sextile patterns</p>
            </div>
            
            <h3>WORLD EVENT CORRELATIONS</h3>
            <div className="correlations">
              <div className="correlation-item">
                <span className="event">Market Crash Prediction</span>
                <span className="cosmic">Saturn-Pluto conjunctions every 35 years</span>
              </div>
              <div className="correlation-item">
                <span className="event">Black Swan Events</span>
                <span className="cosmic">Uranus-Pluto aspects creating sudden disruption</span>
              </div>
              <div className="correlation-item">
                <span className="event">Currency Crises</span>
                <span className="cosmic">Neptune transits dissolving financial structures</span>
              </div>
              <div className="correlation-item">
                <span className="event">Bull Market Peaks</span>
                <span className="cosmic">Jupiter-Uranus conjunctions marking euphoria tops</span>
              </div>
            </div>
            
            <div className="example-box">
              <h4>RISK ALERT</h4>
              <p>Approaching Mars-Saturn square suggests market tension. Reduce position sizes by 25% and avoid new leveraged positions for next 5 trading days. Historical accuracy: 81%.</p>
            </div>
          </>
        );
      
      default:
        return (
          <div>
            <h2>Cosmic Trading Guide</h2>
            <p>Select a specific guide to learn more about cosmic trading strategies.</p>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <ModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>
        {getModalContent()}
      </ModalContent>
    </motion.div>
  );
};

export default GuideModal;
