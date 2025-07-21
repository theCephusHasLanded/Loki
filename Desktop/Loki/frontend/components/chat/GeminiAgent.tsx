import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { appKnowledgeBase, getRelevantKnowledge } from '../../lib/knowledgeBase';
import { setupCommitHooks } from '../../lib/memoryUpdater';

const ChatContainer = styled(motion.div)`
  position: fixed;
  bottom: 50px;
  right: 20px;
  width: 380px;
  max-height: 500px;
  background: var(--color-glass-base);
  backdrop-filter: var(--glass-blur-strong);
  border: 1px solid var(--color-glass-border);
  border-radius: 12px;
  box-shadow: var(--glass-shadow-floating);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 768px) {
    right: 10px;
    width: calc(100vw - 20px);
    max-width: 380px;
  }
`;

const ChatHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-glass-border);
  background: var(--color-glass-surface);
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    font-family: var(--font-display);
    font-size: 0.9rem;
    font-weight: 400;
    color: var(--color-text-primary);
    margin: 0;
    letter-spacing: 0.02em;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--color-profit);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 200px;
  max-height: 300px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-glass-border);
    border-radius: 2px;
  }
`;

const Message = styled(motion.div)<{ isUser: boolean }>`
  display: flex;
  flex-direction: column;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  max-width: 85%;

  .message-content {
    background: ${props => props.isUser 
      ? 'var(--color-glass-accent)' 
      : 'var(--color-glass-panel)'};
    backdrop-filter: var(--glass-blur-medium);
    border: 1px solid ${props => props.isUser 
      ? 'rgba(255, 255, 255, 0.2)' 
      : 'var(--color-glass-border)'};
    border-radius: ${props => props.isUser 
      ? '12px 12px 4px 12px' 
      : '12px 12px 12px 4px'};
    padding: 12px 16px;
    font-family: var(--font-primary);
    font-size: 0.85rem;
    font-weight: 300;
    line-height: 1.4;
    color: var(--color-text-primary);
    letter-spacing: 0.01em;
  }

  .message-time {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--color-text-muted);
    margin-top: 4px;
    align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
    letter-spacing: 0.02em;
  }
`;

const ChatInput = styled.div`
  padding: 16px;
  border-top: 1px solid var(--color-glass-border);
  background: var(--color-glass-surface);
  display: flex;
  gap: 12px;
  align-items: flex-end;
`;

const InputField = styled.textarea`
  flex: 1;
  background: var(--color-glass-panel);
  backdrop-filter: var(--glass-blur-subtle);
  border: 1px solid var(--color-glass-border);
  border-radius: 8px;
  padding: 12px;
  font-family: var(--font-primary);
  font-size: 0.85rem;
  font-weight: 300;
  color: var(--color-text-primary);
  resize: none;
  min-height: 20px;
  max-height: 80px;
  line-height: 1.4;
  letter-spacing: 0.01em;

  &::placeholder {
    color: var(--color-text-muted);
    font-style: italic;
  }

  &:focus {
    outline: none;
    border-color: var(--color-text-accent);
    box-shadow: 0 0 0 2px rgba(0, 180, 255, 0.1);
  }
`;

const SendButton = styled(motion.button)`
  background: var(--color-glass-accent);
  backdrop-filter: var(--glass-blur-medium);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 8px 12px;
  color: var(--color-text-primary);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: 0.02em;

  &:hover:not(:disabled) {
    background: var(--color-accent-gold);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ToggleButton = styled(motion.button)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--color-glass-accent);
  backdrop-filter: var(--glass-blur-strong);
  border: 1px solid var(--color-glass-border);
  box-shadow: var(--glass-shadow-depth);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1002;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--color-text-primary);
  letter-spacing: 0.05em;

  @media (max-width: 768px) {
    right: 15px;
    width: 50px;
    height: 50px;
  }
