import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';

const FeedbackButton = styled(motion.button)`
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 80px;
  height: 140px;
  background: rgba(248, 179, 25, 1);
  backdrop-filter: blur(20px) saturate(180%);
  border: 2px solid rgba(0, 0, 0, 0.5);
  border-radius: 30px 0 0 30px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  z-index: 9998;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.05em;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Glowing effect */
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(248, 179, 25, 0.3),
    0 0 40px rgba(248, 179, 25, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  
  /* Pulsing glow animation */
  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 32px 0 0 32px;
    background: linear-gradient(45deg, 
      rgba(248, 179, 25, 0.2) 0%, 
      transparent 50%, 
      rgba(248, 179, 25, 0.1) 100%);
    animation: feedback-glow 3s ease-in-out infinite;
    z-index: -1;
  }
  
  @keyframes feedback-glow {
    0%, 100% { 
      opacity: 0.5;
      transform: scale(1);
    }
    50% { 
      opacity: 1;
      transform: scale(1.05);
    }
  }
  
  &:hover {
    transform: translateY(-50%) translateX(-5px);
    background: rgba(248, 179, 25, 0.9);
    box-shadow: 
      0 16px 48px rgba(0, 0, 0, 0.4),
      0 0 30px rgba(248, 179, 25, 0.5),
      0 0 60px rgba(248, 179, 25, 0.2),
      inset 0 2px 0 rgba(255, 255, 255, 0.4);
  }

  @media (max-width: 768px) {
    right: 10px;
    width: 50px;
    height: 100px;
    font-size: 0.6rem;
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 10, 30, 0.85);
  backdrop-filter: blur(20px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ModalContainer = styled(motion.div)`
  background: var(--color-glass-base);
  backdrop-filter: var(--glass-blur-strong) saturate(180%);
  border: 1px solid var(--color-glass-border);
  border-radius: 20px;
  padding: 32px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 
    var(--glass-shadow-floating),
    0 0 60px rgba(248, 179, 25, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  
  /* Beta glow effect */
  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 22px;
    background: linear-gradient(45deg, 
      rgba(248, 179, 25, 0.1) 0%, 
      transparent 30%, 
      transparent 70%,
      rgba(0, 255, 150, 0.1) 100%);
    animation: beta-glow 4s ease-in-out infinite;
    z-index: -1;
  }
  
  @keyframes beta-glow {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.8; }
  }
`;

const ModalHeader = styled.div`
  margin-bottom: 24px;
  text-align: center;
  
  h2 {
    font-family: var(--font-display);
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0 0 8px 0;
    letter-spacing: 0.05em;
  }
  
  .beta-badge {
    display: inline-block;
    background: linear-gradient(135deg, 
      rgba(248, 179, 25, 0.2) 0%, 
      rgba(0, 255, 150, 0.2) 100%);
    border: 1px solid rgba(248, 179, 25, 0.3);
    border-radius: 12px;
    padding: 4px 12px;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--color-accent-gold);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 16px;
  }
  
  p {
    font-family: var(--font-primary);
    font-size: 0.9rem;
    color: var(--color-text-secondary);
    margin: 0;
    line-height: 1.5;
  }
`;

const StarRating = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
  
  .star {
    font-size: 2rem;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--color-text-muted);
    
    &.filled {
      color: var(--color-accent-gold);
      text-shadow: 0 0 10px rgba(248, 179, 25, 0.5);
    }
    
    &:hover {
      transform: scale(1.1);
      color: var(--color-accent-gold);
    }
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  
  label {
    display: block;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-text-primary);
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  input, textarea {
    width: 100%;
    background: var(--color-glass-panel);
    backdrop-filter: var(--glass-blur-subtle);
    border: 1px solid var(--color-glass-border);
    border-radius: 8px;
    padding: 12px;
    font-family: var(--font-primary);
    font-size: 0.9rem;
    color: var(--color-text-primary);
    box-sizing: border-box;
    
    &::placeholder {
      color: var(--color-text-muted);
      font-style: italic;
    }
    
    &:focus {
      outline: none;
      border-color: var(--color-accent-gold);
      box-shadow: 0 0 0 2px rgba(248, 179, 25, 0.2);
    }
  }
  
  textarea {
    min-height: 100px;
    resize: vertical;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
`;

