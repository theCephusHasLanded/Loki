import styled from '@emotion/styled';

export const NeomorphicSurface = styled.div`
  background: var(--color-glass-base);
  backdrop-filter: var(--glass-blur-medium) saturate(150%);
  border: 1px solid var(--color-glass-border);
  border-radius: 16px;
  box-shadow: 
    var(--glass-shadow-depth),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.05) 0%, 
      transparent 50%, 
      rgba(0, 0, 0, 0.05) 100%);
    border-radius: inherit;
    pointer-events: none;
  }
`;

export default NeomorphicSurface;
