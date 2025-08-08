import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { colors } from '../styles/components';
import { scanService } from '../services/api';

const HealthCheckWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
`;

const HealthCheckSuccess = styled(HealthCheckWrapper)`
  background-color: ${colors.success[50]};
  color: ${colors.success[700]};
  border: 1px solid ${colors.success[100]};
`;

const HealthCheckError = styled(HealthCheckWrapper)`
  background-color: ${colors.error[50]};
  color: ${colors.error[700]};
  border: 1px solid ${colors.error[100]};
`;

const HealthCheckLoading = styled(HealthCheckWrapper)`
  background-color: ${colors.gray[50]};
  color: ${colors.gray[700]};
  border: 1px solid ${colors.gray[100]};
`;

interface HealthCheckProps {
  showDetails?: boolean;
}

const HealthCheck: React.FC<HealthCheckProps> = ({ showDetails = false }) => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Checking backend connection...');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await scanService.checkHealth();
        if (response.status === 'ok') {
          setStatus('success');
          setMessage('Backend connection successful');
        } else {
          setStatus('error');
          setMessage('Backend returned unexpected status');
        }
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'Failed to connect to backend');
      }
    };

    checkHealth();
  }, []);

  if (!showDetails && status === 'success') {
    return null; // Don't show anything if healthy and details not requested
  }

  if (status === 'loading') {
    return (
      <HealthCheckLoading>
        <AlertCircle size={16} />
        {message}
      </HealthCheckLoading>
    );
  }

  if (status === 'success') {
    return (
      <HealthCheckSuccess>
        <CheckCircle size={16} />
        {message}
      </HealthCheckSuccess>
    );
  }

  return (
    <HealthCheckError>
      <XCircle size={16} />
      {message}
    </HealthCheckError>
  );
};

export default HealthCheck;