const Button = styled(motion.button)<{ variant?: 'primary' | 'secondary' }>`
  background: ${props => props.variant === 'primary' 
    ? 'var(--color-accent-gold)' 
    : 'var(--color-glass-panel)'};
  backdrop-filter: var(--glass-blur-medium);
  border: 1px solid ${props => props.variant === 'primary' 
    ? 'rgba(248, 179, 25, 0.3)' 
    : 'var(--color-glass-border)'};
  border-radius: 8px;
  padding: 12px 24px;
  color: var(--color-text-primary);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    background: ${props => props.variant === 'primary' 
      ? 'rgba(248, 179, 25, 0.9)' 
      : 'var(--color-glass-accent)'};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled(motion.div)`
  text-align: center;
  padding: 32px;
  
  .icon {
    font-size: 3rem;
    margin-bottom: 16px;
    display: block;
  }
  
  h3 {
    font-family: var(--font-display);
    font-size: 1.2rem;
    color: var(--color-text-primary);
    margin: 0 0 8px 0;
  }
  
  p {
    font-family: var(--font-primary);
    font-size: 0.9rem;
    color: var(--color-text-secondary);
    margin: 0;
    line-height: 1.5;
  }
`;

interface FeedbackData {
  rating: number;
  feedback: string;
  email: string;
  userAgent: string;
  timestamp: string;
}

const FeedbackModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleSubmit = async () => {
    if (rating === 0 || !feedback.trim()) return;
    
    setIsSubmitting(true);
    
    const feedbackData: FeedbackData = {
      rating,
      feedback: feedback.trim(),
      email: email.trim(),
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });
      
      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsOpen(false);
          setIsSubmitted(false);
          setRating(0);
          setFeedback('');
          setEmail('');
        }, 3000);
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsSubmitted(false);
    setRating(0);
    setFeedback('');
    setEmail('');
  };

  return (
    <>
      <FeedbackButton
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>💭</span>
        <span>FEEDBACK</span>
      </FeedbackButton>

      <AnimatePresence>
        {isOpen && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <ModalContainer
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {isSubmitted ? (
                <SuccessMessage
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="icon">🙏</span>
                  <h3>Thank You!</h3>
                  <p>Your feedback has been sent successfully. We appreciate your input during our beta phase!</p>
                </SuccessMessage>
              ) : (
                <>
                  <ModalHeader>
                    <div className="beta-badge">Beta Feedback</div>
                    <h2>Help Us Improve LOKI 2032</h2>
                    <p>Your honest feedback helps us build a better trading platform. Share your experience and suggestions!</p>
                  </ModalHeader>

                  <StarRating>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star ${star <= rating ? 'filled' : ''}`}
                        onClick={() => handleStarClick(star)}
                      >
                        ⭐
                      </span>
                    ))}
                  </StarRating>

                  <FormGroup>
                    <label>Your Feedback *</label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Tell us what you think about LOKI 2032... What works well? What could be improved? Any bugs or suggestions?"
                      maxLength={1000}
                    />
                  </FormGroup>

                  <FormGroup>
                    <label>Your Email (Optional)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com (so we can follow up)"
                    />
                  </FormGroup>

                  <ButtonGroup>
                    <Button
                      variant="secondary"
                      onClick={handleClose}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleSubmit}
                      disabled={rating === 0 || !feedback.trim() || isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Feedback'}
                    </Button>
                  </ButtonGroup>
                </>
              )}
            </ModalContainer>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default FeedbackModal;
