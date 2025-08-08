import React from 'react';
import styled from 'styled-components';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
  padding: 2rem;
`;

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #6c5ce7;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 2rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: #5a4fcf;
  }
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: 700;
`;

const Section = styled.section`
  margin-bottom: 2rem;
  
  h2 {
    color: #333;
    margin-bottom: 1rem;
    font-size: 1.5rem;
    font-weight: 600;
  }
  
  h3 {
    color: #555;
    margin-bottom: 0.75rem;
    font-size: 1.25rem;
    font-weight: 600;
  }
  
  p, li {
    color: #666;
    line-height: 1.6;
    margin-bottom: 1rem;
  }
  
  ul {
    padding-left: 1.5rem;
  }
`;

const LastUpdated = styled.p`
  color: #999;
  font-style: italic;
  margin-bottom: 2rem;
`;

export const Terms: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <ContentWrapper>
        <BackButton onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          Back to Home
        </BackButton>
        
        <Title>Terms and Conditions</Title>
        <LastUpdated>Last updated: August 8, 2025</LastUpdated>
        
        <Section>
          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing and using Scanmesite.com ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </Section>

        <Section>
          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of Scanmesite.com for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul>
            <li>modify or copy the materials</li>
            <li>use the materials for any commercial purpose or for any public display</li>
            <li>attempt to reverse engineer any software contained in AccessiScan</li>
            <li>remove any copyright or other proprietary notations from the materials</li>
          </ul>
        </Section>

        <Section>
          <h2>3. Service Description</h2>
          <p>
            Scanmesite.com provides automated website accessibility scanning services using industry-standard tools including Lighthouse and DOM analysis. The service generates reports based on WCAG 2.1 AA guidelines.
          </p>
        </Section>

        <Section>
          <h2>4. User Accounts and Data</h2>
          <h3>4.1 Account Creation</h3>
          <p>
            Users may submit websites for scanning by providing an email address and website URL. No formal account registration is required for basic scanning services.
          </p>
          <h3>4.2 Data Collection</h3>
          <p>
            We collect only the email addresses and website URLs you provide. Scan results are temporarily stored to generate reports.
          </p>
        </Section>

        <Section>
          <h2>5. Acceptable Use</h2>
          <p>
            You agree not to use the Service to:
          </p>
          <ul>
            <li>Scan websites you do not own or have permission to test</li>
            <li>Overwhelm our servers with excessive requests</li>
            <li>Attempt to circumvent usage limitations</li>
            <li>Use the service for any illegal or unauthorized purposes</li>
          </ul>
        </Section>

        <Section>
          <h2>6. Service Availability</h2>
          <p>
            We strive to maintain high availability but do not guarantee uninterrupted service. The Service may be temporarily unavailable due to maintenance, updates, or technical issues.
          </p>
        </Section>

        <Section>
          <h2>7. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are owned by Scanmesite.com and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>
        </Section>

        <Section>
          <h2>8. Disclaimer</h2>
          <p>
            The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, Scanmesite.com excludes all representations, warranties, conditions and terms that may otherwise be implied.
          </p>
        </Section>

        <Section>
          <h2>9. Limitations</h2>
          <p>
            In no event shall Scanmesite.com or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Scanmesite.com, even if Scanmesite.com or an authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>
        </Section>

        <Section>
          <h2>10. Revisions and Errata</h2>
          <p>
            The materials appearing on Scanmesite.com could include technical, typographical, or photographic errors. Scanmesite.com does not warrant that any of the materials on its website are accurate, complete, or current.
          </p>
        </Section>

        <Section>
          <h2>11. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
          </p>
        </Section>

        <Section>
          <h2>12. Contact Information</h2>
          <p>
            If you have any questions about these Terms and Conditions, please contact us at:
          </p>
          <p>
            Email: legal@scanmesite.com<br />
            Website: <a href="/">scanmesite.com</a>
          </p>
        </Section>
      </ContentWrapper>
    </Container>
  );
};
