import React from 'react';
import styled from 'styled-components';
import { LoadingSpinner, colors } from '../styles/components';

const LoadingWrapper = styled.div<{ $fullscreen?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  
  ${({ $fullscreen }) => $fullscreen && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    z-index: 100;
  `}
`;

const LoadingText = styled.p`
  color: ${colors.gray[600]};
  font-size: 0.875rem;
`;

const LargeSpinner = styled(LoadingSpinner)`
  width: 2rem;
  height: 2rem;
  border-width: 3px;
`;

interface LoadingProps {
  message?: string;
  fullscreen?: boolean;
  size?: 'small' | 'large';
}

const Loading: React.FC<LoadingProps> = ({ 
  message = 'Loading...', 
  fullscreen = false,
  size = 'large'
}) => {
  return (
    <LoadingWrapper $fullscreen={fullscreen}>
      {size === 'large' ? <LargeSpinner /> : <LoadingSpinner />}
      <LoadingText>{message}</LoadingText>
    </LoadingWrapper>
  );
};

export default Loading;
