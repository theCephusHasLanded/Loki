import React from 'react';
import Head from 'next/head';
import LOKI2032Demo from '../components/loki-2032/LOKI2032Demo';

const LOKI2032DemoPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>LOKI 2032 - Revolutionary Space-Maritime Prediction Market Interface</title>
        <meta name="description" content="The most advanced prediction market interface ever created - NASA mission control meets luxury yacht navigation meets AI-powered trading floor" />
        <link rel="preload" href="/styles/design-system-2032.css" as="style" />
      </Head>
      
      <LOKI2032Demo />
    </>
  );
};

export default LOKI2032DemoPage;