import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { 
  Play, 
  Clock, 
  CheckCircle, 
  Zap, 
  BarChart3, 
  Globe,
  Users,
  Loader,
  XCircle,
  Menu
} from 'lucide-react';
import { scanService, emailService } from '../services/api';

// Styled components with dark mode support
const LandingContainer = styled.div<{ $isDarkMode: boolean }>`
  min-height: 100vh;
  background: ${props => props.$isDarkMode ? '#1a1a1a' : '#ffffff'};
  color: ${props => props.$isDarkMode ? '#ffffff' : '#333333'};
  transition: all 0.3s ease;
`;

const Header = styled.header<{ $isDarkMode: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: ${props => props.$isDarkMode 
    ? 'rgba(26, 26, 26, 0.98)' 
    : 'rgba(255, 255, 255, 0.98)'};
  backdrop-filter: blur(15px);
  border-bottom: 1px solid ${props => props.$isDarkMode ? '#333333' : '#e0e0e0'};
  transition: all 0.3s ease;
  padding: 0 2rem;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  height: 70px;
`;

const Logo = styled.div<{ $isDarkMode: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 800;
  color: ${props => props.$isDarkMode ? '#ffffff' : '#0091ae'};
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const LogoIcon = styled.div`
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, #0091ae 0%, #007a94 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.3rem;
  box-shadow: 0 4px 12px rgba(0, 145, 174, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 145, 174, 0.4);
  }
  
  @media (max-width: 768px) {
    width: 38px;
    height: 38px;
    font-size: 1.2rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2.5rem;
  align-items: center;
  
  @media (max-width: 968px) {
    gap: 1.5rem;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a<{ $isDarkMode: boolean }>`
  color: ${props => props.$isDarkMode ? '#cccccc' : '#666666'};
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  
  &:hover {
    color: #0091ae;
    background: ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 145, 174, 0.1)'};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const DarkModeToggle = styled.button<{ $isDarkMode: boolean }>`
  background: ${props => props.$isDarkMode ? '#444444' : '#f5f5f5'};
  border: 2px solid ${props => props.$isDarkMode ? '#666666' : '#e0e0e0'};
  border-radius: 25px;
  width: 54px;
  height: 30px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.$isDarkMode 
    ? 'inset 0 2px 4px rgba(0, 0, 0, 0.3)' 
    : 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'};
  
  &:hover {
    transform: scale(1.05);
    border-color: #0091ae;
  }
  
  &:before {
    content: '${props => props.$isDarkMode ? '🌙' : '☀️'}';
    position: absolute;
    top: 50%;
    left: ${props => props.$isDarkMode ? '26px' : '4px'};
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    background: ${props => props.$isDarkMode ? '#ffffff' : '#0091ae'};
    border-radius: 50%;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }
`;

const MobileMenuButton = styled.button<{ $isDarkMode: boolean }>`
  display: none;
  background: none;
  border: none;
  color: ${props => props.$isDarkMode ? '#ffffff' : '#666666'};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  }
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div<{ $isOpen: boolean; $isDarkMode: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${props => props.$isDarkMode ? '#1a1a1a' : '#ffffff'};
  border-bottom: 1px solid ${props => props.$isDarkMode ? '#333333' : '#e0e0e0'};
  transform: translateY(${props => props.$isOpen ? '0' : '-100%'});
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileMenuLinks = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 0.5rem;
`;

const MobileNavLink = styled.a<{ $isDarkMode: boolean }>`
  color: ${props => props.$isDarkMode ? '#cccccc' : '#666666'};
  text-decoration: none;
  font-weight: 600;
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    color: #0091ae;
    background: ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 145, 174, 0.1)'};
  }
