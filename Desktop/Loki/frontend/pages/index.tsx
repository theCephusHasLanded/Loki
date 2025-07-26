import React from 'react';
import Head from 'next/head';
import FeedbackModal from '../components/modals/FeedbackModal';

const HomePage: React.FC = () => {
  return (
    <>
      <Head>
        <title>🔮 LOKI 2032 - Institutional Trading Platform</title>
        <meta name="description" content="Advanced AI-powered trading platform for institutional investors" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔮</text></svg>" />
      </Head>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          maxWidth: '600px'
        }}>
          <h1 style={{
            fontSize: '3rem',
            marginBottom: '20px',
            background: 'linear-gradient(45deg, #f8b319, #00ff96)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            🔮 LOKI 2032
          </h1>
          
          <p style={{
            fontSize: '1.2rem',
            marginBottom: '30px',
            opacity: 0.9
          }}>
            Institutional Trading Platform - Beta
          </p>
          
          <p style={{
            fontSize: '1rem',
            opacity: 0.7,
            lineHeight: 1.6
          }}>
            Advanced AI-powered trading platform designed for hedge funds, institutional investors, and professional traders. 
            Experience Bloomberg Terminal-level functionality with modern liquid glass interface design.
          </p>
          
          <div style={{
            marginTop: '40px',
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{ marginBottom: '15px', color: '#f8b319' }}>Beta Features</h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              fontSize: '0.9rem'
            }}>
              <li style={{ marginBottom: '8px' }}>⚡ Real-time market data & analytics</li>
              <li style={{ marginBottom: '8px' }}>🤖 AI-powered trading intelligence</li>
              <li style={{ marginBottom: '8px' }}>🎨 Four sophisticated liquid glass themes</li>
              <li style={{ marginBottom: '8px' }}>📊 Advanced visualization & charting</li>
              <li style={{ marginBottom: '8px' }}>🛡️ Enterprise-grade security</li>
            </ul>
          </div>
          
          <p style={{
            marginTop: '30px',
            fontSize: '0.9rem',
            opacity: 0.6
          }}>
            We value your feedback during our beta phase. Use the feedback button to share your experience!
          </p>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal />
    </>
  );
};

export default HomePage;
