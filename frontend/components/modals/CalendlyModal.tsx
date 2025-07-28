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
  width: 100%;
  max-width: 900px;

  h2 {
    color: #00d4ff;
    font-size: 2rem;
    margin-bottom: 1rem;
    text-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
    text-align: center;
  }

  p {
    line-height: 1.6;
    margin-bottom: 1rem;
    color: #8892b0;
    text-align: center;
  }

  .calendly-container {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 12px;
    padding: 1rem;
    margin-top: 1rem;
    min-height: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .calendly-iframe {
    width: 100%;
    height: 600px;
    border: none;
    border-radius: 8px;
  }

  .loading-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #666;
    font-size: 1.1rem;
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
  z-index: 10;
  
  &:hover {
    background: rgba(0, 212, 255, 0.1);
  }
`;

interface CalendlyModalProps {
  onClose: () => void;
}

const CalendlyModal: React.FC<CalendlyModalProps> = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <ModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>
        
        <h2>Schedule a Chat with Christina</h2>
        <p>
          Ready to explore how LOKI 2032's cosmic intelligence can transform your trading? 
          Book a personalized consultation to discuss your investment goals and cosmic trading strategies.
        </p>
        
        <div className="calendly-container">
          <iframe
            className="calendly-iframe"
            src="https://calendly.com/christinacephus-pursuit/lkhntech?month=2025-07"
            title="Schedule a consultation with Christina"
            loading="lazy"
          />
          <div className="loading-text">
            Loading Calendly...
          </div>
        </div>
      </ModalContent>
    </motion.div>
  );
};

export default CalendlyModal;