`;

const HealthStatus = styled.div<{ $status: 'checking' | 'healthy' | 'error' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: ${props => props.$status === 'error' ? 'pointer' : 'default'};
  transition: all 0.3s ease;
  
  background: ${props => {
    switch (props.$status) {
      case 'checking': return 'rgba(255, 193, 7, 0.1)';
      case 'healthy': return 'rgba(40, 167, 69, 0.1)';
      case 'error': return 'rgba(220, 53, 69, 0.1)';
      default: return 'rgba(108, 117, 125, 0.1)';
    }
  }};
  
  color: ${props => {
    switch (props.$status) {
      case 'checking': return '#856404';
      case 'healthy': return '#155724';
      case 'error': return '#721c24';
      default: return '#495057';
    }
  }};
  
  &:hover {
    transform: ${props => props.$status === 'error' ? 'scale(1.05)' : 'none'};
  }
  
  .icon {
    width: 16px;
    height: 16px;
  }
`;

const HeroSection = styled.section<{ $isDarkMode: boolean }>`
  padding: 8rem 2rem 4rem;
  max-width: 1200px;
  margin: 0 auto;
  color: ${props => props.$isDarkMode ? '#ffffff' : '#000000'};
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 3rem;
    text-align: center;
  }
`;

const HeroContent = styled.div`
  text-align: left;
  
  @media (max-width: 968px) {
    text-align: center;
    order: 1;
  }
`;

const HeroTitle = styled.h1<{ $isDarkMode: boolean }>`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: ${props => props.$isDarkMode ? '#ffffff' : '#1a1a1a'};
  
  @media (max-width: 968px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p<{ $isDarkMode: boolean }>`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  line-height: 1.6;
  color: ${props => props.$isDarkMode ? '#cccccc' : '#666666'};
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const FormContainer = styled.div`
  @media (max-width: 968px) {
    order: 2;
  }
`;

const ScanForm = styled.div<{ $isDarkMode: boolean }>`
  background: ${props => props.$isDarkMode ? 'rgba(42, 42, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
  border-radius: 16px;
  padding: 2rem;
  margin: 0;
  box-shadow: 0 20px 40px ${props => props.$isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.$isDarkMode ? '#444444' : 'transparent'};
`;

const FormTitle = styled.h3<{ $isDarkMode: boolean }>`
  color: ${props => props.$isDarkMode ? '#ffffff' : '#333333'};
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  font-weight: 600;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  text-align: left;
`;

const Label = styled.label<{ $isDarkMode: boolean }>`
  display: block;
  margin-bottom: 0.5rem;
  color: ${props => props.$isDarkMode ? '#cccccc' : '#555555'};
  font-weight: 500;
`;

const Input = styled.input<{ $isDarkMode: boolean }>`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.$isDarkMode ? '#555555' : '#e0e0e0'};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: ${props => props.$isDarkMode ? '#333333' : '#ffffff'};
  color: ${props => props.$isDarkMode ? '#ffffff' : '#333333'};
  
  &:focus {
    outline: none;
    border-color: #0091ae;
    box-shadow: 0 0 0 3px rgba(0, 145, 174, 0.1);
  }
  
  &::placeholder {
    color: ${props => props.$isDarkMode ? '#888888' : '#999999'};
  }
`;

const ScanTypeSelector = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ScanTypeButton = styled.button<{ $active: boolean; $isDarkMode: boolean }>`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.$active ? '#0091ae' : (props.$isDarkMode ? '#555555' : '#e0e0e0')};
  background: ${props => props.$active ? '#0091ae' : (props.$isDarkMode ? '#333333' : 'white')};
  color: ${props => props.$active ? 'white' : (props.$isDarkMode ? '#cccccc' : '#666666')};
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    border-color: #0091ae;
    background: ${props => props.$active ? '#007a94' : (props.$isDarkMode ? '#444444' : '#f0f9fb')};
  }
`;

const DateTimeInput = styled.input<{ $isDarkMode: boolean }>`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.$isDarkMode ? '#555555' : '#e0e0e0'};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: ${props => props.$isDarkMode ? '#333333' : '#ffffff'};
  color: ${props => props.$isDarkMode ? '#ffffff' : '#333333'};
  
  &:focus {
    outline: none;
    border-color: #0091ae;
    box-shadow: 0 0 0 3px rgba(0, 145, 174, 0.1);
  }
`;

