import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { 
  Play, 
  Clock, 
  CheckCircle, 
  Zap, 
  Shield, 
  BarChart3, 
  Globe,
  Users,
  Loader,
  XCircle
} from 'lucide-react';
import { scanService, emailService } from '../services/api';

// Styled components inspired by Monday.com design
const LandingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #6c5ce7 0%, #fd79a8 100%);
  color: white;
  overflow-x: hidden;
`;

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  z-index: 1000;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #d63384 0%, #20c997 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a`
  color: #666;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  cursor: pointer;
  
  &:hover {
    color: #6c5ce7;
  }
`;

const HealthStatus = styled.div<{ status: 'checking' | 'healthy' | 'error' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  background: ${props => 
    props.status === 'healthy' ? '#d4edda' : 
    props.status === 'error' ? '#f8d7da' : '#fff3cd'};
  color: ${props => 
    props.status === 'healthy' ? '#155724' : 
    props.status === 'error' ? '#721c24' : '#856404'};
  cursor: ${props => props.status === 'error' ? 'pointer' : 'default'};
  transition: all 0.3s ease;
  
  ${props => props.status === 'error' && `
    &:hover {
      background: #f5c6cb;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(220, 53, 69, 0.2);
    }
  `}
`;

const HeroSection = styled.section`
  padding: 8rem 2rem 4rem;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #fff 0%, #e0e0e0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 3rem;
  opacity: 0.9;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const ScanForm = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  margin: 0 auto 3rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

const FormTitle = styled.h3`
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  font-weight: 600;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  text-align: left;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
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

const ScanTypeSelector = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ScanTypeButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.active ? '#6c5ce7' : '#e0e0e0'};
  background: ${props => props.active ? '#6c5ce7' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    border-color: #6c5ce7;
    background: ${props => props.active ? '#5a4fcf' : '#f8f7ff'};
  }
`;

const DateTimeInput = styled.input`
  width: 100%;
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

const CheckboxGroup = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const Checkbox = styled.input`
  width: 1.2rem;
  height: 1.2rem;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.1rem;
  
  &:checked {
    background-color: #6c5ce7;
    border-color: #6c5ce7;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.1);
  }
`;

const CheckboxLabel = styled.label`
  color: #555;
  font-size: 0.9rem;
  line-height: 1.4;
  cursor: pointer;
  flex: 1;
`;

const StartScanButton = styled.button`
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #6c5ce7 0%, #fd79a8 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(108, 92, 231, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const FeaturesSection = styled.section`
  background: white;
  color: #333;
  padding: 5rem 2rem;
`;

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #333;
`;

const SectionSubtitle = styled.p`
  text-align: center;
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 4rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
`;

const FeatureIcon = styled.div<{ color: string }>`
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

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
`;

const FeatureDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

const ToolsSection = styled.section`
  background: #f8f9fa;
  padding: 5rem 2rem;
`;

const ToolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const ToolCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
`;

const ToolLogo = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
  background: linear-gradient(135deg, #6c5ce7 0%, #fd79a8 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: bold;
`;

const Footer = styled.footer`
  background: #333;
  color: white;
  padding: 3rem 2rem 1rem;
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

const ComingSoonBadge = styled.span`
  background: #ffd93d;
  color: #333;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 0.5rem;
