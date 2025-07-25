export const appKnowledgeBase = {
  appName: "LOKI 2032",
  description: "Institutional Trading Platform",
  
  overview: `LOKI 2032 is a sophisticated liquid glass financial trading interface designed for institutional investors, hedge funds, and professional traders. It features cutting-edge glassmorphism design with real-time market data, AI-powered insights, and Bloomberg Terminal-inspired functionality.`,

  keyFeatures: {
    "Advanced Analytics": "Institutional-grade data processing with real-time market intelligence using sophisticated chart visualizations and trend analysis",
    "Machine Learning": "Quantitative models with confidence intervals and risk assessment powered by AI algorithms that analyze market patterns",
    "Smart Execution": "Algorithmic order routing with optimal execution strategies designed for high-frequency trading and institutional capital deployment",
    "Risk Management": "Real-time position monitoring with dynamic hedging protocols to protect against market volatility",
    "Ultra-Low Latency": "Sub-millisecond execution with direct market access infrastructure for competitive trading advantages",
    "Global Markets": "Multi-asset class coverage across international exchanges including equities, crypto, forex, and derivatives"
  },

  technicalSpecs: {
    "Design System": "Liquid glass aesthetic with layered transparency, sophisticated glassmorphism effects, and Bloomberg Terminal-inspired elements",
    "Typography": "JetBrains Mono font family with reduced weight (300-600) for optimal readability in trading environments",
    "Color Palette": "Professional RGBA-based glass colors with institutional blue foundations and financial data color standards",
    "Themes": ["Space Maritime (default)", "Cosmic Ice", "Void Black", "Quantum Glow"],
    "Real-time Data": "Live stock ticker with animated scrolling, updating every 3 seconds with simulated market movements",
    "Performance": "Hardware-accelerated animations, GPU-optimized rendering, and responsive design for multi-monitor setups"
  },

  components: {
    "Market Cards": "Interactive trading cards displaying market predictions with AI confidence indicators, real-time pricing, volume bars, and action buttons",
    "Real-time Ticker": "Continuously scrolling market data feed with live price updates for major indices, stocks, and cryptocurrencies",
    "Control Panel": "Theme switching interface with performance settings and system controls",
    "Status Bar": "Bloomberg Terminal-style bottom bar showing system status, latency metrics, P&L, and UTC time",
    "Glass Surfaces": "Sophisticated neumorphic surfaces with backdrop blur, layered transparency, and interactive hover effects"
  },

  userInterface: {
    "Interaction Design": "Smooth scale transformations, floating lift animations, glass refraction effects, and haptic feedback simulation",
    "Navigation": "Intuitive layout with fixed positioning for critical trading tools and responsive design for all screen sizes",
    "Accessibility": "High contrast support, reduced motion preferences, and keyboard navigation compatibility",
    "Mobile Support": "Responsive design with optimized layouts for tablets and mobile trading on the go"
  },

  marketData: {
    "Supported Assets": "Stocks (SPY, QQQ, AAPL, GOOGL, TSLA, MSFT, AMZN, NVDA), Cryptocurrencies (BTC, ETH), and traditional indices",
    "Data Updates": "Real-time price simulation with realistic market movement patterns and volatility modeling",
    "Prediction Markets": "Specialized interface for trading on future events including Bitcoin price targets, earnings predictions, and Federal Reserve decisions"
  },

  targetAudience: {
    "Primary": "Institutional investors, hedge funds, quantitative trading firms, and professional day traders",
    "Secondary": "Financial analysts, portfolio managers, and sophisticated retail traders with institutional-level requirements",
    "Use Cases": "High-frequency trading, algorithmic execution, risk management, market analysis, and portfolio optimization"
  },

  installation: {
    "Requirements": "Node.js, Next.js 14+, React 18+, TypeScript, Emotion styling",
    "Setup": "Standard Next.js development server on port 3001 with hot reloading and TypeScript support",
    "Deployment": "Optimized for institutional environments with custom domain support and enterprise security"
  }
};

export const getRelevantKnowledge = (query: string): string[] => {
  const keywords = query.toLowerCase().split(' ');
  const relevantSections: string[] = [];

  // Check for specific topics
  if (keywords.some(k => ['theme', 'color', 'design', 'glass', 'liquid'].includes(k))) {
    relevantSections.push(JSON.stringify(appKnowledgeBase.technicalSpecs, null, 2));
    relevantSections.push(JSON.stringify(appKnowledgeBase.userInterface, null, 2));
  }

  if (keywords.some(k => ['feature', 'function', 'capability', 'what', 'can', 'do'].includes(k))) {
    relevantSections.push(JSON.stringify(appKnowledgeBase.keyFeatures, null, 2));
    relevantSections.push(JSON.stringify(appKnowledgeBase.components, null, 2));
  }

  if (keywords.some(k => ['market', 'data', 'ticker', 'stock', 'price', 'trading'].includes(k))) {
    relevantSections.push(JSON.stringify(appKnowledgeBase.marketData, null, 2));
  }

  if (keywords.some(k => ['install', 'setup', 'deploy', 'run', 'start'].includes(k))) {
    relevantSections.push(JSON.stringify(appKnowledgeBase.installation, null, 2));
  }

  if (keywords.some(k => ['who', 'audience', 'user', 'target', 'for'].includes(k))) {
    relevantSections.push(JSON.stringify(appKnowledgeBase.targetAudience, null, 2));
  }

  // Always include overview for general queries
  if (relevantSections.length === 0 || keywords.some(k => ['overview', 'about', 'what', 'loki', 'app'].includes(k))) {
    relevantSections.push(appKnowledgeBase.overview);
    relevantSections.push(JSON.stringify(appKnowledgeBase.keyFeatures, null, 2));
  }

  return relevantSections;
};