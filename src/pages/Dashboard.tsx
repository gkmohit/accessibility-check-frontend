import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Activity,
  Globe
} from 'lucide-react';
import { 
  Container, 
  Card, 
  Button, 
  Badge, 
  colors 
} from '../styles/components';
import { DashboardStats, ScanRequest } from '../types';
import { scanService } from '../services/api';
import Loading from '../components/Loading';
import HealthCheck from '../components/HealthCheck';
import Troubleshoot from '../components/Troubleshoot';
import { toast } from 'react-toastify';

const DashboardContainer = styled(Container)`
  padding-top: 2rem;
  padding-bottom: 2rem;
`;

const DashboardHeader = styled.div`
  margin-bottom: 2rem;
`;

const DashboardTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${colors.gray[900]};
  margin-bottom: 0.5rem;
`;

const DashboardSubtitle = styled.p`
  color: ${colors.gray[600]};
  font-size: 1.125rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(Card)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
`;

const StatIcon = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  background-color: ${({ $color }) => $color};

  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: white;
  }
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${colors.gray[900]};
  line-height: 1;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${colors.gray[600]};
  margin-top: 0.25rem;
`;

const RecentScansSection = styled.div`
  margin-bottom: 2rem;
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
  flex: 1;
`;

const ScansList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ScanItem = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: between;
  gap: 1rem;
  padding: 1rem 1.5rem;
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 16px -4px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

const ScanInfo = styled.div`
  flex: 1;
`;

const ScanUrl = styled.div`
  font-weight: 500;
  color: ${colors.gray[900]};
  margin-bottom: 0.25rem;
`;

const ScanMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.75rem;
  color: ${colors.gray[500]};
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const TestSection = styled.div`
  background: ${colors.primary[50]};
  border: 1px solid ${colors.primary[100]};
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const TestTitle = styled.h3`
  color: ${colors.primary[700]};
  margin-bottom: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
`;

const TestDescription = styled.p`
  color: ${colors.primary[600]};
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const TestActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const ActionCard = styled(Card)`
  text-align: center;
  padding: 2rem;
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 16px -4px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

const ActionIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  border-radius: 1rem;
  background-color: ${colors.primary[100]};
  margin: 0 auto 1rem;

  svg {
    width: 2rem;
    height: 2rem;
    color: ${colors.primary[600]};
  }
`;

const ActionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${colors.gray[900]};
  margin-bottom: 0.5rem;
`;

const ActionDescription = styled.p`
  font-size: 0.875rem;
  color: ${colors.gray[600]};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${colors.gray[500]};
