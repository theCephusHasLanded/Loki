import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'space-maritime' | 'cosmic-ice' | 'void-black' | 'quantum-glow';

interface ThemeColors {
  glassBase: string;
  glassSurface: string;
  glassPanel: string;
  glassAccent: string;
  glassHighlight: string;
  glassBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textAccent: string;
  accentGold: string;
  accentAmber: string;
  accentCrystal: string;
  profit: string;
  loss: string;
  warning: string;
}

const themeDefinitions: Record<Theme, ThemeColors> = {
  'space-maritime': {
    glassBase: 'rgba(15, 35, 55, 0.85)',
    glassSurface: 'rgba(25, 45, 75, 0.60)',
    glassPanel: 'rgba(35, 60, 95, 0.45)',
    glassAccent: 'rgba(0, 120, 204, 0.75)',
    glassHighlight: 'rgba(255, 255, 255, 0.08)',
    glassBorder: 'rgba(255, 255, 255, 0.15)',
    textPrimary: 'rgba(255, 255, 255, 0.95)',
    textSecondary: 'rgba(255, 255, 255, 0.75)',
    textMuted: 'rgba(255, 255, 255, 0.55)',
    textAccent: 'rgba(0, 180, 255, 0.90)',
    accentGold: 'rgba(248, 179, 25, 0.85)',
    accentAmber: 'rgba(255, 176, 0, 0.80)',
    accentCrystal: 'rgba(180, 220, 255, 0.25)',
    profit: 'rgba(0, 200, 100, 0.85)',
    loss: 'rgba(255, 80, 80, 0.85)',
    warning: 'rgba(255, 153, 0, 0.80)',
  },
  'cosmic-ice': {
    glassBase: 'rgba(200, 220, 240, 0.85)',
    glassSurface: 'rgba(180, 200, 230, 0.60)',
    glassPanel: 'rgba(160, 180, 210, 0.45)',
    glassAccent: 'rgba(100, 150, 255, 0.75)',
    glassHighlight: 'rgba(255, 255, 255, 0.15)',
    glassBorder: 'rgba(100, 150, 255, 0.25)',
    textPrimary: 'rgba(20, 40, 80, 0.95)',
    textSecondary: 'rgba(40, 60, 100, 0.75)',
    textMuted: 'rgba(80, 100, 140, 0.65)',
    textAccent: 'rgba(60, 120, 200, 0.90)',
    accentGold: 'rgba(255, 200, 50, 0.85)',
    accentAmber: 'rgba(255, 180, 0, 0.80)',
    accentCrystal: 'rgba(120, 180, 255, 0.35)',
    profit: 'rgba(0, 180, 80, 0.85)',
    loss: 'rgba(220, 60, 60, 0.85)',
    warning: 'rgba(255, 140, 0, 0.80)',
  },
  'void-black': {
    glassBase: 'rgba(5, 5, 10, 0.95)',
    glassSurface: 'rgba(15, 15, 25, 0.70)',
    glassPanel: 'rgba(25, 25, 35, 0.55)',
    glassAccent: 'rgba(100, 100, 150, 0.75)',
    glassHighlight: 'rgba(255, 255, 255, 0.05)',
    glassBorder: 'rgba(100, 100, 150, 0.20)',
    textPrimary: 'rgba(255, 255, 255, 0.98)',
    textSecondary: 'rgba(200, 200, 220, 0.80)',
    textMuted: 'rgba(150, 150, 170, 0.60)',
    textAccent: 'rgba(150, 150, 255, 0.90)',
    accentGold: 'rgba(255, 200, 100, 0.85)',
    accentAmber: 'rgba(255, 180, 50, 0.80)',
    accentCrystal: 'rgba(150, 150, 255, 0.25)',
    profit: 'rgba(100, 255, 150, 0.85)',
    loss: 'rgba(255, 100, 100, 0.85)',
    warning: 'rgba(255, 200, 100, 0.80)',
  },
  'quantum-glow': {
    glassBase: 'rgba(80, 20, 120, 0.85)',
    glassSurface: 'rgba(100, 40, 140, 0.60)',
    glassPanel: 'rgba(120, 60, 160, 0.45)',
    glassAccent: 'rgba(180, 100, 255, 0.75)',
    glassHighlight: 'rgba(255, 200, 255, 0.10)',
    glassBorder: 'rgba(180, 100, 255, 0.25)',
    textPrimary: 'rgba(255, 240, 255, 0.95)',
    textSecondary: 'rgba(230, 200, 255, 0.75)',
    textMuted: 'rgba(200, 180, 230, 0.55)',
    textAccent: 'rgba(200, 120, 255, 0.90)',
    accentGold: 'rgba(255, 200, 100, 0.85)',
    accentAmber: 'rgba(255, 150, 200, 0.80)',
    accentCrystal: 'rgba(200, 150, 255, 0.35)',
    profit: 'rgba(150, 255, 150, 0.85)',
    loss: 'rgba(255, 120, 150, 0.85)',
    warning: 'rgba(255, 180, 100, 0.80)',
  },
};

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>('space-maritime');

  const setTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    // Apply theme to CSS variables
    const colors = themeDefinitions[theme];
    const root = document.documentElement;
    
    Object.entries(colors).forEach(([key, value]) => {
      const cssVarName = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVarName, value);
    });
  };

  // Initialize theme on mount
  useEffect(() => {
    setTheme(currentTheme);
  }, [currentTheme]);

  const value: ThemeContextType = {
    currentTheme,
    setTheme,
    colors: themeDefinitions[currentTheme],
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};