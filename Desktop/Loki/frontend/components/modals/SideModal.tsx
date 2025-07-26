import React from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';

interface SideModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
  position?: string;
  size?: string;
  title?: string;
}

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-glass-base);
  backdrop-filter: var(--glass-blur-strong);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContainer = styled(motion.div)<{ width: string }>`
  background: var(--color-glass-base);
  backdrop-filter: var(--glass-blur-strong) saturate(180%);
  border: 1px solid var(--color-glass-border);
  border-radius: 20px;
  padding: 32px;
  width: ${props => props.width};
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 
    var(--glass-shadow-floating),
    0 0 60px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  
  position: relative;
  z-index: 1;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.2s ease;
  
  &:hover {
    color: var(--color-text-primary);
  }
`;

export const SideModal: React.FC<SideModalProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  width = '600px',
  position,
  size,
  title
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContainer
            width={width}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton onClick={onClose}>×</CloseButton>
            {children}
          </ModalContainer>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default SideModal;
