'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';

const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: var(--color-glass-base);
  
  /* Crypto trading background */
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1920&q=80&auto=format&fit=crop'),
      linear-gradient(135deg, var(--color-glass-base) 0%, var(--color-glass-surface) 100%);
    background-size: cover, cover;
    background-position: center, center;
    background-blend-mode: overlay, normal;
    backdrop-filter: var(--glass-blur-subtle);
    z-index: -1;
    pointer-events: none;
  }
`;

const AuthCard = styled(motion.div)`
  background: var(--color-glass-panel);
  backdrop-filter: var(--glass-blur-strong);
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-large);
  box-shadow: var(--glass-shadow-floating);
  padding: 2rem;
  width: 100%;
  max-width: 450px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, 
      var(--color-accent-gold) 0%, 
      rgba(0, 212, 255, 0.8) 50%, 
      var(--color-accent-gold) 100%);
  }
`;

const AuthTitle = styled.h1`
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-text-primary);
  text-align: center;
  margin-bottom: 0.5rem;
  letter-spacing: 0.1em;
`;

const AuthSubtitle = styled.p`
  font-family: var(--font-primary);
  font-size: 0.9rem;
  color: var(--color-text-muted);
  text-align: center;
  margin-bottom: 2rem;
`;

const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const FormLabel = styled.label`
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text-primary);
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

const FormInput = styled.input`
  background: var(--color-glass-base);
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-medium);
  padding: 0.75rem 1rem;
  font-family: var(--font-primary);
  font-size: 0.9rem;
  color: var(--color-text-primary);
  transition: all 0.3s ease;
  
  &::placeholder {
    color: var(--color-text-muted);
  }
  
  &:focus {
    outline: none;
    border-color: var(--color-accent-gold);
    box-shadow: 0 0 0 2px rgba(248, 179, 25, 0.2);
  }
`;

const FormSelect = styled.select`
  background: var(--color-glass-base);
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-medium);
  padding: 0.75rem 1rem;
  font-family: var(--font-primary);
  font-size: 0.9rem;
  color: var(--color-text-primary);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--color-accent-gold);
    box-shadow: 0 0 0 2px rgba(248, 179, 25, 0.2);
  }
`;

const AuthButton = styled(motion.button)`
  background: linear-gradient(135deg, var(--color-accent-gold) 0%, rgba(248, 179, 25, 0.8) 100%);
  color: #0a0f1c;
  border: none;
  border-radius: var(--radius-medium);
  padding: 0.875rem 1.5rem;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, rgba(248, 179, 25, 0.9) 0%, var(--color-accent-gold) 100%);
    box-shadow: 0 4px 20px rgba(248, 179, 25, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const AuthLink = styled(Link)`
  color: var(--color-accent-gold);
  text-decoration: none;
  font-size: 0.85rem;
  text-align: center;
  margin-top: 1rem;
  display: block;
  
  &:hover {
    text-decoration: underline;
  }
`;

const BackButton = styled(motion.button)`
  position: absolute;
  top: 2rem;
  left: 2rem;
  background: var(--color-glass-panel);
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-medium);
  padding: 0.5rem 1rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-text-primary);
  cursor: pointer;
  z-index: 10;
`;

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    role: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, create account and auto-login
      if (formData.email && formData.password && formData.firstName) {
        await login({
          email: formData.email,
          name: `${formData.firstName} ${formData.lastName}`,
          company: formData.company,
          role: formData.role,
          id: Date.now().toString()
        });
        router.push('/dashboard');
      } else {
        throw new Error('Please fill in all required fields');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <AuthContainer>
      <BackButton
        onClick={() => router.push('/')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ← Back to Demo
      </BackButton>
      
      <AuthCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <AuthTitle>Institutional Access</AuthTitle>
        <AuthSubtitle>Request access to LOKI 2032 trading platform</AuthSubtitle>
        
        <AuthForm onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup>
              <FormLabel>First Name</FormLabel>
              <FormInput
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel>Last Name</FormLabel>
              <FormInput
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                required
              />
            </FormGroup>
          </FormRow>
          
          <FormGroup>
            <FormLabel>Email Address</FormLabel>
            <FormInput
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john.doe@institution.com"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>Institution/Company</FormLabel>
            <FormInput
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Hedge Fund Name"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>Role</FormLabel>
            <FormSelect
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select your role</option>
              <option value="portfolio-manager">Portfolio Manager</option>
              <option value="trader">Trader</option>
              <option value="analyst">Analyst</option>
              <option value="risk-manager">Risk Manager</option>
              <option value="cio">Chief Investment Officer</option>
              <option value="other">Other</option>
            </FormSelect>
          </FormGroup>
          
          <FormGroup>
            <FormLabel>Password</FormLabel>
            <FormInput
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>Confirm Password</FormLabel>
            <FormInput
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </FormGroup>
          
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                color: '#ff4444',
                fontSize: '0.8rem',
                textAlign: 'center',
                background: 'rgba(255, 68, 68, 0.1)',
                padding: '0.5rem',
                borderRadius: 'var(--radius-small)',
                border: '1px solid rgba(255, 68, 68, 0.3)'
              }}
            >
              {error}
            </motion.div>
          )}
          
          <AuthButton
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? 'Processing Request...' : 'Request Access'}
          </AuthButton>
        </AuthForm>
        
        <AuthLink href="/auth/login">
          Already have an account? Sign in
        </AuthLink>
      </AuthCard>
    </AuthContainer>
  );
};

export default RegisterPage;