`;

const TypingIndicator = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  color: var(--color-text-muted);
  font-family: var(--font-primary);
  font-size: 0.8rem;
  font-style: italic;

  .dots {
    display: flex;
    gap: 2px;
    
    span {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: var(--color-text-muted);
      animation: typing-dot 1.4s infinite;
      
      &:nth-of-type(2) { animation-delay: 0.2s; }
      &:nth-of-type(3) { animation-delay: 0.4s; }
    }
  }

  @keyframes typing-dot {
    0%, 60%, 100% { opacity: 0.3; }
    30% { opacity: 1; }
  }
`;

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const GeminiAgent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: `Hello! I'm your LOKI 2032 assistant. I can help explain any aspect of this institutional trading platform - from features and functionality to design elements and market data. What would you like to know?`,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initialize commit hooks for memory updates
  useEffect(() => {
    setupCommitHooks();
  }, []);

  const generateResponse = async (userQuery: string): Promise<string> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const relevantKnowledge = getRelevantKnowledge(userQuery);
    const query = userQuery.toLowerCase();

    // Context-aware responses based on query analysis
    if (query.includes('theme') || query.includes('color') || query.includes('design')) {
      return `LOKI 2032 features a sophisticated liquid glass design system with four distinct themes:

🔷 **Space Maritime** (Default): Deep blue glass layers with professional transparency
🧊 **Cosmic Ice**: Light crystalline aesthetic with ice-blue tones  
⚫ **Void Black**: Minimal dark theme for focused trading
✨ **Quantum Glow**: Purple-pink gradient theme with ethereal effects

Each theme maintains institutional credibility while offering visual variety. The glassmorphism effects include layered transparency, backdrop blur, and sophisticated hover animations. You can switch themes using the control panel in the top-right corner.`;
    }

    if (query.includes('feature') || query.includes('what') || query.includes('can')) {
      return `LOKI 2032 offers institutional-grade trading capabilities:

📊 **Advanced Analytics**: Real-time market intelligence with sophisticated visualizations
🤖 **Machine Learning**: AI-powered predictions with confidence scoring
⚡ **Smart Execution**: Sub-millisecond order routing and optimal execution
🛡️ **Risk Management**: Dynamic position monitoring and hedging protocols
🌍 **Global Markets**: Multi-asset coverage across international exchanges
📈 **Real-time Data**: Live ticker with continuous market updates

The platform is designed for hedge funds, institutional investors, and professional traders who demand Bloomberg Terminal-level functionality with modern interface design.`;
    }

    if (query.includes('ticker') || query.includes('market') || query.includes('data') || query.includes('price')) {
      return `The real-time ticker displays live market data with continuous scrolling animation:

📈 **Covered Assets**: SPY, QQQ, BTC, ETH, AAPL, GOOGL, TSLA, MSFT, AMZN, NVDA
🔄 **Update Frequency**: Prices refresh every 3 seconds with realistic volatility
📊 **Data Points**: Current price, percentage change, and trend indicators
🎯 **Color Coding**: Green for gains, red for losses, amber for stable assets

The ticker uses sophisticated animation with seamless looping and hardware acceleration for smooth performance on multi-monitor trading setups.`;
    }

    if (query.includes('install') || query.includes('setup') || query.includes('run')) {
      return `LOKI 2032 setup is streamlined for trading environments:

⚙️ **Requirements**: Node.js 18+, Next.js 14, TypeScript
🚀 **Quick Start**: \`npm run dev\` launches on port 3001
🔧 **Development**: Hot reloading with TypeScript support
📱 **Responsive**: Optimized for multi-monitor and mobile trading

The platform is designed for institutional deployment with enterprise security considerations and custom domain support for white-label implementations.`;
    }

    if (query.includes('font') || query.includes('typography')) {
      return `LOKI 2032 uses JetBrains Mono throughout for optimal trading readability:

🔤 **Primary Font**: JetBrains Mono (300-600 weight range)
📊 **Financial Data**: Monospace ensures perfect number alignment
⚖️ **Weight Distribution**: Lighter weights (300-400) reduce visual fatigue
📏 **Spacing**: Increased letter spacing for clarity in high-stress trading

This typography choice mirrors professional trading terminals where data precision and readability are paramount. The reduced font weights maintain elegance while ensuring excellent legibility across all screen sizes.`;
    }

    // Generic response with app overview
    return `LOKI 2032 is an institutional trading platform featuring:

🏛️ **Target Audience**: Hedge funds, institutional investors, professional traders
🎨 **Design**: Liquid glass aesthetic with sophisticated glassmorphism
⚡ **Performance**: Sub-millisecond execution with real-time data feeds
🔧 **Technology**: Next.js, TypeScript, advanced animations
📊 **Features**: AI analytics, risk management, global market access

${relevantKnowledge.length > 0 ? `\n**Relevant Details**:\n${relevantKnowledge[0].substring(0, 200)}...` : ''}

Feel free to ask about specific features, themes, market data, or technical implementation details!`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await generateResponse(userMessage.content);
      
      const agentMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble processing your request right now. Please try asking about LOKI 2032's features, themes, or functionality.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <ChatContainer
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <ChatHeader>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3>LOKI Assistant</h3>
                <div className="status-dot" />
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--color-text-muted)', 
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                ×
              </button>
            </ChatHeader>

            <ChatMessages>
              {messages.map((message) => (
                <Message
                  key={message.id}
                  isUser={message.isUser}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="message-content">
                    {message.content}
                  </div>
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </Message>
              ))}
              
              {isTyping && (
                <TypingIndicator
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Assistant is typing
                  <div className="dots">
                    <span />
                    <span />
                    <span />
                  </div>
                </TypingIndicator>
              )}
              <div ref={messagesEndRef} />
            </ChatMessages>

            <ChatInput>
              <InputField
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about LOKI 2032 features, themes, or functionality..."
                disabled={isTyping}
              />
              <SendButton
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                SEND
              </SendButton>
            </ChatInput>
          </ChatContainer>
        )}
      </AnimatePresence>

      {!isOpen && (
        <ToggleButton
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2, duration: 0.3 }}
        >
          AI
        </ToggleButton>
      )}
    </>
  );
};

export default GeminiAgent;