import React from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';

const ConstellationSVG = styled(motion.svg)`
  filter: drop-shadow(0 0 20px rgba(32, 178, 170, 0.4));
  cursor: pointer;
  
  &:hover {
    filter: drop-shadow(0 0 30px rgba(32, 178, 170, 0.6));
  }
`;

export const LokiConstellation: React.FC<{
  animated?: boolean;
  size?: number;
}> = ({ animated = true, size = 48 }) => {
  return (
    <ConstellationSVG
      width={size}
      height={size}
      viewBox="0 0 100 100"
      initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      whileHover={{ scale: 1.05, rotate: 5 }}
    >
      {/* Background cosmic glow */}
      <defs>
        <radialGradient id="cosmicGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(32, 178, 170, 0.3)" />
          <stop offset="70%" stopColor="rgba(106, 90, 205, 0.2)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        
        <filter id="starGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Background glow */}
      <circle cx="50" cy="50" r="45" fill="url(#cosmicGlow)" opacity="0.6" />
      
      {/* LOKI constellation pattern */}
      {/* Main stars */}
      <motion.circle
        cx="20" cy="25" r="2.5"
        fill="var(--color-starlight)"
        filter="url(#starGlow)"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: animated ? [0, 1, 0.8, 1] : 1,
          scale: animated ? [0, 1.2, 1] : 1 
        }}
        transition={{ duration: 2, repeat: Infinity, delay: 0 }}
      />
      <motion.circle
        cx="50" cy="15" r="3"
        fill="var(--color-quantum-glow)"
        filter="url(#starGlow)"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: animated ? [0, 1, 0.9, 1] : 1,
          scale: animated ? [0, 1.3, 1] : 1 
        }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
      />
      <motion.circle
        cx="80" cy="30" r="2"
        fill="var(--color-cosmic-ice)"
        filter="url(#starGlow)"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: animated ? [0, 1, 0.7, 1] : 1,
          scale: animated ? [0, 1.1, 1] : 1 
        }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
      />
      <motion.circle
        cx="25" cy="55" r="2.5"
        fill="var(--color-ai-insight)"
        filter="url(#starGlow)"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: animated ? [0, 1, 0.8, 1] : 1,
          scale: animated ? [0, 1.2, 1] : 1 
        }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}
      />
      <motion.circle
        cx="70" cy="70" r="2.2"
        fill="var(--color-nebula-mist)"
        filter="url(#starGlow)"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: animated ? [0, 1, 0.6, 1] : 1,
          scale: animated ? [0, 1.15, 1] : 1 
        }}
        transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
      />
      
      {/* Secondary stars for detail */}
      <motion.circle
        cx="35" cy="40" r="1.5"
        fill="var(--color-starlight)"
        opacity="0.7"
        initial={{ opacity: 0 }}
        animate={{ opacity: animated ? [0, 0.7, 0.4, 0.7] : 0.7 }}
        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
      />
      <motion.circle
        cx="60" cy="45" r="1.2"
        fill="var(--color-cosmic-ice)"
        opacity="0.6"
        initial={{ opacity: 0 }}
        animate={{ opacity: animated ? [0, 0.6, 0.3, 0.6] : 0.6 }}
        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
      />
      
      {/* Constellation connecting lines */}
      <motion.path
        d="M20,25 L50,15 L80,30 M50,15 L25,55 L70,70 M25,55 L35,40 M60,45 L70,70"
        stroke="var(--color-quantum-glow)"
        strokeWidth="0.8"
        fill="none"
        opacity="0.4"
        strokeDasharray="2,3"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ 
          pathLength: 1, 
          opacity: animated ? [0, 0.4, 0.6, 0.4] : 0.4 
        }}
        transition={{ duration: 3, ease: "easeInOut", delay: 1.5 }}
      />
      
      {/* Central LOKI symbol */}
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <circle 
          cx="50" 
          cy="50" 
          r="8" 
          fill="none" 
          stroke="var(--color-ai-insight)" 
          strokeWidth="2"
          opacity="0.8"
        />
        <motion.circle 
          cx="50" 
          cy="50" 
          r="4" 
          fill="var(--color-quantum-glow)"
          opacity="0.6"
          animate={animated ? {
            scale: [1, 1.2, 1],
            opacity: [0.6, 0.8, 0.6]
          } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Rotating orbital rings */}
        <motion.circle 
          cx="50" 
          cy="50" 
          r="12" 
          fill="none" 
          stroke="var(--color-starlight)" 
          strokeWidth="0.5"
          opacity="0.3"
          strokeDasharray="8,4"
          animate={animated ? { rotate: 360 } : {}}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: '50px 50px' }}
        />
        <motion.circle 
          cx="50" 
          cy="50" 
          r="15" 
          fill="none" 
          stroke="var(--color-cosmic-ice)" 
          strokeWidth="0.3"
          opacity="0.2"
          strokeDasharray="12,6"
          animate={animated ? { rotate: -360 } : {}}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: '50px 50px' }}
        />
      </motion.g>
      
      {/* Quantum particles */}
      {animated && (
        <g opacity="0.6">
          <motion.circle
            cx="30"
            cy="30"
            r="0.8"
            fill="var(--color-quantum-glow)"
            animate={{
              cx: [30, 70, 30],
              cy: [30, 70, 30],
              opacity: [0, 1, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, delay: 0 }}
          />
          <motion.circle
            cx="70"
            cy="30"
            r="0.6"
            fill="var(--color-ai-insight)"
            animate={{
              cx: [70, 30, 70],
              cy: [30, 70, 30],
              opacity: [0, 1, 0]
            }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          />
          <motion.circle
            cx="50"
            cy="80"
            r="0.7"
            fill="var(--color-starlight)"
            animate={{
              cx: [50, 20, 50],
              cy: [80, 20, 80],
              opacity: [0, 1, 0]
            }}
            transition={{ duration: 4.5, repeat: Infinity, delay: 2 }}
          />
        </g>
      )}
    </ConstellationSVG>
  );
};