import type { AppProps } from 'next/app';
import { Global, css } from '@emotion/react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import FeedbackModal from '../components/modals/FeedbackModal';

const globalStyles = css`
  /* Revolutionary design system inline styles */
  
  /* Import elite NSA-level technical fonts */
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;500;600&display=swap');

  /* CSS Variables - Liquid Glass Financial Design */
  :root {
    /* Sophisticated Glass Palette */
    --color-glass-base: rgba(15, 35, 55, 0.85);       /* Deep blue glass base */
    --color-glass-surface: rgba(25, 45, 75, 0.60);    /* Medium blue glass surfaces */
    --color-glass-panel: rgba(35, 60, 95, 0.45);      /* Light blue glass panels */
    --color-glass-accent: rgba(0, 120, 204, 0.75);    /* Bloomberg accent glass */
    --color-glass-highlight: rgba(255, 255, 255, 0.08); /* Subtle white highlights */
    --color-glass-border: rgba(255, 255, 255, 0.15);  /* Glass borders */
    
    /* Glass Text Layers */
    --color-text-primary: rgba(255, 255, 255, 0.95);   /* High contrast through glass */
    --color-text-secondary: rgba(255, 255, 255, 0.75); /* Medium contrast through glass */
    --color-text-muted: rgba(255, 255, 255, 0.55);     /* Subtle text through glass */
    --color-text-accent: rgba(0, 180, 255, 0.90);      /* Accent text with transparency */
    
    /* Premium Glass Accents */
    --color-accent-gold: rgba(248, 179, 25, 0.85);     /* Translucent gold */
    --color-accent-amber: rgba(255, 176, 0, 0.80);     /* Glass amber emphasis */
    --color-accent-crystal: rgba(180, 220, 255, 0.25); /* Crystal blue accent */
    
    /* Financial Data with Glass Effect */
    --color-profit: rgba(0, 200, 100, 0.85);           /* Translucent green */
    --color-loss: rgba(255, 80, 80, 0.85);             /* Translucent red */
    --color-warning: rgba(255, 153, 0, 0.80);          /* Translucent orange */
    
    /* Typography - Elite NSA Technical Grade */
    --font-primary: "IBM Plex Mono", "SF Mono", "Monaco", "Consolas", monospace;
    --font-mono: "Space Mono", "SF Mono", "Monaco", "Consolas", monospace;
    --font-display: "Roboto Mono", "SF Mono", "Monaco", "Consolas", monospace;
    --font-data: "IBM Plex Mono", "SF Mono", "Monaco", "Consolas", monospace;
    
    /* Spacing */
    --space-quantum: 4px;
    --space-atom: 8px;
    --space-molecule: 16px;
    --space-solar: 32px;
    --space-galactic: 64px;
    
    /* Border Radius */
    --radius-small: 6px;
    --radius-medium: 12px;
    --radius-large: 24px;
    --radius-orbital: 50%;
    
    /* Animation Timing */
    --transition-smooth: 0.3s;
    --ease-spacecraft: cubic-bezier(0.4, 0, 0.2, 1);
    
    /* Liquid Glass Depth System */
    --glass-blur-subtle: blur(8px);
    --glass-blur-medium: blur(12px);  
    --glass-blur-strong: blur(20px);
    --glass-shadow-depth: 0 8px 32px rgba(0, 0, 0, 0.35);
    --glass-shadow-floating: 0 12px 48px rgba(0, 0, 0, 0.25);
    --glass-inset-highlight: inset 0 1px 0 rgba(255, 255, 255, 0.10);
  }

  /* Reset and base styles */
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: var(--font-primary);
    background: 
      /* Deep glass base layers */
      radial-gradient(ellipse at 30% 20%, rgba(0, 120, 204, 0.12) 0%, transparent 60%),
      radial-gradient(ellipse at 70% 80%, rgba(15, 35, 85, 0.15) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 50%, rgba(5, 25, 45, 0.90) 0%, rgba(10, 20, 35, 0.95) 100%),
      /* Depth layers */
      linear-gradient(135deg, rgba(25, 45, 75, 0.08) 0%, transparent 100%),
      linear-gradient(45deg, rgba(0, 80, 160, 0.04) 0%, transparent 100%);
    color: var(--color-text-primary);
    min-height: 100vh;
    overflow-x: hidden;
    position: relative;
    
    /* Subtle glass texture overlay */
    &::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.02) 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, rgba(0, 180, 255, 0.03) 0%, transparent 50%);
      background-size: 400px 400px, 300px 300px;
      background-position: 0 0, 200px 150px;
      pointer-events: none;
      z-index: -1;
    }
  }


  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: var(--color-glass-surface);
    backdrop-filter: var(--glass-blur-subtle);
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: var(--color-glass-accent);
    border-radius: 4px;
    border: 1px solid var(--color-glass-border);
    transition: all 0.3s ease;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: var(--color-accent-gold);
    box-shadow: var(--glass-shadow-depth);
  }

  /* Selection styles */
  ::selection {
    background: var(--color-glass-accent);
    color: var(--color-text-primary);
    backdrop-filter: var(--glass-blur-subtle);
  }

  ::-moz-selection {
    background: var(--color-glass-accent);
    color: var(--color-text-primary);
  }

  /* Accessibility */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
    
    body {
      animation: none !important;
    }
  }

  /* High contrast support */
  @media (prefers-contrast: high) {
    body {
      background: #000000;
      color: #ffffff;
    }
  }
`;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Global styles={globalStyles} />
        <Component {...pageProps} />
        <FeedbackModal />
      </ThemeProvider>
    </AuthProvider>
  );
}