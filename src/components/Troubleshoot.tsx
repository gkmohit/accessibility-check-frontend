import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Card, colors } from '../styles/components';
import { scanService } from '../services/api';

const TroubleshootWrapper = styled(Card)`
  margin-bottom: 1rem;
  background: ${colors.gray[50]};
  border: 1px solid ${colors.gray[200]};
`;

const TroubleshootTitle = styled.h4`
  color: ${colors.gray[700]};
  margin-bottom: 1rem;
  font-size: 1rem;
  font-weight: 600;
`;

const TestButton = styled(Button)`
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
`;

const ResultArea = styled.pre`
  background: ${colors.gray[800]};
  color: ${colors.gray[100]};
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  overflow-x: auto;
  margin-top: 1rem;
`;

const Troubleshoot: React.FC = () => {
  const [results, setResults] = useState<string>('');
  const [loading, setLoading] = useState<string>('');

  const testEndpoint = async (name: string, testFn: () => Promise<any>) => {
    setLoading(name);
    try {
      const result = await testFn();
      setResults(prev => prev + `✅ ${name}: ${JSON.stringify(result, null, 2)}\n\n`);
    } catch (error: any) {
      setResults(prev => prev + `❌ ${name}: ${error.message}\n${error.stack || ''}\n\n`);
    } finally {
      setLoading('');
    }
  };

  const tests = [
    {
      name: 'Health Check',
      fn: () => scanService.checkHealth()
    },
    {
      name: 'Direct API Call',
      fn: async () => {
        const response = await fetch('http://localhost:8000/health');
        return await response.json();
      }
    },
    {
      name: 'Run Immediate Scan',
      fn: () => scanService.runImmediateScan('test@gmail.com', 'https://example.com')
    },
    {
      name: 'List Jobs',
      fn: () => scanService.listScheduledJobs()
    }
  ];

  return (
    <TroubleshootWrapper>
      <TroubleshootTitle>API Troubleshooting</TroubleshootTitle>
      <div>
        {tests.map(test => (
          <TestButton
            key={test.name}
            onClick={() => testEndpoint(test.name, test.fn)}
            disabled={!!loading}
            variant="secondary"
            size="sm"
          >
            {loading === test.name ? 'Testing...' : test.name}
          </TestButton>
        ))}
        <TestButton
          onClick={() => setResults('')}
          variant="secondary"
          size="sm"
        >
          Clear
        </TestButton>
      </div>
      {results && <ResultArea>{results}</ResultArea>}
    </TroubleshootWrapper>
  );
};

export default Troubleshoot;
