import React from 'react';
import styled from 'styled-components';
import { Container } from '../styles/components';
import NewScanForm from '../components/NewScanForm';

const NewScanContainer = styled(Container)`
  padding-top: 2rem;
  padding-bottom: 2rem;
`;

const NewScan: React.FC = () => {
  return (
    <NewScanContainer>
      <NewScanForm />
    </NewScanContainer>
  );
};

export default NewScan;
