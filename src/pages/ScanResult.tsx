import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  ArrowLeft, 
  Download, 
  Mail, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Globe,
  BarChart3,
  Shield,
  Zap,
  Search,
  Star
} from 'lucide-react';
import { 
  Container, 
  Card, 
  Button, 
  Badge, 
  colors 
} from '../styles/components';
import { ScanResult, ScanRequest } from '../types';
import { scanService } from '../services/api';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';

const ResultContainer = styled(Container)`
  padding-top: 2rem;
  padding-bottom: 2rem;
`;

const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: between;
  margin-bottom: 2rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const BackButton = styled(Button)`
  align-self: flex-start;
`;

const HeaderInfo = styled.div`
  flex: 1;
`;

const ResultTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${colors.gray[900]};
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ResultUrl = styled.div`
  color: ${colors.gray[600]};
  font-size: 1.125rem;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    justify-content: stretch;
  }
`;

const ScoreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ScoreCard = styled(Card)<{ $score: number }>`
  text-align: center;
  padding: 1.5rem;
  border-left: 4px solid ${({ $score }) => 
    $score >= 90 ? colors.success[500] :
    $score >= 70 ? colors.warning[500] :
    colors.error[500]
  };
`;

const ScoreValue = styled.div<{ $score: number }>`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ $score }) => 
    $score >= 90 ? colors.success[600] :
    $score >= 70 ? colors.warning[600] :
    colors.error[600]
  };
  line-height: 1;
  margin-bottom: 0.5rem;
`;

const ScoreLabel = styled.div`
  font-size: 0.875rem;
  color: ${colors.gray[600]};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const SectionGrid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const SectionCard = styled(Card)`
  padding: 1.5rem;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: between;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${colors.gray[900]};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const IssuesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const IssueItem = styled.div`
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${colors.gray[200]};
  background: ${colors.gray[50]};
`;

const IssueHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: between;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

const IssueTitle = styled.h4`
  font-weight: 600;
  color: ${colors.gray[900]};
  margin: 0;
  flex: 1;
`;

const IssueSeverity = styled(Badge)<{ $severity: string }>`
  ${({ $severity }) => {
    switch ($severity) {
      case 'critical':
        return `background-color: ${colors.error[100]}; color: ${colors.error[700]};`;
      case 'high':
        return `background-color: ${colors.error[100]}; color: ${colors.error[600]};`;
      case 'medium':
        return `background-color: ${colors.warning[100]}; color: ${colors.warning[700]};`;
      default:
        return `background-color: ${colors.gray[100]}; color: ${colors.gray[700]};`;
    }
  }}
`;

const IssueDescription = styled.p`
  color: ${colors.gray[600]};
  font-size: 0.875rem;
  margin: 0 0 0.5rem 0;
`;

const IssueRecommendation = styled.div`
  background: white;
  padding: 0.75rem;
  border-radius: 0.375rem;
  border-left: 3px solid ${colors.primary[500]};
  font-size: 0.875rem;
  color: ${colors.gray[700]};
`;

const MetaInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${colors.gray[600]};

  svg {
    width: 1rem;
    height: 1rem;
    color: ${colors.gray[400]};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${colors.gray[500]};
`;

const ScanResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [scanRequest, setScanRequest] = useState<ScanRequest | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate('/scans');
      return;
    }

    const fetchData = async () => {
      await fetchScanData();
    };

    fetchData();
  }, [id, navigate]);

  const fetchScanData = async () => {
    try {
      setLoading(true);
      
      const [requestResponse, resultResponse] = await Promise.all([
        scanService.getScanRequest(id!),
        scanService.getScanResult(id!)
      ]);

      if (requestResponse.success && requestResponse.data) {
        setScanRequest(requestResponse.data);
      }

      if (resultResponse.success && resultResponse.data) {
        setScanResult(resultResponse.data);
      } else {
        toast.error('Scan result not found');
      }
    } catch (error) {
      console.error('Error fetching scan data:', error);
      toast.error('Failed to fetch scan data');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return <Loading message="Loading scan result..." />;
  }

  if (!scanRequest || !scanResult) {
    return (
      <ResultContainer>
        <Card>
          <EmptyState>
            <XCircle size={64} style={{ margin: '0 auto 1rem', color: colors.error[500] }} />
            <h3>Scan result not found</h3>
            <p>The requested scan result could not be found.</p>
            <Button as={Link} to="/scans" style={{ marginTop: '1rem' }}>
              Back to Scans
            </Button>
          </EmptyState>
        </Card>
      </ResultContainer>
    );
  }

  return (
    <ResultContainer>
      <ResultHeader>
        <BackButton 
          as={Link} 
          to="/scans" 
          variant="secondary" 
          size="sm"
        >
          <ArrowLeft size={16} />
          Back to Scans
        </BackButton>

        <HeaderInfo>
          <ResultTitle>
            <Globe />
            Accessibility Report
          </ResultTitle>
          <ResultUrl>{scanRequest.websiteUrl}</ResultUrl>
        </HeaderInfo>

        <HeaderActions>
          <Button variant="secondary" size="sm">
            <Download size={16} />
            Export
          </Button>
          <Button variant="secondary" size="sm">
            <Mail size={16} />
            Email Report
          </Button>
        </HeaderActions>
      </ResultHeader>

      <MetaInfo>
        <MetaItem>
          <Mail />
          Sent to: {scanRequest.email}
        </MetaItem>
        <MetaItem>
          <Clock />
          Duration: {formatDuration(scanResult.duration)}
        </MetaItem>
        <MetaItem>
          <CheckCircle />
          Completed: {new Date(scanResult.completedAt).toLocaleString()}
        </MetaItem>
      </MetaInfo>

      <ScoreGrid>
        <ScoreCard $score={scanResult.lighthouseReport.performance}>
          <ScoreValue $score={scanResult.lighthouseReport.performance}>
            {scanResult.lighthouseReport.performance}
          </ScoreValue>
          <ScoreLabel>
            <Zap />
            Performance
          </ScoreLabel>
        </ScoreCard>

        <ScoreCard $score={scanResult.lighthouseReport.accessibility}>
          <ScoreValue $score={scanResult.lighthouseReport.accessibility}>
            {scanResult.lighthouseReport.accessibility}
          </ScoreValue>
          <ScoreLabel>
            <Shield />
            Accessibility
          </ScoreLabel>
        </ScoreCard>

        <ScoreCard $score={scanResult.lighthouseReport.bestPractices}>
          <ScoreValue $score={scanResult.lighthouseReport.bestPractices}>
            {scanResult.lighthouseReport.bestPractices}
          </ScoreValue>
          <ScoreLabel>
            <CheckCircle />
            Best Practices
          </ScoreLabel>
        </ScoreCard>

        <ScoreCard $score={scanResult.lighthouseReport.seo}>
          <ScoreValue $score={scanResult.lighthouseReport.seo}>
            {scanResult.lighthouseReport.seo}
          </ScoreValue>
          <ScoreLabel>
            <Search />
            SEO
          </ScoreLabel>
        </ScoreCard>

        <ScoreCard $score={scanResult.lighthouseReport.pwa}>
          <ScoreValue $score={scanResult.lighthouseReport.pwa}>
            {scanResult.lighthouseReport.pwa}
          </ScoreValue>
          <ScoreLabel>
            <Star />
            PWA
          </ScoreLabel>
        </ScoreCard>
      </ScoreGrid>

      <SectionGrid>
        <SectionCard>
          <SectionHeader>
            <SectionTitle>
              <AlertTriangle />
              Lighthouse Issues ({scanResult.lighthouseReport.issues.length})
            </SectionTitle>
          </SectionHeader>

          {scanResult.lighthouseReport.issues.length > 0 ? (
            <IssuesList>
              {scanResult.lighthouseReport.issues.map((issue) => (
                <IssueItem key={issue.id}>
                  <IssueHeader>
                    <IssueTitle>{issue.title}</IssueTitle>
                    <IssueSeverity $severity={issue.severity}>
                      {issue.severity}
                    </IssueSeverity>
                  </IssueHeader>
                  <IssueDescription>{issue.description}</IssueDescription>
                  <IssueRecommendation>
                    <strong>Recommendation:</strong> {issue.recommendation}
                  </IssueRecommendation>
                </IssueItem>
              ))}
            </IssuesList>
          ) : (
            <EmptyState>
              <CheckCircle size={48} style={{ margin: '0 auto 1rem', color: colors.success[500] }} />
              <h4>No Lighthouse issues found!</h4>
              <p>Your website passed all Lighthouse accessibility tests.</p>
            </EmptyState>
          )}
        </SectionCard>

        <SectionCard>
          <SectionHeader>
            <SectionTitle>
              <Globe />
              DOM Issues ({scanResult.domIssues.length})
            </SectionTitle>
          </SectionHeader>

          {scanResult.domIssues.length > 0 ? (
            <IssuesList>
              {scanResult.domIssues.map((issue) => (
                <IssueItem key={issue.id}>
                  <IssueHeader>
                    <IssueTitle>{issue.element}</IssueTitle>
                    <IssueSeverity $severity={issue.severity}>
                      {issue.severity}
                    </IssueSeverity>
                  </IssueHeader>
                  <IssueDescription>{issue.description}</IssueDescription>
                  <IssueRecommendation>
                    <strong>Recommendation:</strong> {issue.recommendation}
                  </IssueRecommendation>
                </IssueItem>
              ))}
            </IssuesList>
          ) : (
            <EmptyState>
              <CheckCircle size={48} style={{ margin: '0 auto 1rem', color: colors.success[500] }} />
              <h4>No DOM issues found!</h4>
              <p>Your website's DOM structure looks good.</p>
            </EmptyState>
          )}
        </SectionCard>
      </SectionGrid>
    </ResultContainer>
  );
};

export default ScanResultPage;
