import React from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { 
  Scale, 
  Shield, 
  FileText, 
  AlertTriangle, 
  Mail, 
  Globe,
  Lock,
  Eye,
  Users,
  Gavel
} from 'lucide-react';

const ModalContent = styled.div`
  padding: 2rem;
  height: 100%;
  overflow-y: auto;
  background: var(--color-glass-base);
  color: var(--color-text-primary);
`;

const Section = styled.section`
  margin-bottom: 3rem;
  
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  h3 {
    font-size: 1.2rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    margin: 1.5rem 0 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  p {
    color: var(--color-text-secondary);
    line-height: 1.6;
    margin-bottom: 1rem;
  }
`;

const InfoCard = styled(motion.div)`
  background: var(--color-glass-surface);
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-medium);
  padding: 1.5rem;
  margin: 1rem 0;
  backdrop-filter: var(--glass-blur-medium);
  
  .card-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    
    .card-title {
      font-size: 1.1rem;
      font-weight: 500;
      color: var(--color-text-primary);
    }
  }
  
  .card-content {
    color: var(--color-text-secondary);
    line-height: 1.6;
  }
`;

const ContactInfo = styled.div`
  background: var(--color-glass-panel);
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-medium);
  padding: 1.5rem;
  margin: 1rem 0;
  
  .contact-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0.5rem 0;
    color: var(--color-text-secondary);
    
    .contact-label {
      font-weight: 500;
      min-width: 100px;
    }
    
    .contact-value {
      color: var(--color-text-primary);
    }
  }
`;

const DisclaimerBox = styled.div`
  background: linear-gradient(135deg, rgba(255, 153, 0, 0.1) 0%, rgba(255, 153, 0, 0.05) 100%);
  border: 1px solid rgba(255, 153, 0, 0.3);
  border-radius: var(--radius-medium);
  padding: 1.5rem;
  margin: 1rem 0;
  
  .disclaimer-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-warning);
    font-weight: 500;
    margin-bottom: 1rem;
  }
  
  .disclaimer-content {
    color: var(--color-text-secondary);
    line-height: 1.6;
    font-size: 0.9rem;
  }
`;

export const LegalInfoModal: React.FC = () => {
  return (
    <ModalContent>
      <Section>
        <h2>
          <Scale size={24} />
          Legal Information & Compliance
        </h2>
        <p>
          LOKI 2032 operates under strict regulatory compliance and maintains the highest 
          standards of legal and ethical trading practices.
        </p>
      </Section>

      <Section>
        <h3>
          <FileText size={20} />
          Terms of Service
        </h3>
        <InfoCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="card-header">
            <Gavel size={16} />
            <span className="card-title">Platform Usage Terms</span>
          </div>
          <div className="card-content">
            By accessing LOKI 2032, you agree to our comprehensive terms of service. 
            This includes responsible trading practices, compliance with local regulations, 
            and adherence to our community guidelines. All users must be 18+ and legally 
            eligible to participate in prediction markets in their jurisdiction.
          </div>
        </InfoCard>

        <InfoCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card-header">
            <Lock size={16} />
            <span className="card-title">Account Security</span>
          </div>
          <div className="card-content">
            Users are responsible for maintaining the security of their accounts. We recommend 
            enabling two-factor authentication, using strong passwords, and never sharing 
            account credentials. LOKI 2032 employs bank-grade security measures to protect 
            your assets and personal information.
          </div>
        </InfoCard>
      </Section>

      <Section>
        <h3>
          <Eye size={20} />
          Privacy Policy
        </h3>
        <InfoCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="card-header">
            <Shield size={16} />
            <span className="card-title">Data Protection</span>
          </div>
          <div className="card-content">
            We collect only necessary information to provide our services and comply with 
            regulations. Your personal data is encrypted, securely stored, and never sold 
            to third parties. We follow GDPR, CCPA, and other applicable privacy regulations.
          </div>
        </InfoCard>

        <InfoCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="card-header">
            <Users size={16} />
            <span className="card-title">Information Usage</span>
          </div>
          <div className="card-content">
            We use your information to provide trading services, send important updates, 
            improve our platform, and ensure regulatory compliance. You can control your 
            communication preferences and data sharing settings in your account dashboard.
          </div>
        </InfoCard>
      </Section>

      <Section>
        <h3>
          <AlertTriangle size={20} />
          Risk Disclosures
        </h3>
        <DisclaimerBox>
          <div className="disclaimer-header">
            <AlertTriangle size={16} />
            Important Risk Warning
          </div>
          <div className="disclaimer-content">
            Prediction market trading involves substantial risk and is not suitable for all investors. 
            Past performance does not guarantee future results. Astrological correlations and AI 
            predictions are for informational purposes only and should not be considered as 
            financial advice. You may lose some or all of your invested capital.
          </div>
        </DisclaimerBox>

        <InfoCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="card-header">
            <Scale size={16} />
            <span className="card-title">Regulatory Compliance</span>
          </div>
          <div className="card-content">
            LOKI 2032 operates in compliance with applicable financial regulations. We are 
            registered with relevant authorities and maintain proper licensing for prediction 
            market operations. Our platform undergoes regular audits and security assessments.
          </div>
        </InfoCard>
      </Section>

      <Section>
        <h3>
          <Mail size={20} />
          Contact Information
        </h3>
        <ContactInfo>
          <div className="contact-item">
            <Globe size={16} />
            <span className="contact-label">Website:</span>
            <span className="contact-value">loki2032.com</span>
          </div>
          <div className="contact-item">
            <Mail size={16} />
            <span className="contact-label">Support:</span>
            <span className="contact-value">support@loki2032.com</span>
          </div>
          <div className="contact-item">
            <Shield size={16} />
            <span className="contact-label">Legal:</span>
            <span className="contact-value">legal@loki2032.com</span>
          </div>
          <div className="contact-item">
            <FileText size={16} />
            <span className="contact-label">Compliance:</span>
            <span className="contact-value">compliance@loki2032.com</span>
          </div>
        </ContactInfo>
      </Section>

      <Section>
        <h3>
          <Globe size={20} />
          Jurisdiction & Licensing
        </h3>
        <p>
          LOKI 2032 is operated under the laws of [Jurisdiction] with proper licensing 
          for prediction market activities. We comply with anti-money laundering (AML) 
          and know-your-customer (KYC) requirements as mandated by regulatory authorities.
        </p>
        
        <InfoCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="card-header">
            <FileText size={16} />
            <span className="card-title">Document Access</span>
          </div>
          <div className="card-content">
            Complete legal documents, including full terms of service, privacy policy, 
            and regulatory disclosures are available for download in your account settings. 
            We recommend reviewing these documents regularly as they may be updated to 
            reflect regulatory changes.
          </div>
        </InfoCard>
      </Section>
    </ModalContent>
  );
};

export default LegalInfoModal;
