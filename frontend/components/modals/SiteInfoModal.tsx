'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: var(--color-glass-panel);
  backdrop-filter: var(--glass-blur-strong);
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-large);
  box-shadow: var(--glass-shadow-floating);
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--color-glass-surface);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--color-glass-accent);
    border-radius: 4px;
  }
`;

const ModalHeader = styled.div`
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid var(--color-glass-border);
  position: sticky;
  top: 0;
  background: var(--color-glass-panel);
  backdrop-filter: var(--glass-blur-strong);
  z-index: 10;
`;

const ModalTitle = styled.h1`
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
  letter-spacing: 0.1em;
`;

const ModalSubtitle = styled.p`
  font-family: var(--font-primary);
  font-size: 0.9rem;
  color: var(--color-text-muted);
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--color-glass-base);
  border: 1px solid var(--color-glass-border);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-primary);
  cursor: pointer;
  font-size: 1.2rem;
  
  &:hover {
    background: var(--color-glass-surface);
  }
`;

const TabContainer = styled.div`
  display: flex;
  padding: 0 2rem;
  background: var(--color-glass-base);
  border-bottom: 1px solid var(--color-glass-border);
  overflow-x: auto;
`;

const TabButton = styled(motion.button)<{ active: boolean }>`
  background: ${props => props.active ? 'var(--color-glass-surface)' : 'transparent'};
  border: none;
  padding: 1rem 1.5rem;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 500;
  color: ${props => props.active ? 'var(--color-text-primary)' : 'var(--color-text-muted)'};
  cursor: pointer;
  border-radius: var(--radius-small) var(--radius-small) 0 0;
  transition: all 0.3s ease;
  white-space: nowrap;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  
  &:hover {
    color: var(--color-text-primary);
    background: var(--color-glass-surface);
  }
`;

const ModalBody = styled.div`
  padding: 2rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
  
  h2 {
    font-family: var(--font-display);
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 1rem;
    letter-spacing: 0.05em;
  }
  
  h3 {
    font-family: var(--font-display);
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--color-text-accent);
    margin: 1.5rem 0 0.75rem 0;
    letter-spacing: 0.05em;
  }
  
  p {
    font-family: var(--font-primary);
    font-size: 0.9rem;
    color: var(--color-text-muted);
    line-height: 1.6;
    margin-bottom: 1rem;
  }
  
  ul {
    color: var(--color-text-muted);
    line-height: 1.6;
    margin-left: 1.5rem;
    
    li {
      margin-bottom: 0.5rem;
    }
  }
`;

const LinkButton = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, var(--color-accent-gold) 0%, rgba(248, 179, 25, 0.8) 100%);
  color: #0a0f1c;
  text-decoration: none;
  border-radius: var(--radius-medium);
  padding: 0.75rem 1.5rem;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin: 0.5rem 0.5rem 0.5rem 0;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, rgba(248, 179, 25, 0.9) 0%, var(--color-accent-gold) 100%);
    box-shadow: 0 4px 20px rgba(248, 179, 25, 0.3);
  }
`;

const CodeBlock = styled.pre`
  background: var(--color-glass-base);
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-medium);
  padding: 1rem;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--color-text-primary);
  overflow-x: auto;
  margin: 1rem 0;
  white-space: pre-wrap;
`;

