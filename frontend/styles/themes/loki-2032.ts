export const loki2032Theme = {
  colors: {
    // Primary Space-Maritime Blues
    spaceDeep: '#062c43',
    maritimeSteel: '#4f5b66',
    nebulaMist: '#5591a9',
    cosmicIce: '#ced7e0',
    voidBlack: '#101b39',
    hullMetal: '#333136',
    starlight: '#b4b1b8',
    
    // Interactive States
    profitMuted: '#4a7c59',
    lossMuted: '#7c4a59',
    warningAmber: '#b8860b',
    criticalRed: '#8b0000',
  },
  
  neumorphism: {
    lightSource: '135deg',
    shadowDark: 'rgba(0,0,0,0.25)',
    shadowLight: 'rgba(255,255,255,0.1)',
    surfaceBase: '#4f5b66',
  },
  
  typography: {
    primary: '"Space Grotesk", "SF Pro Display", system-ui',
    mono: '"JetBrains Mono", "Fira Code", monospace',
    display: '"Space Grotesk", sans-serif',
  },
  
  animations: {
    easeQuantum: [0.4, 0, 0.2, 1] as [number, number, number, number],
    durationFast: 0.2,
    durationMedium: 0.3,
    durationSlow: 0.5,
  }
};
