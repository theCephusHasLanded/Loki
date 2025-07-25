import React from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-family: 'Space Grotesk', sans-serif;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  text-align: center;
  opacity: 0.8;
`;

export default function TestPage() {
  return (
    <Container>
      <Title>🚀 LOKI 2032</Title>
      <Subtitle>Constellation Markets - Successfully Deployed!</Subtitle>
      <br />
      <p>✅ Next.js Build: Working</p>
      <p>✅ Styled Components: Working</p>
      <p>✅ Vercel Deployment: Working</p>
    </Container>
  );
}