`;

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentScans, setRecentScans] = useState<ScanRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [testLoading, setTestLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, scansResponse] = await Promise.all([
          scanService.getDashboardStats(),
          scanService.getScanRequests()
        ]);

        if (statsResponse.success && statsResponse.data) {
          setStats(statsResponse.data);
        }

        if (scansResponse.success && scansResponse.data) {
          // Get the 5 most recent scans
          const sortedScans = scansResponse.data
            .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
            .slice(0, 5);
          setRecentScans(sortedScans);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleTestScan = async () => {
    setTestLoading(true);
    try {
      const response = await scanService.runImmediateScan(
        'test@gmail.com',
        'https://example.com'
      );
      toast.success(`Test scan queued! Job ID: ${response.job_id}`);
    } catch (error: any) {
      toast.error(`Test failed: ${error.message}`);
    } finally {
      setTestLoading(false);
    }
  };

  const getStatusBadge = (status: ScanRequest['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'running':
        return <Badge variant="info">Running</Badge>;
      case 'failed':
        return <Badge variant="error">Failed</Badge>;
      default:
        return <Badge variant="warning">Pending</Badge>;
    }
  };

  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }

  return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>Dashboard</DashboardTitle>
        <DashboardSubtitle>
          Monitor your website accessibility and performance scans
        </DashboardSubtitle>
      </DashboardHeader>

      <HealthCheck showDetails />

      <Troubleshoot />

      <TestSection>
        <TestTitle>Test Backend Connection</TestTitle>
        <TestDescription>
          Quick test to verify your backend is working correctly. This will run a scan on example.com and send results to test@gmail.com.
        </TestDescription>
        <TestActions>
          <Button 
            onClick={handleTestScan} 
            disabled={testLoading}
            size="sm"
            variant="secondary"
          >
            {testLoading ? 'Running Test...' : 'Test Scan'}
          </Button>
        </TestActions>
      </TestSection>

      {stats && (
        <StatsGrid>
          <StatCard>
            <StatIcon $color={colors.primary[500]}>
              <BarChart3 />
            </StatIcon>
            <StatContent>
              <StatValue>{stats.totalScans}</StatValue>
              <StatLabel>Total Scans</StatLabel>
            </StatContent>
          </StatCard>

          <StatCard>
            <StatIcon $color={colors.warning[500]}>
              <Clock />
            </StatIcon>
            <StatContent>
              <StatValue>{stats.pendingScans}</StatValue>
              <StatLabel>Pending Scans</StatLabel>
            </StatContent>
          </StatCard>

          <StatCard>
            <StatIcon $color={colors.success[500]}>
              <CheckCircle />
            </StatIcon>
            <StatContent>
              <StatValue>{stats.completedScans}</StatValue>
              <StatLabel>Completed Scans</StatLabel>
            </StatContent>
          </StatCard>

          <StatCard>
            <StatIcon $color={colors.error[500]}>
              <AlertTriangle />
            </StatIcon>
            <StatContent>
              <StatValue>{stats.criticalIssues}</StatValue>
              <StatLabel>Critical Issues</StatLabel>
            </StatContent>
          </StatCard>

          <StatCard>
            <StatIcon $color={colors.primary[600]}>
              <Shield />
            </StatIcon>
            <StatContent>
              <StatValue>{Math.round(stats.averageAccessibilityScore)}</StatValue>
              <StatLabel>Avg Accessibility Score</StatLabel>
            </StatContent>
          </StatCard>

          <StatCard>
            <StatIcon $color={colors.success[600]}>
              <TrendingUp />
            </StatIcon>
            <StatContent>
              <StatValue>{Math.round(stats.averagePerformanceScore)}</StatValue>
              <StatLabel>Avg Performance Score</StatLabel>
            </StatContent>
          </StatCard>
        </StatsGrid>
      )}

      <RecentScansSection>
        <SectionHeader>
          <SectionTitle>Recent Scans</SectionTitle>
          <Button as={Link} to="/scans" variant="secondary" size="sm">
            View All
          </Button>
        </SectionHeader>

        {recentScans.length > 0 ? (
          <ScansList>
            {recentScans.map((scan) => (
              <ScanItem key={scan.id}>
                <ScanInfo>
                  <ScanUrl>{scan.websiteUrl}</ScanUrl>
                  <ScanMeta>
                    <span>{scan.email}</span>
                    <span>•</span>
                    <span>{new Date(scan.scheduledTime).toLocaleDateString()}</span>
                  </ScanMeta>
                </ScanInfo>
                {getStatusBadge(scan.status)}
              </ScanItem>
            ))}
          </ScansList>
        ) : (
          <Card>
            <EmptyState>
              <Globe size={48} style={{ margin: '0 auto 1rem', color: colors.gray[400] }} />
              <h3>No scans yet</h3>
              <p>Schedule your first accessibility scan to get started.</p>
            </EmptyState>
          </Card>
        )}
      </RecentScansSection>

      <QuickActions>
        <ActionCard as={Link} to="/scans/new">
          <ActionIcon>
            <Shield />
          </ActionIcon>
          <ActionTitle>New Scan</ActionTitle>
          <ActionDescription>
            Schedule a new accessibility and performance scan for your website
          </ActionDescription>
        </ActionCard>

        <ActionCard as={Link} to="/scans">
          <ActionIcon>
            <Activity />
          </ActionIcon>
          <ActionTitle>View Reports</ActionTitle>
          <ActionDescription>
            Review detailed accessibility reports and track improvements
          </ActionDescription>
        </ActionCard>
      </QuickActions>
    </DashboardContainer>
  );
};

export default Dashboard;