interface SiteInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SiteInfoModal: React.FC<SiteInfoModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'about' | 'legal' | 'privacy' | 'license' | 'contact'>('about');

  const tabs = [
    { id: 'about', label: 'About' },
    { id: 'legal', label: 'Legal' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'license', label: 'License' },
    { id: 'contact', label: 'Contact' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <Section>
            <h2>About LOKI 2032</h2>
            <p>
              LOKI 2032 is a revolutionary institutional trading platform designed for hedge funds, 
              investment firms, and professional traders. Built with cutting-edge technology and 
              sophisticated design principles, our platform delivers Bloomberg Terminal-level 
              functionality with modern user experience.
            </p>
            
            <h3>Platform Features</h3>
            <ul>
              <li><strong>Advanced Analytics:</strong> Real-time market intelligence with institutional-grade data processing</li>
              <li><strong>Machine Learning:</strong> AI-powered predictions with confidence scoring and risk assessment</li>
              <li><strong>Smart Execution:</strong> Sub-millisecond order routing with optimal execution algorithms</li>
              <li><strong>Risk Management:</strong> Dynamic position monitoring and automated hedging protocols</li>
              <li><strong>Global Markets:</strong> Multi-asset coverage across international exchanges</li>
              <li><strong>Real-time Data:</strong> Live market feeds with continuous updates and analysis</li>
            </ul>

            <h3>Technology Stack</h3>
            <p>
              Built with Next.js 14, TypeScript, React 18, and modern web technologies. Features 
              advanced glassmorphism design, hardware-accelerated animations, and responsive layouts 
              optimized for multi-monitor trading setups.
            </p>

            <h3>Target Audience</h3>
            <p>
              LOKI 2032 is designed for institutional investors, hedge funds, portfolio managers, 
              quantitative analysts, and professional traders who require sophisticated tools for 
              market analysis and trade execution.
            </p>
          </Section>
        );

      case 'legal':
        return (
          <Section>
            <h2>Legal Information</h2>
            
            <h3>Terms of Service</h3>
            <p>
              By accessing and using LOKI 2032, you agree to comply with our terms of service. 
              This platform is intended for professional and institutional use only.
            </p>
            
            <h3>Disclaimer</h3>
            <p>
              LOKI 2032 is a demonstration platform designed to showcase institutional trading 
              capabilities. All market data, predictions, and analytics shown are for demonstration 
              purposes only and should not be considered as financial advice.
            </p>
            
            <h3>Intellectual Property</h3>
            <p>
              All design elements, code, algorithms, and intellectual property contained within 
              LOKI 2032 are owned by LKHN Technologies. Unauthorized reproduction or distribution 
              is prohibited.
            </p>
            
            <h3>Compliance</h3>
            <p>
              LKHN Technologies adheres to industry best practices for data security, user privacy, 
              and financial technology compliance standards.
            </p>
          </Section>
        );

      case 'privacy':
        return (
          <Section>
            <h2>Privacy Policy</h2>
            
            <h3>Data Collection</h3>
            <p>
              We collect minimal user data necessary for platform functionality, including email 
              addresses for authentication and usage analytics for platform improvement.
            </p>
            
            <h3>Data Usage</h3>
            <p>
              Your data is used solely for:
            </p>
            <ul>
              <li>Platform authentication and user account management</li>
              <li>Improving user experience and platform performance</li>
              <li>Providing customer support and technical assistance</li>
              <li>Compliance with legal and regulatory requirements</li>
            </ul>
            
            <h3>Data Protection</h3>
            <p>
              We implement industry-standard security measures to protect your data, including 
              encryption, secure transmission protocols, and access controls.
            </p>
            
            <h3>Third-Party Services</h3>
            <p>
              LOKI 2032 integrates with trusted third-party services for enhanced functionality:
            </p>
            <ul>
              <li><strong>Calendly:</strong> Meeting scheduling and calendar integration</li>
              <li><strong>Vercel:</strong> Secure hosting and deployment infrastructure</li>
              <li><strong>LinkedIn:</strong> Professional networking and business connections</li>
            </ul>
            
            <h3>Your Rights</h3>
            <p>
              You have the right to access, modify, or delete your personal data at any time. 
              Contact us for data-related requests or privacy concerns.
            </p>
          </Section>
        );

      case 'license':
        return (
          <Section>
            <h2>MIT License</h2>
            <p>
              LOKI 2032 is released under the MIT License, ensuring open-source availability 
              while maintaining commercial viability.
            </p>
            
            <CodeBlock>{`MIT License

Copyright (c) 2024 LKHN Technologies

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}</CodeBlock>

            <h3>Open Source Components</h3>
            <p>
              LOKI 2032 is built using various open-source technologies and libraries, 
              each with their respective licenses:
            </p>
            <ul>
              <li><strong>Next.js:</strong> MIT License</li>
              <li><strong>React:</strong> MIT License</li>
              <li><strong>TypeScript:</strong> Apache License 2.0</li>
              <li><strong>Framer Motion:</strong> MIT License</li>
              <li><strong>Emotion:</strong> MIT License</li>
            </ul>
            
            <h3>Commercial Use</h3>
            <p>
              While the source code is available under MIT License, commercial deployment 
              and institutional use may require additional licensing agreements. Contact 
              LKHN Technologies for enterprise licensing options.
            </p>
          </Section>
        );

      case 'contact':
        return (
          <Section>
            <h2>Contact Information</h2>
            
            <h3>LKHN Technologies</h3>
            <p>
              Your premier partner for institutional trading technology solutions. We specialize 
              in building sophisticated financial platforms for hedge funds and investment firms.
            </p>
            
            <LinkButton
              href="https://www.linkedin.com/company/107395062"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🏢 LKHN Technologies LinkedIn
            </LinkButton>
            
            <h3>Christina Cephus - Founder & CEO</h3>
            <p>
              Visionary leader and technology architect behind LOKI 2032. Expert in financial 
              technology, institutional trading systems, and cutting-edge user experience design.
            </p>
            
            <LinkButton
              href="https://www.linkedin.com/in/thecephus"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              👤 Christina Cephus LinkedIn
            </LinkButton>
            
            <h3>Business Inquiries</h3>
            <p>
              For enterprise partnerships, custom development, or institutional licensing:
            </p>
            <ul>
              <li><strong>Platform Demo:</strong> Schedule via the BOOK button on our platform</li>
              <li><strong>Enterprise Sales:</strong> Contact through LinkedIn business page</li>
              <li><strong>Technical Support:</strong> Available for institutional clients</li>
              <li><strong>Partnership Opportunities:</strong> Open to strategic collaborations</li>
            </ul>
            
            <h3>Technical Support</h3>
            <p>
              For technical issues, feature requests, or development inquiries, please reach 
              out through our professional channels. We provide dedicated support for institutional 
              clients and enterprise deployments.
            </p>
            
            <h3>Headquarters</h3>
            <p>
              LKHN Technologies operates as a modern technology company with remote-first 
              capabilities, serving institutional clients globally.
            </p>
          </Section>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContent
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>LOKI 2032 Platform Information</ModalTitle>
              <ModalSubtitle>Legal, privacy, licensing, and contact information</ModalSubtitle>
              <CloseButton
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ×
              </CloseButton>
            </ModalHeader>

            <TabContainer>
              {tabs.map((tab) => (
                <TabButton
                  key={tab.id}
                  active={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {tab.label}
                </TabButton>
              ))}
            </TabContainer>

            <ModalBody>
              {renderContent()}
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default SiteInfoModal;
