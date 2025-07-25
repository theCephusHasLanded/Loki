import React from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { loki2032Theme } from '../../styles/themes/loki-2032';

interface NeomorphicSurfaceProps {
  depth?: 'subtle' | 'medium' | 'deep';
  material?: 'space-metal' | 'ice-crystal' | 'void';
  interactive?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
  whileHover?: any;
}

const StyledSurface = styled(motion.div, {
  shouldForwardProp: (prop) => !['depth', 'material', 'interactive'].includes(prop as string)
})<NeomorphicSurfaceProps>`
  /* Liquid Glass Base */
  background: ${({ material, depth }) => {
    const opacity = depth === 'deep' ? '0.45' : depth === 'subtle' ? '0.65' : '0.55';
    switch (material) {
      case 'ice-crystal': 
        return `linear-gradient(135deg, 
          rgba(180, 220, 255, ${opacity}) 0%, 
          rgba(120, 180, 240, ${parseFloat(opacity) - 0.1}) 100%)`;
      case 'void': 
        return `var(--color-glass-base)`;
      default: 
        return `var(--color-glass-surface)`;
    }
  }};
  
  /* Glass Effects */
  backdrop-filter: ${({ depth }) => {
    switch (depth) {
      case 'deep': return 'var(--glass-blur-strong)';
      case 'subtle': return 'var(--glass-blur-subtle)';
      default: return 'var(--glass-blur-medium)';
    }
  }};
  
  border: 1px solid var(--color-glass-border);
  border-radius: ${({ depth }) => {
    switch (depth) {
      case 'subtle': return '8px';
      case 'deep': return '16px';
      default: return '12px';
    }
  }};
  
  /* Liquid Glass Shadow System */
  box-shadow: 
    var(--glass-shadow-depth),
    var(--glass-inset-highlight),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
  
  /* Subtle glass refraction */
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(255, 255, 255, 0.2) 50%, 
      transparent 100%);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -50%;
    width: 200%;
    height: 100%;
    background: linear-gradient(45deg, 
      transparent 40%, 
      rgba(255, 255, 255, 0.03) 50%, 
      transparent 60%);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.6s ease;
  }
  
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  ${({ interactive }) => interactive && `
    cursor: pointer;
    
    &:hover {
      transform: translateY(-3px) scale(1.01);
      box-shadow: 
        var(--glass-shadow-floating),
        var(--glass-inset-highlight),
        inset 0 -1px 0 rgba(0, 0, 0, 0.1);
      border-color: rgba(255, 255, 255, 0.25);
      
      &::after {
        opacity: 1;
      }
    }
    
    &:active {
      transform: translateY(-1px) scale(1.005);
      transition-duration: 0.1s;
    }
  `}
`;

export const NeomorphicSurface: React.FC<NeomorphicSurfaceProps> = ({
  depth = 'medium',
  material = 'space-metal',
  interactive = false,
  children,
  className,
  style,
  initial,
  animate,
  exit,
  transition,
  whileHover,
  ...props
}) => {
  return (
    <StyledSurface
      depth={depth}
      material={material}
      interactive={interactive}
      className={className}
      style={style}
      initial={initial || { opacity: 0, y: 20 }}
      animate={animate || { opacity: 1, y: 0 }}
      exit={exit}
      transition={transition || { duration: 0.5, ease: 'easeOut' }}
      whileHover={whileHover}
      {...props}
    >
      {children}
    </StyledSurface>
  );
};