`;

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [healthStatus, setHealthStatus] = useState<'checking' | 'healthy' | 'error'>('checking');
  const [scanType, setScanType] = useState<'immediate' | 'scheduled'>('immediate');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    url: '',
    scheduledTime: '',
    marketingEmails: false
  });

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      await scanService.checkHealth();
      setHealthStatus('healthy');
    } catch (error) {
      setHealthStatus('error');
    }
  };

  const handleHealthStatusClick = async () => {
    if (healthStatus === 'error') {
      // Show initial message
      toast.info('🚀 Waking up the server! This tool is completely free, so please be patient while we boot up the server - this may take a minute or so. Thanks for your understanding!', {
        autoClose: 10000
      });

      // Start checking the backend periodically
      setHealthStatus('checking');
      
      // Try to ping the backend immediately
      try {
        await scanService.checkHealth();
        setHealthStatus('healthy');
        toast.success('🎉 Server is now online and ready!', { autoClose: 5000 });
        return;
      } catch (error) {
        // Server still not ready, start periodic checking
      }

      // Check every 3 seconds for up to 2 minutes
      let attempts = 0;
      const maxAttempts = 40; // 40 attempts × 3 seconds = 2 minutes
      
      const checkInterval = setInterval(async () => {
        attempts++;
        try {
          await scanService.checkHealth();
          setHealthStatus('healthy');
          toast.success('🎉 Server is now online and ready!', { autoClose: 5000 });
          clearInterval(checkInterval);
        } catch (error) {
          if (attempts >= maxAttempts) {
            setHealthStatus('error');
            toast.error('Server is taking longer than expected. Please try again later.', { autoClose: 8000 });
            clearInterval(checkInterval);
          }
        }
      }, 3000);
    }
  };

  const handleScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.url) return;

    setLoading(true);
    try {
      if (scanType === 'immediate') {
        const result = await scanService.runImmediateScan(formData.email, formData.url);
        
        // Store email for marketing if user opted in
        if (formData.marketingEmails) {
          try {
            await emailService.storeEmail(formData.email, formData.name);
            toast.success(`✅ Scan queued successfully! Job ID: ${result.job_id}. You've been subscribed to our updates.`);
          } catch (emailError) {
            console.warn('Failed to store email for marketing:', emailError);
            // Email storage failed but don't bother the user - scan still works
            toast.success(`✅ Scan queued successfully! Job ID: ${result.job_id}`);
          }
        } else {
          toast.success(`✅ Scan queued successfully! Job ID: ${result.job_id}`);
        }
      } else {
        // For now, just show coming soon message
        toast.info('Scheduled scans are coming soon!');
      }
      
      // Reset form
      setFormData({ name: '', email: '', url: '', scheduledTime: '', marketingEmails: false });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to start scan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LandingContainer>
      <Header>
        <Nav>
          <Logo>
            <LogoIcon>S</LogoIcon>
            Scanmesite.com
          </Logo>
          <NavLinks>
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#tools">Tools</NavLink>
            <NavLink onClick={() => navigate('/support')}>Support</NavLink>
            <NavLink onClick={() => navigate('/privacy')}>Privacy</NavLink>
            <NavLink onClick={() => navigate('/terms')}>Terms</NavLink>
          </NavLinks>
                    <HealthStatus status={healthStatus} onClick={handleHealthStatusClick}>
            {healthStatus === 'checking' && <Loader className="icon" />}
            {healthStatus === 'healthy' && <CheckCircle className="icon" />}
            {healthStatus === 'error' && <XCircle className="icon" />}
            {healthStatus === 'checking' && 'Checking API...'}
            {healthStatus === 'healthy' && 'API Online'}
            {healthStatus === 'error' && 'Click here to wake the server up'}
          </HealthStatus>
        </Nav>
      </Header>

      <HeroSection>
        <HeroTitle>
          Make Your Website Accessible to Everyone
        </HeroTitle>
        <HeroSubtitle>
          Automated accessibility scanning powered by Lighthouse and DOM analysis. 
          Get comprehensive reports delivered to your inbox and ensure your website 
          complies with WCAG guidelines.
        </HeroSubtitle>

        <ScanForm>
          <FormTitle>Start Your Accessibility Scan</FormTitle>
          <form onSubmit={handleScanSubmit}>
            <FormGroup>
              <Label>Your Name</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Email Address</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Website URL</Label>
              <Input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://yourwebsite.com"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Scan Type</Label>
              <ScanTypeSelector>
                <ScanTypeButton
                  type="button"
                  active={scanType === 'immediate'}
                  onClick={() => setScanType('immediate')}
                >
                  <Play size={16} />
                  Run Now
                </ScanTypeButton>
                <ScanTypeButton
                  type="button"
                  active={scanType === 'scheduled'}
                  onClick={() => setScanType('scheduled')}
                >
                  <Clock size={16} />
                  Schedule
                  <ComingSoonBadge>Soon</ComingSoonBadge>
                </ScanTypeButton>
              </ScanTypeSelector>
            </FormGroup>

            {scanType === 'scheduled' && (
              <FormGroup>
                <Label>Scheduled Time</Label>
                <DateTimeInput
                  type="datetime-local"
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </FormGroup>
            )}

            <CheckboxGroup>
              <Checkbox
                type="checkbox"
                id="marketingEmails"
                checked={formData.marketingEmails}
                onChange={(e) => setFormData({ ...formData, marketingEmails: e.target.checked })}
              />
              <CheckboxLabel htmlFor="marketingEmails">
                I agree to receive marketing emails about new features, tips, and accessibility best practices.
              </CheckboxLabel>
            </CheckboxGroup>

            <StartScanButton type="submit" disabled={loading || healthStatus === 'error'}>
              {loading ? (
                <span>Loading...</span>
              ) : (
                <>
                  <Zap size={20} />
                  Start Accessibility Scan
                </>
              )}
            </StartScanButton>
          </form>
        </ScanForm>
      </HeroSection>

      <FeaturesSection id="features">
        <FeaturesContainer>
          <SectionTitle>How Scanmesite.com Works</SectionTitle>
          <SectionSubtitle>
            Our automated system scans your website using industry-leading tools 
            and provides actionable insights to improve accessibility.
          </SectionSubtitle>
          
          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon color="linear-gradient(135deg, #6c5ce7 0%, #fd79a8 100%)">
                <Globe size={24} />
              </FeatureIcon>
              <FeatureTitle>Submit Your URL</FeatureTitle>
              <FeatureDescription>
                Simply enter your website URL and email address. Our system will 
                queue your scan and begin the accessibility analysis process.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon color="linear-gradient(135deg, #20c997 0%, #6c5ce7 100%)">
                <BarChart3 size={24} />
              </FeatureIcon>
              <FeatureTitle>Automated Analysis</FeatureTitle>
              <FeatureDescription>
                We run comprehensive scans using Lighthouse accessibility audits 
                and DOM analysis to identify issues and compliance gaps.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon color="linear-gradient(135deg, #fd79a8 0%, #20c997 100%)">
                <Users size={24} />
              </FeatureIcon>
              <FeatureTitle>Detailed Reports</FeatureTitle>
              <FeatureDescription>
                Receive comprehensive reports via email with actionable 
                recommendations, severity levels, and step-by-step fixing guides.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </FeaturesContainer>
      </FeaturesSection>

      <ToolsSection id="tools">
        <FeaturesContainer>
          <SectionTitle>Powered by Industry-Leading Tools</SectionTitle>
          <SectionSubtitle>
            We leverage the best accessibility testing tools to ensure 
            comprehensive and accurate results.
          </SectionSubtitle>
          
          <ToolsGrid>
            <ToolCard>
              <ToolLogo>L</ToolLogo>
              <FeatureTitle>Lighthouse</FeatureTitle>
              <FeatureDescription>
                Google's automated tool for improving web page quality 
                with comprehensive accessibility audits.
              </FeatureDescription>
            </ToolCard>

            <ToolCard>
              <ToolLogo>D</ToolLogo>
              <FeatureTitle>DOM Analysis</FeatureTitle>
              <FeatureDescription>
                Deep structural analysis of your HTML elements 
                to identify accessibility barriers.
              </FeatureDescription>
            </ToolCard>

            <ToolCard>
              <ToolLogo>W</ToolLogo>
              <FeatureTitle>WCAG Guidelines</FeatureTitle>
              <FeatureDescription>
                Compliance checking against WCAG 2.1 AA standards 
                for comprehensive accessibility coverage.
              </FeatureDescription>
            </ToolCard>

            <ToolCard>
              <ToolLogo>A</ToolLogo>
              <FeatureTitle>axe-core</FeatureTitle>
              <FeatureDescription>
                Industry-standard accessibility testing engine 
                for precise issue detection and reporting.
              </FeatureDescription>
            </ToolCard>
          </ToolsGrid>
        </FeaturesContainer>
      </ToolsSection>

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
                <li><NavLink onClick={() => navigate('/privacy')}>Privacy Policy</NavLink></li>
                <li><NavLink onClick={() => navigate('/terms')}>Terms of Service</NavLink></li>
                <li><NavLink onClick={() => navigate('/support')}>Support</NavLink></li>
              </ul>
            </FooterSection>
          </FooterGrid>

          <FooterBottom>
            <p>&copy; 2025 Scanmesite.com. All rights reserved.</p>
          </FooterBottom>
        </FooterContainer>
      </Footer>
    </LandingContainer>
  );
};
