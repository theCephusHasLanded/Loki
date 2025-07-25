import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { NeomorphicSurface } from '../loki-2032/NeomorphicSurface';

type ModalPosition = 'left' | 'right' | 'top' | 'bottom';
type ModalSize = 'small' | 'medium' | 'large' | 'full';

interface SideModalProps {
  isOpen: boolean;
  onClose: () => void;
  position?: ModalPosition;
  size?: ModalSize;
  title?: string;
  children: React.ReactNode;
  backdrop?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
}

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: var(--color-glass-base);
  backdrop-filter: var(--glass-blur-strong);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContainer = styled(motion.div)<{ 
  position: ModalPosition; 
  size: ModalSize;
}>`
  position: absolute;
  background: var(--color-glass-surface);
  backdrop-filter: var(--glass-blur-strong);
  border: 1px solid var(--color-glass-border);
  box-shadow: var(--glass-shadow-floating);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  
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
  
  /* Position-based styles */
  ${({ position, size }) => {
    const dimensions = {
      small: '320px',
      medium: '480px', 
      large: '640px',
      full: '90vw'
    };
    
    switch (position) {
      case 'left':
        return `
          top: 0;
          left: 0;
          bottom: 0;
          width: ${dimensions[size]};
          max-width: ${size === 'full' ? '90vw' : '50vw'};
          border-radius: 0 16px 16px 0;
        `;
      case 'right':
        return `
          top: 0;
          right: 0;
          bottom: 0;
          width: ${dimensions[size]};
          max-width: ${size === 'full' ? '90vw' : '50vw'};
          border-radius: 16px 0 0 16px;
        `;
      case 'top':
        return `
          top: 0;
          left: 0;
          right: 0;
          height: ${dimensions[size]};
          max-height: ${size === 'full' ? '90vh' : '50vh'};
          border-radius: 0 0 16px 16px;
        `;
      case 'bottom':
        return `
          bottom: 0;
          left: 0;
          right: 0;
          height: ${dimensions[size]};
          max-height: ${size === 'full' ? '90vh' : '50vh'};
          border-radius: 16px 16px 0 0;
        `;
    }
  }}
  
  @media (max-width: 768px) {
    ${({ position }) => {
      switch (position) {
        case 'left':
        case 'right':
          return `
            width: 90vw;
            max-width: 90vw;
          `;
        case 'top':
        case 'bottom':
          return `
            height: 80vh;
            max-height: 80vh;
          `;
      }
    }}
  }
`;

const ModalHeader = styled.div`
  position: relative;
  z-index: 2;
  padding: 24px 32px 20px;
  border-bottom: 1px solid var(--color-glass-border);
  background: var(--color-glass-panel);
  backdrop-filter: var(--glass-blur-medium);
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  h2 {
    font-family: var(--font-display);
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-variant-numeric: tabular-nums;
  }
`;

const CloseButton = styled(motion.button)`
  background: var(--color-glass-accent);
  backdrop-filter: var(--glass-blur-subtle);
  border: 1px solid var(--color-glass-border);
  border-radius: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-text-primary);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--color-accent-gold);
    transform: scale(1.05);
    box-shadow: var(--glass-shadow-depth);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const ModalContent = styled.div`
  position: relative;
  z-index: 2;
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--color-glass-surface);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--color-glass-accent);
    border-radius: 3px;
    border: 1px solid var(--color-glass-border);
  }
`;

export const SideModal: React.FC<SideModalProps> = ({
  isOpen,
  onClose,
  position = 'right',
  size = 'medium',
  title,
  children,
  backdrop = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
}) => {
  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const getModalVariants = () => {
    switch (position) {
      case 'left':
        return {
          initial: { x: '-100%', opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: '-100%', opacity: 0 }
        };
      case 'right':
        return {
          initial: { x: '100%', opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: '100%', opacity: 0 }
        };
      case 'top':
        return {
          initial: { y: '-100%', opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: '-100%', opacity: 0 }
        };
      case 'bottom':
        return {
          initial: { y: '100%', opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: '100%', opacity: 0 }
        };
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnBackdrop) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleBackdropClick}
        >
          <ModalContainer
            position={position}
            size={size}
            variants={getModalVariants()}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 200,
              duration: 0.4 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <ModalHeader>
                <h2>{title}</h2>
                <CloseButton
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ×
                </CloseButton>
              </ModalHeader>
            )}
            
            <ModalContent>
              {children}
            </ModalContent>
          </ModalContainer>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default SideModal;