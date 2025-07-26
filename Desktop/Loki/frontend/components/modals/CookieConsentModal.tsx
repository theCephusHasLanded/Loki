import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { NeomorphicSurface } from '../ui/NeomorphicSurface';

interface CookieConsentModalProps {
  onAccept: () => void;
  onDecline: () => void;
}

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
  background: var(--color-glass-base);
  backdrop-filter: var(--glass-blur-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ModalContainer = styled(motion.div)`
  max-width: 500px;
  width: 100%;
  background: var(--color-glass-surface);
  backdrop-filter: var(--glass-blur-strong);
  border: 1px solid var(--color-glass-border);
  border-radius: 16px;
  box-shadow: var(--glass-shadow-floating);
  overflow: hidden;
  position: relative;
  
  /* Liquid glass effects */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(255, 255, 255, 0.3) 50%, 
      transparent 100%);
    z-index: 1;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.02) 0%, 
      transparent 50%, 
      var(--color-glass-accent) 100%);
    pointer-events: none;
    z-index: 0;
  }
`;

const ModalContent = styled.div`
  position: relative;
  z-index: 2;
  padding: 32px;
  text-align: center;
`;

const Title = styled.h2`
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 16px 0;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const Description = styled.p`
  font-family: var(--font-primary);
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin: 0 0 24px 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
`;

const ActionButton = styled(motion.button, {
  shouldForwardProp: (prop) => prop !== 'variant'
})<{ variant: 'primary' | 'secondary' }>`
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 12px 24px;
  border-radius: 8px;
  border: 1px solid var(--color-glass-border);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  min-width: 120px;
  
  ${({ variant }) => variant === 'primary' ? `
    background: var(--color-accent-gold);
    color: var(--color-background-primary);
    
    &:hover {
      background: var(--color-accent-blue);
      transform: translateY(-2px);
      box-shadow: var(--glass-shadow-floating);
    }
  ` : `
    background: var(--color-glass-accent);
    color: var(--color-text-primary);
    backdrop-filter: var(--glass-blur-medium);
    
    &:hover {
      background: var(--color-glass-surface);
      transform: translateY(-2px);
      box-shadow: var(--glass-shadow-depth);
    }
  `}
  
  &:active {
    transform: translateY(0);
  }
`;

const CookieIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 16px;
  opacity: 0.8;
`;

export const CookieConsentModal: React.FC<CookieConsentModalProps> = ({
  onAccept,
  onDecline
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const hasConsent = localStorage.getItem('loki-cookie-consent');
    if (!hasConsent) {
      // Show modal after a brief delay
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('loki-cookie-consent', 'accepted');
    setIsVisible(false);
    onAccept();
  };

  const handleDecline = () => {
    localStorage.setItem('loki-cookie-consent', 'declined');
    setIsVisible(false);
    onDecline();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ModalContainer
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 200,
              duration: 0.4 
            }}
          >
            <ModalContent>
              <CookieIcon>🍪</CookieIcon>
              <Title>Cookie Consent</Title>
              <Description>
                LOKI 2032 uses cookies to enhance your trading experience, 
                analyze platform performance, and provide personalized AI insights. 
                Your data helps us improve our quantum-inspired interface and 
                astronomical market correlations.
              </Description>
              <ButtonContainer>
                <ActionButton
                  variant="primary"
                  onClick={handleAccept}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Accept All
                </ActionButton>
                <ActionButton
                  variant="secondary"
                  onClick={handleDecline}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Decline
                </ActionButton>
              </ButtonContainer>
            </ModalContent>
          </ModalContainer>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default CookieConsentModal;
