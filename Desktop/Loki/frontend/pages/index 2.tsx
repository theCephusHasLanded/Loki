import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { LokiConstellation } from '../components/loki-2032/LokiConstellation';

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

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/loki-2032-demo');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <LoadingContainer>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <LokiConstellation size={120} animated={true} />
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
        Institutional Trading Platform
      </SubTitle>
      
      <RedirectMessage
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1, delay: 2 }}
      >
        Initializing trading platform...
      </RedirectMessage>
    </LoadingContainer>
  );
}