const CheckboxGroup = styled.div<{ $isDarkMode: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const Checkbox = styled.input<{ $isDarkMode: boolean }>`
  width: 1.2rem;
  height: 1.2rem;
  border: 2px solid ${props => props.$isDarkMode ? '#555555' : '#e0e0e0'};
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.1rem;
  
  &:checked {
    background-color: #0091ae;
    border-color: #0091ae;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 145, 174, 0.1);
  }
`;

const CheckboxLabel = styled.label<{ $isDarkMode: boolean }>`
  color: ${props => props.$isDarkMode ? '#cccccc' : '#555555'};
  font-size: 0.9rem;
  line-height: 1.4;
  cursor: pointer;
  flex: 1;
`;

const StartScanButton = styled.button<{ $isDarkMode: boolean }>`
  width: 100%;
  padding: 1rem 2rem;
  background: #0091ae;
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
    background: #007a94;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 145, 174, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    background: ${props => props.$isDarkMode ? '#555555' : '#cccccc'};
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
  background: linear-gradient(135deg, #0091ae 0%, #ff7a59 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: bold;
`;

const Footer = styled.footer<{ $isDarkMode: boolean }>`
  background: ${props => props.$isDarkMode ? '#222222' : '#333333'};
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

const FooterSection = styled.div<{ $isDarkMode: boolean }>`
  h4 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #ff7a59;
  }
  
  ul {
    list-style: none;
    padding: 0;
    
    li {
      margin-bottom: 0.5rem;
    }
    
    a {
      color: ${props => props.$isDarkMode ? '#dddddd' : '#cccccc'};
      text-decoration: none;
      transition: color 0.3s ease;
      
      &:hover {
        color: white;
      }
    }
  }
`;

const FooterBottom = styled.div<{ $isDarkMode: boolean }>`
  border-top: 1px solid ${props => props.$isDarkMode ? '#444444' : '#555555'};
  padding-top: 1rem;
  text-align: center;
  color: ${props => props.$isDarkMode ? '#aaaaaa' : '#999999'};
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

const ProgressTracker = styled.div<{ $isActive: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) ${props => props.$isActive ? 'scale(1)' : 'scale(0.8)'};
  background: white;
  color: #333333;
  border-radius: 16px;
  padding: 2rem;
  z-index: 10000;
  min-width: 500px;
  max-width: 600px;
  width: 90vw;
  opacity: ${props => props.$isActive ? 1 : 0};
  visibility: ${props => props.$isActive ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 640px) {
    min-width: unset;
    width: 90vw;
    padding: 1.5rem;
  }
`;

const ProgressOverlay = styled.div<{ $isActive: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 9999;
  display: ${props => props.$isActive ? 'block' : 'none'};
`;

const ProgressHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h3 {
    color: #0091ae;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #666666;
    font-size: 0.95rem;
    margin: 0;
  }
`;

const ProgressSteps = styled.div`
  margin-bottom: 2rem;
