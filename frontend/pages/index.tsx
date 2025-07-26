import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
`;

const WelcomeTitle = styled(motion.h1)`
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 2rem;
  letter-spacing: -0.02em;
`;

const SubTitle = styled(motion.p)`
  font-family: var(--font-primary);
  font-size: 1.2rem;
  color: var(--color-text-secondary);
  margin-bottom: 3rem;
`;

const RedirectMessage = styled(motion.div)`
  font-family: var(--font-mono);
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin-top: 2rem;
`;

export default function Home() {
  const router = useRouter();

  const handleEnterDemo = () => {
    router.push('/loki-2032-demo');
  };

  return (
    <>
      <Head>
        <title>LOKI 2032 - Astrological Prediction Trading</title>
        <meta name="description" content="Revolutionary astrological prediction markets with AI-powered cosmic intelligence" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔮</text></svg>" />
      </Head>
      
      <LoadingContainer>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          style={{
            width: '120px',
            height: '120px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            marginBottom: '2rem'
          }}
        >
          🔮
        </motion.div>
      
      <WelcomeTitle
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        LOKI 2032
      </WelcomeTitle>
      
      <SubTitle
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        Constellation Markets - AI-Powered Prediction Trading
      </SubTitle>
      
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        onClick={handleEnterDemo}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          color: 'white',
          fontFamily: 'var(--font-display)',
          fontSize: '1rem',
          cursor: 'pointer',
          marginTop: '2rem'
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Enter Trading Platform
      </motion.button>
      
      <RedirectMessage
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1, delay: 2 }}
      >
        Next-generation prediction markets with AI-enhanced celestial trading intelligence
      </RedirectMessage>
      </LoadingContainer>
    </>
  );
}