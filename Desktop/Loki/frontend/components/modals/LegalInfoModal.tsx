import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { SideModal } from './SideModal';
import { Github, Linkedin, Twitter, Mail, Globe } from 'lucide-react';

interface LegalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-family: var(--font-primary);
  color: var(--color-text-primary);
`;

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  border-bottom: 1px solid var(--color-glass-border);
  margin-bottom: 24px;
  overflow-x: auto;
  padding-bottom: 16px;
`;

const Tab = styled(motion.button, {
  shouldForwardProp: (prop) => prop !== 'active'
})<{ active: boolean }>`
  font-family: var(--font-display);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid var(--color-glass-border);
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  ${({ active }) => active ? `
    background: var(--color-accent-gold);
    color: var(--color-background-primary);
    border-color: var(--color-accent-gold);
  ` : `
    background: var(--color-glass-accent);
    color: var(--color-text-secondary);
    backdrop-filter: var(--glass-blur-medium);
    
    &:hover {
      background: var(--color-glass-surface);
      color: var(--color-text-primary);
    }
  `}
`;

const Section = styled.div`
  h3 {
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0 0 12px 0;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  
  p {
    font-size: 0.85rem;
    line-height: 1.6;
    color: var(--color-text-secondary);
    margin: 0 0 16px 0;
  }
  
  ul {
    font-size: 0.85rem;
    line-height: 1.6;
    color: var(--color-text-secondary);
    margin: 0 0 16px 0;
    padding-left: 20px;
    
    li {
      margin-bottom: 8px;
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 16px;
`;

const SocialLink = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid var(--color-glass-border);
  background: var(--color-glass-accent);
  backdrop-filter: var(--glass-blur-medium);
  text-decoration: none;
  color: var(--color-text-primary);
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--color-accent-gold);
    color: var(--color-background-primary);
    transform: translateY(-2px);
    box-shadow: var(--glass-shadow-depth);
  }
`;

const CodeBlock = styled.pre`
  background: var(--color-glass-panel);
  border: 1px solid var(--color-glass-border);
  border-radius: 8px;
  padding: 16px;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--color-text-primary);
  overflow-x: auto;
  margin: 16px 0;
`;

const Badge = styled.span`
  display: inline-block;
  background: var(--color-accent-gold);
  color: var(--color-background-primary);
  font-family: var(--font-display);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 4px 8px;
  border-radius: 4px;
  margin: 0 8px 0 0;
`;

type TabType = 'about' | 'privacy' | 'license' | 'copyright' | 'contact';

export const LegalInfoModal: React.FC<LegalInfoModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('about');

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <Section>
            <h3>About LOKI 2032</h3>
            <p>
              <Badge>Revolutionary</Badge>
              LOKI 2032 represents the future of prediction market trading, 
              available today. Built by Constellation Markets, this platform 
              combines quantum-inspired UI design with institutional-grade 
              backend architecture.
            </p>
            <p>
              Our mission is to democratize sophisticated trading interfaces 
              while providing unparalleled performance and user experience. 
              From NASA mission-critical design principles to astronomical 
              market correlation, LOKI 2032 pushes the boundaries of what's 
              possible in financial technology.
            </p>
            
            <h3>Key Innovations</h3>
            <ul>
              <li><strong>Quantum-Inspired Interface:</strong> First trading platform to use quantum physics principles for market visualization</li>
              <li><strong>AI-Adaptive Personalization:</strong> Real-time interface adaptation based on user behavior and biometrics</li>
              <li><strong>Astronomical Data Integration:</strong> Revolutionary correlation between cosmic events and market behavior</li>
              <li><strong>60fps Performance Guarantee:</strong> Hardware-accelerated WebGL rendering with custom shaders</li>
              <li><strong>Voice Command Trading:</strong> Natural language processing with "LOKI" wake-word activation</li>
            </ul>
            
            <h3>Technology Stack</h3>
            <p>
              Built with Next.js 14, TypeScript, and deployed on Vercel's global CDN. 
              Our backend infrastructure includes Node.js, PostgreSQL, Redis, and 
              WebSocket real-time trading engines, ready for institutional-scale deployment.
            </p>
          </Section>
        );
        
      case 'privacy':
        return (
          <Section>
            <h3>Privacy Policy</h3>
            <p><strong>Last Updated:</strong> January 2025</p>
            
            <h3>Information We Collect</h3>
            <ul>
              <li><strong>Account Information:</strong> Email, username, and encrypted authentication data</li>
              <li><strong>Trading Data:</strong> Market positions, transaction history, and performance metrics</li>
              <li><strong>Usage Analytics:</strong> Platform interactions, feature usage, and performance data</li>
              <li><strong>Device Information:</strong> Browser type, device specifications, and connection data</li>
            </ul>
            
            <h3>How We Use Your Data</h3>
            <ul>
              <li>Provide and improve our trading platform services</li>
              <li>Personalize your trading interface and AI recommendations</li>
              <li>Ensure platform security and prevent fraudulent activity</li>
              <li>Analyze astronomical data correlations with market behavior</li>
              <li>Communicate important platform updates and features</li>
            </ul>
            
            <h3>Data Protection</h3>
            <p>
              We implement enterprise-grade security measures including end-to-end 
              encryption, secure data storage, and regular security audits. Your 
              trading data is never shared with third parties without explicit consent.
            </p>
            
            <h3>Your Rights</h3>
            <ul>
              <li>Access and download your personal data</li>
              <li>Request correction of inaccurate information</li>
              <li>Delete your account and associated data</li>
              <li>Opt-out of non-essential data collection</li>
            </ul>
          </Section>
        );
        
      case 'license':
        return (
          <Section>
            <h3>MIT License</h3>
            <p>
              LOKI 2032 is released under the MIT License, promoting open 
              collaboration and innovation in the trading platform space.
            </p>
            
            <CodeBlock>
{`MIT License

