import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

export const AnalyticsIcon: React.FC<IconProps> = ({ size = 24, className, color = "currentColor" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M3 12L6 9L10 13L18 5" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M21 9V21H3V3H15" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <circle cx="18" cy="5" r="1.5" fill={color} opacity="0.6"/>
    <circle cx="10" cy="13" r="1.5" fill={color} opacity="0.6"/>
  </svg>
);

export const MachineLearningIcon: React.FC<IconProps> = ({ size = 24, className, color = "currentColor" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M12 2L15.5 8.5L22 12L15.5 15.5L12 22L8.5 15.5L2 12L8.5 8.5L12 2Z" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5" fill="none"/>
    <circle cx="12" cy="12" r="1" fill={color}/>
  </svg>
);

export const ExecutionIcon: React.FC<IconProps> = ({ size = 24, className, color = "currentColor" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M13 2L3 14H12L11 22L21 10H12L13 2Z" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      fill="none"
    />
    <path 
      d="M8 14L12 10" 
      stroke={color} 
      strokeWidth="1" 
      strokeLinecap="round" 
      opacity="0.6"
    />
  </svg>
);

export const RiskIcon: React.FC<IconProps> = ({ size = 24, className, color = "currentColor" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M12 2L21 7V17C21 17.5 20.8 18 20.4 18.4L12 22L3.6 18.4C3.2 18 3 17.5 3 17V7L12 2Z" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M12 8V16" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round"
    />
    <circle cx="12" cy="18" r="1" fill={color}/>
  </svg>
);

export const LatencyIcon: React.FC<IconProps> = ({ size = 24, className, color = "currentColor" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5"/>
    <path 
      d="M12 6V12L16 14" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M8 4L10 6" 
      stroke={color} 
      strokeWidth="1" 
      strokeLinecap="round" 
      opacity="0.6"
    />
    <path 
      d="M16 4L14 6" 
      stroke={color} 
      strokeWidth="1" 
      strokeLinecap="round" 
      opacity="0.6"
    />
  </svg>
);

export const GlobalIcon: React.FC<IconProps> = ({ size = 24, className, color = "currentColor" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5"/>
    <path 
      d="M12 2C14.5 4.5 16 8 16 12C16 16 14.5 19.5 12 22" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round"
    />
    <path 
      d="M12 2C9.5 4.5 8 8 8 12C8 16 9.5 19.5 12 22" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round"
    />
    <path 
      d="M2 12H22" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round"
    />
  </svg>
);