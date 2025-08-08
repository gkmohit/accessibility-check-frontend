import React, { useState } from 'react';
import styled from 'styled-components';
import { ArrowLeft, BookOpen, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
  padding: 2rem;
`;

const ContentWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
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

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 1rem;
  font-size: 2.5rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
`;

const SupportGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const SupportCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
`;

const CardIcon = styled.div<{ color: string }>`
  width: 60px;
  height: 60px;
  background: ${props => props.color};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: white;
`;

const CardTitle = styled.h3`
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
`;

const CardDescription = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const CardButton = styled.button`
  background: #6c5ce7;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: #5a4fcf;
  }
`;

const FAQSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
`;

const FAQTitle = styled.h2`
  color: #333;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
`;

const FAQItem = styled.div`
  border-bottom: 1px solid #eee;
  padding: 1.5rem 0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const FAQQuestion = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  
  &:hover {
    color: #6c5ce7;
  }
`;

const FAQAnswer = styled.div<{ isOpen: boolean }>`
  max-height: ${props => props.isOpen ? '200px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
  padding-top: ${props => props.isOpen ? '1rem' : '0'};
  
  p {
    color: #666;
    line-height: 1.6;
  }
`;

const ContactForm = styled.form`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const FormTitle = styled.h2`
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: #555;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #6c5ce7;
    box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #6c5ce7;
    box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.1);
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #6c5ce7 0%, #fd79a8 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(108, 92, 231, 0.3);
  }
`;

const Footer = styled.footer`
  background: #333;
  color: white;
  padding: 3rem 2rem 1rem;
  margin-top: 3rem;
`;

const FooterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const FooterSection = styled.div`
  h4 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #fd79a8;
  }
  
  ul {
    list-style: none;
    padding: 0;
    
    li {
      margin-bottom: 0.5rem;
    }
    
    a {
      color: #ccc;
      text-decoration: none;
      transition: color 0.3s ease;
      
      &:hover {
        color: white;
      }
    }
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid #555;
  padding-top: 1rem;
  text-align: center;
  color: #999;
`;

const faqData = [
  {
    question: "How does Scanmesite.com work?",
    answer: "Scanmesite.com uses Google Lighthouse and DOM analysis to scan your website for accessibility issues. Simply enter your website URL and email, and we'll send you a comprehensive report with actionable recommendations."
  },
  {
    question: "What accessibility standards do you check against?",
    answer: "We check against WCAG 2.1 AA guidelines, which are the internationally recognized standards for web accessibility. Our scans cover all major accessibility criteria including keyboard navigation, screen reader compatibility, color contrast, and more."
  },
  {
    question: "How long does a scan take?",
    answer: "Most scans complete within 2-5 minutes, depending on the size and complexity of your website. You'll receive an email notification when your report is ready."
  },
  {
    question: "Is there a limit to how many pages I can scan?",
    answer: "For immediate scans, we analyze your homepage and up to 10 linked pages. For comprehensive site audits, please contact our support team for custom solutions."
  },
  {
    question: "Do you store my website data?",
    answer: "We temporarily store scan results for 30 days to generate your reports. We do not permanently store your website content or personal data beyond what's necessary for the service."
  },
  {
    question: "Can I scan websites I don't own?",
    answer: "You should only scan websites you own or have explicit permission to test. Scanning websites without permission may violate our terms of service."
  }
];

export const Support: React.FC = () => {
  const navigate = useNavigate();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const handleFAQToggle = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <Container>
      <ContentWrapper>
        <BackButton onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          Back to Home
        </BackButton>
        
        <Header>
          <Title>Support Center</Title>
          <Subtitle>
            Get help with Scanmesite.com, learn about accessibility best practices, 
            and connect with our support team.
          </Subtitle>
        </Header>

        <SupportGrid>
          <SupportCard>
            <CardIcon color="linear-gradient(135deg, #6c5ce7 0%, #fd79a8 100%)">
              <BookOpen size={24} />
            </CardIcon>
            <CardTitle>Documentation</CardTitle>
            <CardDescription>
              Comprehensive guides and documentation to help you get the most 
              out of Scanmesite.com's accessibility testing features.
            </CardDescription>
            <CardButton onClick={() => window.open('/docs', '_blank')}>
              View Docs
            </CardButton>
          </SupportCard>
        </SupportGrid>

        <FAQSection>
          <FAQTitle>Frequently Asked Questions</FAQTitle>
          {faqData.map((faq, index) => (
            <FAQItem key={index}>
              <FAQQuestion onClick={() => handleFAQToggle(index)}>
                {faq.question}
                <HelpCircle size={20} />
              </FAQQuestion>
              <FAQAnswer isOpen={openFAQ === index}>
                <p>{faq.answer}</p>
              </FAQAnswer>
            </FAQItem>
          ))}
        </FAQSection>

        <Footer>
          <FooterContainer>
            <FooterGrid>
              <FooterSection>
                <h4>Scanmesite.com</h4>
                <p>
                  Making the web accessible for everyone through automated 
                  accessibility scanning and comprehensive reporting.
                </p>
              </FooterSection>

              <FooterSection>
                <h4>Product</h4>
                <ul>
                  <li><a href="#features">Features</a></li>
                  <li><a href="#tools">Tools</a></li>
                </ul>
              </FooterSection>

              <FooterSection>
                <h4>Company</h4>
                <ul>
                  <li><a href="/about">About Us</a></li>
                  <li><a href="/blog">Blog</a></li>
                  <li><a href="/contact">Contact</a></li>
                </ul>
              </FooterSection>

              <FooterSection>
                <h4>Legal</h4>
                <ul>
                  <li><a href="/privacy">Privacy Policy</a></li>
                  <li><a href="/terms">Terms of Service</a></li>
                  <li><a href="/support">Support</a></li>
                </ul>
              </FooterSection>
            </FooterGrid>

            <FooterBottom>
              <p>&copy; 2025 Scanmesite.com. All rights reserved.</p>
            </FooterBottom>
          </FooterContainer>
        </Footer>
      </ContentWrapper>
    </Container>
  );
};