Copyright (c) 2025 Constellation Markets Team

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
SOFTWARE.`}
            </CodeBlock>
            
            <h3>Open Source Commitment</h3>
            <p>
              We believe in the power of open source to drive innovation. 
              The LOKI 2032 codebase is available for developers to learn, 
              contribute, and build upon our revolutionary trading interface concepts.
            </p>
            
            <h3>Third-Party Libraries</h3>
            <p>
              This project includes several open source libraries. Please refer 
              to our package.json files for complete attribution and licensing 
              information for all dependencies.
            </p>
          </Section>
        );
        
      case 'copyright':
        return (
          <Section>
            <h3>Copyright Notice</h3>
            <p>
              © 2025 Constellation Markets Team. All rights reserved.
            </p>
            
            <h3>Trademark Information</h3>
            <ul>
              <li><strong>LOKI 2032™:</strong> Trademark of Constellation Markets</li>
              <li><strong>Constellation Markets®:</strong> Registered trademark</li>
              <li><strong>Quantum Trading Interface™:</strong> Proprietary technology</li>
            </ul>
            
            <h3>Intellectual Property</h3>
            <p>
              While the source code is MIT licensed, certain design elements, 
              branding materials, and proprietary algorithms remain the intellectual 
              property of Constellation Markets.
            </p>
            
            <h3>Attribution Requirements</h3>
            <p>
              When using or modifying this software, please maintain proper 
              attribution to the original creators and include the MIT license 
              notice in derivative works.
            </p>
            
            <h3>Content Usage</h3>
            <p>
              Screenshots, documentation, and marketing materials may be used 
              for educational and promotional purposes with proper attribution.
            </p>
          </Section>
        );
        
      case 'contact':
        return (
          <Section>
            <h3>Contact Information</h3>
            <p>
              Connect with the LOKI 2032 team for technical support, 
              investment opportunities, or partnership inquiries.
            </p>
            
            <h3>Investment & Partnerships</h3>
            <p>
              For investment opportunities and strategic partnerships:
              <br />
              <strong>Email:</strong> investment@loki2032.com
            </p>
            
            <h3>Technical Support</h3>
            <p>
              For technical questions and developer support:
              <br />
              <strong>GitHub:</strong> Issues and discussions
              <br />
              <strong>Documentation:</strong> Comprehensive guides available
            </p>
            
            <h3>Connect With Us</h3>
            <SocialLinks>
              <SocialLink
                href="https://github.com/theCephusHasLanded/Loki"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github size={16} />
                GitHub Repository
              </SocialLink>
              
              <SocialLink
                href="mailto:investment@loki2032.com"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail size={16} />
                Investment Inquiries
              </SocialLink>
              
              <SocialLink
                href="https://loki2032.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Globe size={16} />
                Official Website
              </SocialLink>
            </SocialLinks>
            
            <h3>Business Hours</h3>
            <p>
              Our team operates globally with 24/7 platform monitoring. 
              Response times for inquiries are typically within 24 hours.
            </p>
            
            <h3>Location</h3>
            <p>
              Constellation Markets operates as a distributed team with 
              development centers in multiple time zones to ensure continuous 
              platform development and support.
            </p>
          </Section>
        );
        
      default:
        return null;
    }
  };

  return (
    <SideModal
      isOpen={isOpen}
      onClose={onClose}
      position="right"
      size="large"
      title="Legal & Information"
    >
      <ContentContainer>
        <TabContainer>
          <Tab
            active={activeTab === 'about'}
            onClick={() => setActiveTab('about')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            About
          </Tab>
          <Tab
            active={activeTab === 'privacy'}
            onClick={() => setActiveTab('privacy')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Privacy
          </Tab>
          <Tab
            active={activeTab === 'license'}
            onClick={() => setActiveTab('license')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            License
          </Tab>
          <Tab
            active={activeTab === 'copyright'}
            onClick={() => setActiveTab('copyright')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Copyright
          </Tab>
          <Tab
            active={activeTab === 'contact'}
            onClick={() => setActiveTab('contact')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Contact
          </Tab>
        </TabContainer>
        
        {renderContent()}
      </ContentContainer>
    </SideModal>
  );
};

export default LegalInfoModal;
