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

export const Privacy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <ContentWrapper>
        <BackButton onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          Back to Home
        </BackButton>
        
        <Title>Privacy Policy</Title>
        <LastUpdated>Last updated: August 8, 2025</LastUpdated>
        
        <Section>
          <h2>1. Information We Collect</h2>
          <h3>1.1 Information You Provide</h3>
          <p>
            When you use Scanmesite.com, we collect:
          </p>
          <ul>
            <li><strong>Email Address:</strong> Required to send you accessibility scan reports</li>
            <li><strong>Website URLs:</strong> The websites you submit for accessibility scanning</li>
          </ul>
          
          <h3>1.2 Automatically Collected Information</h3>
          <p>
            We may automatically collect certain technical information when you use our service:
          </p>
          <ul>
            <li>IP addresses for security and analytics purposes</li>
            <li>Browser type and version</li>
            <li>Usage patterns and service performance data</li>
          </ul>
        </Section>

        <Section>
          <h2>2. How We Use Your Information</h2>
          <p>
            We use the collected information for the following purposes:
          </p>
          <ul>
            <li><strong>Service Delivery:</strong> To perform accessibility scans and deliver reports to your email</li>
            <li><strong>Service Improvement:</strong> To analyze usage patterns and improve our scanning algorithms</li>
            <li><strong>Communication:</strong> To send you scan results and important service updates</li>
            <li><strong>Security:</strong> To protect against fraud, abuse, and security threats</li>
          </ul>
        </Section>

        <Section>
          <h2>3. Information Sharing and Disclosure</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personal information to third parties, except:
          </p>
          <ul>
            <li><strong>Service Providers:</strong> We may share information with trusted third-party services that help us operate our platform (email delivery, cloud hosting)</li>
            <li><strong>Legal Requirements:</strong> We may disclose information when required by law or to protect our rights and safety</li>
            <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets</li>
          </ul>
        </Section>

        <Section>
          <h2>4. Data Storage and Security</h2>
          <h3>4.1 Data Retention</h3>
          <p>
            We retain your information for as long as necessary to provide our services:
          </p>
          <ul>
            <li>Scan results are typically stored for 30 days</li>
            <li>Email addresses are retained until you request deletion</li>
            <li>System logs are retained for security and debugging purposes for up to 90 days</li>
          </ul>
          
          <h3>4.2 Security Measures</h3>
          <p>
            We implement appropriate security measures to protect your information:
          </p>
          <ul>
            <li>Encrypted data transmission using HTTPS</li>
            <li>Secure cloud storage with access controls</li>
            <li>Regular security audits and updates</li>
            <li>Limited access to personal data on a need-to-know basis</li>
          </ul>
        </Section>

        <Section>
          <h2>5. Cookies and Tracking</h2>
          <p>
            Scanmesite.com uses minimal tracking:
          </p>
          <ul>
            <li><strong>Essential Cookies:</strong> Required for basic service functionality</li>
            <li><strong>Analytics:</strong> We may use anonymized analytics to improve our service</li>
            <li><strong>No Advertising:</strong> We do not use cookies for advertising or cross-site tracking</li>
          </ul>
        </Section>

        <Section>
          <h2>6. Your Rights and Choices</h2>
          <p>
            You have the following rights regarding your personal information:
          </p>
          <ul>
            <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
            <li><strong>Deletion:</strong> Request deletion of your personal data (subject to legal obligations)</li>
            <li><strong>Portability:</strong> Request a copy of your data in a machine-readable format</li>
            <li><strong>Opt-out:</strong> Unsubscribe from our communications at any time</li>
          </ul>
        </Section>

        <Section>
          <h2>7. Third-Party Services</h2>
          <p>
            Our service integrates with third-party tools for accessibility scanning:
          </p>
          <ul>
            <li><strong>Google Lighthouse:</strong> For automated accessibility audits</li>
            <li><strong>Cloud Infrastructure:</strong> For hosting and data processing</li>
          </ul>
          <p>
            These services have their own privacy policies, and we encourage you to review them.
          </p>
        </Section>

        <Section>
          <h2>8. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with applicable privacy laws.
          </p>
        </Section>

        <Section>
          <h2>9. Children's Privacy</h2>
          <p>
            Scanmesite.com is not intended for use by children under 13 years of age. We do not knowingly collect personal information from children under 13.
          </p>
        </Section>

        <Section>
          <h2>10. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify users of any material changes by:
          </p>
          <ul>
            <li>Posting the updated policy on our website</li>
            <li>Updating the "Last updated" date</li>
            <li>Sending email notifications for significant changes</li>
          </ul>
        </Section>

        <Section>
          <h2>11. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our privacy practices, please contact us:
          </p>
          <p>
            Email: privacy@scanmesite.com<br />
            Website: <a href="/">scanmesite.com</a><br />
            Mail: Scanmesite.com Privacy Team, [Address]
          </p>
        </Section>

        <Section>
          <h2>12. Data Protection Officer</h2>
          <p>
            For EU residents, you can contact our Data Protection Officer at:
          </p>
          <p>
            Email: dpo@scanmesite.com
          </p>
        </Section>
      </ContentWrapper>
    </Container>
  );
};