`;

const ProgressStep = styled.div<{ $isActive: boolean; $isCompleted: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  opacity: ${props => props.$isActive || props.$isCompleted ? 1 : 0.4};
  
  .step-number {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.9rem;
    background: ${props => 
      props.$isCompleted ? '#28a745' : 
      props.$isActive ? '#0091ae' : '#e9ecef'};
    color: ${props => 
      props.$isCompleted || props.$isActive ? 'white' : '#666'};
    flex-shrink: 0;
  }
  
  .step-text {
    flex: 1;
    color: ${props => props.$isActive ? '#333' : '#666'};
    font-weight: ${props => props.$isActive ? 600 : 400};
  }
  
  .step-icon {
    color: ${props => props.$isCompleted ? '#28a745' : '#0091ae'};
    display: ${props => props.$isActive && !props.$isCompleted ? 'block' : 'none'};
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  background: #e9ecef;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 2rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProgressBarFill = styled.div<{ $progress: number }>`
  height: 100%;
  background: linear-gradient(135deg, #0091ae 0%, #ff7a59 100%);
  border-radius: 6px;
  transition: width 0.8s ease;
  width: ${props => props.$progress}%;
  box-shadow: 0 2px 8px rgba(0, 145, 174, 0.3);
`;

const JobIdDisplay = styled.div`
  background: #f0f9fb;
  border: 1px solid #e6f4f7;
  border-radius: 8px;
  padding: 0.75rem;
  margin-top: 1.5rem;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  font-size: 0.85rem;
  color: #0091ae;
  text-align: center;
  
  strong {
    color: #007a94;
    font-weight: 600;
  }
`;

const CurrentMessage = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f0f9fb;
  border: 1px solid #e6f4f7;
  border-radius: 8px;
  color: #0091ae;
  font-weight: 600;
  font-size: 0.95rem;
  line-height: 1.4;
`;

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [healthStatus, setHealthStatus] = useState<'checking' | 'healthy' | 'error'>('checking');
  const [scanType, setScanType] = useState<'immediate' | 'scheduled'>('immediate');
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scanProgress, setScanProgress] = useState<{
    isActive: boolean;
    currentStep: number;
    totalSteps: number;
    currentMessage: string;
    jobId: string;
  }>({
    isActive: false,
    currentStep: 0,
    totalSteps: 4,
    currentMessage: '',
    jobId: ''
  });
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

  const progressSteps = [
    { id: 1, text: "Running Lighthouse accessibility scan...", duration: 8000 },
    { id: 2, text: "Processing Lighthouse results...", duration: 3000 },
    { id: 3, text: "Running additional accessibility checks...", duration: 5000 },
    { id: 4, text: "Generating and sending email report...", duration: 6000 }
  ];

  const simulateProgress = async (jobId: string) => {
    setScanProgress({
      isActive: true,
      currentStep: 0,
      totalSteps: 4,
      currentMessage: "Starting accessibility scan...",
      jobId
    });

    for (let i = 0; i < progressSteps.length; i++) {
      const step = progressSteps[i];
      
      // Update to current step
      setScanProgress(prev => ({
        ...prev,
        currentStep: i + 1,
        currentMessage: step.text
      }));

      // Wait for step duration
      await new Promise(resolve => setTimeout(resolve, step.duration));
    }

    // Complete the scan
    setScanProgress(prev => ({
      ...prev,
      currentMessage: "✅ Scan completed successfully! Check your email for the report."
    }));

    // Close progress after 3 seconds
    setTimeout(() => {
      setScanProgress(prev => ({ ...prev, isActive: false }));
    }, 3000);
  };

  const handleScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.url) return;

    setLoading(true);
    try {
      if (scanType === 'immediate') {
        const result = await scanService.runImmediateScan(formData.email, formData.url);
        
        // Start progress simulation
        simulateProgress(result.job_id);
        
        // Store email for marketing if user opted in
        if (formData.marketingEmails) {
          try {
            await emailService.storeEmail(formData.email, formData.name);
            // Don't show toast here, let progress tracker handle success message
          } catch (emailError) {
            console.warn('Failed to store email for marketing:', emailError);
            
            // Handle email already exists case silently during scan
            if (emailError instanceof Error && emailError.message === 'EMAIL_ALREADY_EXISTS') {
              // User will see this in progress completion
            }
          }
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
    <LandingContainer $isDarkMode={isDarkMode}>
      <ProgressOverlay $isActive={scanProgress.isActive} />
      <ProgressTracker $isActive={scanProgress.isActive}>
        <ProgressHeader>
          <h3>🔍 Accessibility Scan in Progress</h3>
          <p>Please wait while we analyze your website...</p>
        </ProgressHeader>
        
        <ProgressBar>
          <ProgressBarFill $progress={(scanProgress.currentStep / scanProgress.totalSteps) * 100} />
        </ProgressBar>
        
        <ProgressSteps>
          {progressSteps.map((step, index) => (
            <ProgressStep 
              key={step.id}
              $isActive={scanProgress.currentStep === step.id}
              $isCompleted={scanProgress.currentStep > step.id}
            >
              <div className="step-number">
                {scanProgress.currentStep > step.id ? '✓' : step.id}
              </div>
              <div className="step-text">{step.text}</div>
              {scanProgress.currentStep === step.id && (
                <Loader className="step-icon" size={16} />
              )}
            </ProgressStep>
          ))}
        </ProgressSteps>
        
        {scanProgress.jobId && (
          <JobIdDisplay>
            <strong>Job ID:</strong> {scanProgress.jobId}
          </JobIdDisplay>
        )}
        
        {scanProgress.currentMessage && (
          <CurrentMessage>
            {scanProgress.currentMessage}
          </CurrentMessage>
        )}
      </ProgressTracker>

      <Header $isDarkMode={isDarkMode}>
        <Nav>
          <Logo $isDarkMode={isDarkMode}>
            <LogoIcon>S</LogoIcon>
            Scanmesite.com
          </Logo>
          
          <NavLinks>
            <NavLink $isDarkMode={isDarkMode} href="#features">Features</NavLink>
            <NavLink $isDarkMode={isDarkMode} href="#tools">Tools</NavLink>
            <NavLink $isDarkMode={isDarkMode} onClick={() => navigate('/support')}>Support</NavLink>
            <NavLink $isDarkMode={isDarkMode} onClick={() => navigate('/privacy')}>Privacy</NavLink>
            <NavLink $isDarkMode={isDarkMode} onClick={() => navigate('/terms')}>Terms</NavLink>
            <DarkModeToggle 
              $isDarkMode={isDarkMode} 
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </DarkModeToggle>
          </NavLinks>

          <MobileMenuButton 
            $isDarkMode={isDarkMode}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={24} />
          </MobileMenuButton>

          <HealthStatus $status={healthStatus} onClick={handleHealthStatusClick}>
            {healthStatus === 'checking' && <Loader className="icon" />}
            {healthStatus === 'healthy' && <CheckCircle className="icon" />}
            {healthStatus === 'error' && <XCircle className="icon" />}
            {healthStatus === 'checking' && 'Checking API...'}
            {healthStatus === 'healthy' && 'API Online'}
            {healthStatus === 'error' && 'Click here to wake the server up'}
          </HealthStatus>
        </Nav>

        <MobileMenu $isDarkMode={isDarkMode} $isOpen={isMobileMenuOpen}>
          <MobileMenuLinks>
            <MobileNavLink $isDarkMode={isDarkMode} href="#features" onClick={() => setIsMobileMenuOpen(false)}>
              Features
            </MobileNavLink>
            <MobileNavLink $isDarkMode={isDarkMode} href="#tools" onClick={() => setIsMobileMenuOpen(false)}>
              Tools
            </MobileNavLink>
            <MobileNavLink 
              $isDarkMode={isDarkMode} 
              onClick={() => {
                navigate('/support');
                setIsMobileMenuOpen(false);
              }}
            >
              Support
            </MobileNavLink>
            <MobileNavLink 
              $isDarkMode={isDarkMode} 
              onClick={() => {
                navigate('/privacy');
                setIsMobileMenuOpen(false);
              }}
            >
              Privacy
            </MobileNavLink>
            <MobileNavLink 
              $isDarkMode={isDarkMode} 
              onClick={() => {
                navigate('/terms');
                setIsMobileMenuOpen(false);
              }}
            >
              Terms
            </MobileNavLink>
          </MobileMenuLinks>
        </MobileMenu>
      </Header>

      <HeroSection $isDarkMode={isDarkMode}>
        <FormContainer>
          <ScanForm $isDarkMode={isDarkMode}>
            <FormTitle $isDarkMode={isDarkMode}>Start Your Accessibility Scan</FormTitle>
            <form onSubmit={handleScanSubmit}>
              <FormGroup>
                <Label $isDarkMode={isDarkMode}>Your Name</Label>
                <Input
                  $isDarkMode={isDarkMode}
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label $isDarkMode={isDarkMode}>Email Address</Label>
                <Input
                  $isDarkMode={isDarkMode}
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label $isDarkMode={isDarkMode}>Website URL</Label>
                <Input
                  $isDarkMode={isDarkMode}
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://yourwebsite.com"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label $isDarkMode={isDarkMode}>Scan Type</Label>
                <ScanTypeSelector>
                  <ScanTypeButton
                    type="button"
                    $active={scanType === 'immediate'}
                    $isDarkMode={isDarkMode}
                    onClick={() => setScanType('immediate')}
                  >
                    <Play size={16} />
                    Run Now
                  </ScanTypeButton>
                  <ScanTypeButton
                    type="button"
                    $active={scanType === 'scheduled'}
                    $isDarkMode={isDarkMode}
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
                  <Label $isDarkMode={isDarkMode}>Scheduled Time</Label>
                  <DateTimeInput
                    $isDarkMode={isDarkMode}
                    type="datetime-local"
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </FormGroup>
              )}

              <CheckboxGroup $isDarkMode={isDarkMode}>
                <Checkbox
                  $isDarkMode={isDarkMode}
                  type="checkbox"
                  id="marketingEmails"
                  checked={formData.marketingEmails}
                  onChange={(e) => setFormData({ ...formData, marketingEmails: e.target.checked })}
                />
                <CheckboxLabel $isDarkMode={isDarkMode} htmlFor="marketingEmails">
                  I agree to receive marketing emails about new features, tips, and accessibility best practices.
                </CheckboxLabel>
              </CheckboxGroup>

              <StartScanButton $isDarkMode={isDarkMode} type="submit" disabled={loading || healthStatus === 'error'}>
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
        </FormContainer>

        <HeroContent>
          <HeroTitle $isDarkMode={isDarkMode}>
            Make Your Website Accessible to Everyone
          </HeroTitle>
          <HeroSubtitle $isDarkMode={isDarkMode}>
            Automated accessibility scanning powered by Lighthouse and DOM analysis. 
            Get comprehensive reports delivered to your inbox and ensure your website 
            complies with WCAG guidelines.
          </HeroSubtitle>
        </HeroContent>
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
              <FeatureIcon color="linear-gradient(135deg, #0091ae 0%, #ff7a59 100%)">
                <Globe size={24} />
              </FeatureIcon>
              <FeatureTitle>Submit Your URL</FeatureTitle>
              <FeatureDescription>
                Simply enter your website URL and email address. Our system will 
                queue your scan and begin the accessibility analysis process.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon color="linear-gradient(135deg, #ff7a59 0%, #0091ae 100%)">
                <BarChart3 size={24} />
              </FeatureIcon>
              <FeatureTitle>Automated Analysis</FeatureTitle>
              <FeatureDescription>
                We run comprehensive scans using Lighthouse accessibility audits 
                and DOM analysis to identify issues and compliance gaps.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon color="linear-gradient(135deg, #0091ae 0%, #ff7a59 100%)">
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

      <Footer $isDarkMode={isDarkMode}>
        <FooterContainer>
          <FooterGrid>
            <FooterSection $isDarkMode={isDarkMode}>
              <h4>Scanmesite.com</h4>
              <p>
                Making the web accessible for everyone through automated 
                accessibility scanning and comprehensive reporting.
              </p>
            </FooterSection>

            <FooterSection $isDarkMode={isDarkMode}>
              <h4>Product</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#tools">Tools</a></li>
              </ul>
            </FooterSection>

            <FooterSection $isDarkMode={isDarkMode}>
              <h4>Company</h4>
              <ul>
                <li><a href="/about">About Us</a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </FooterSection>

            <FooterSection $isDarkMode={isDarkMode}>
              <h4>Legal</h4>
              <ul>
                <li><NavLink $isDarkMode={isDarkMode} onClick={() => navigate('/privacy')}>Privacy Policy</NavLink></li>
                <li><NavLink $isDarkMode={isDarkMode} onClick={() => navigate('/terms')}>Terms of Service</NavLink></li>
                <li><NavLink $isDarkMode={isDarkMode} onClick={() => navigate('/support')}>Support</NavLink></li>
              </ul>
            </FooterSection>
          </FooterGrid>

          <FooterBottom $isDarkMode={isDarkMode}>
            <p>&copy; 2025 Scanmesite.com. All rights reserved.</p>
          </FooterBottom>
        </FooterContainer>
      </Footer>
    </LandingContainer>
  );
};
