import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Eye, 
  Trash2,
  RefreshCw,
  Calendar,
  Globe,
  Mail
} from 'lucide-react';
import { 
  Container, 
  Card, 
  Button, 
  Input, 
  Badge, 
  colors 
} from '../styles/components';
import { ScanRequest } from '../types';
import { apiService } from '../services/api';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';

const ScansContainer = styled(Container)`
  padding-top: 2rem;
  padding-bottom: 2rem;
`;

const PageHeader = styled.div`
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

const PageTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${colors.gray[900]};
  flex: 1;
`;

const PageActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    justify-content: stretch;
  }
`;

const FiltersRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;

  @media (max-width: 768px) {
    max-width: none;
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: ${colors.gray[400]};
`;

const SearchInput = styled(Input)`
  padding-left: 2.5rem;
`;

const FilterSelect = styled.select`
  padding: 0.625rem 0.875rem;
  border: 1px solid ${colors.gray[300]};
  border-radius: 0.5rem;
  background: white;
  font-size: 0.875rem;
  color: ${colors.gray[700]};

  &:focus {
    outline: 2px solid ${colors.primary[100]};
    border-color: ${colors.primary[500]};
  }
`;

const ScansGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ScanCard = styled(Card)`
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 16px -4px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

const ScanHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: between;
  margin-bottom: 1rem;
`;

const ScanUrl = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${colors.gray[900]};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    width: 1rem;
    height: 1rem;
    color: ${colors.gray[500]};
  }
`;

const ScanActions = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  background: ${colors.gray[100]};
  color: ${colors.gray[600]};
  transition: all 0.2s ease-in-out;

  &:hover {
    background: ${colors.gray[200]};
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const ScanDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const DetailItem = styled.div`
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

const ScanFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: between;
  padding-top: 1rem;
  border-top: 1px solid ${colors.gray[200]};
`;

const ScanMeta = styled.div`
  font-size: 0.75rem;
  color: ${colors.gray[500]};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 1rem;
  color: ${colors.gray[500]};
`;

const Scans: React.FC = () => {
  const [scans, setScans] = useState<ScanRequest[]>([]);
  const [filteredScans, setFilteredScans] = useState<ScanRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchScans();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      filterScans();
    };
    applyFilters();
  }, [scans, searchTerm, statusFilter]);

  const fetchScans = async () => {
    try {
      setLoading(true);
      const response = await apiService.getScanRequests();
      
      if (response.success && response.data) {
        const sortedScans = response.data.sort(
          (a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
        );
        setScans(sortedScans);
      }
    } catch (error) {
      console.error('Error fetching scans:', error);
      toast.error('Failed to fetch scans');
    } finally {
      setLoading(false);
    }
  };

  const filterScans = () => {
    let filtered = scans;

    if (searchTerm) {
      filtered = filtered.filter(scan =>
        scan.websiteUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scan.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(scan => scan.status === statusFilter);
    }

    setFilteredScans(filtered);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchScans();
    setRefreshing(false);
    toast.success('Scans refreshed');
  };

  const handleDeleteScan = async (scanId: string) => {
    if (!window.confirm('Are you sure you want to delete this scan?')) {
      return;
    }

    try {
      const response = await apiService.deleteScanRequest(scanId);
      if (response.success) {
        setScans(scans.filter(scan => scan.id !== scanId));
        toast.success('Scan deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting scan:', error);
      toast.error('Failed to delete scan');
    }
  };

  const handleTriggerScan = async (scanId: string) => {
    try {
      const response = await apiService.triggerImmediateScan(scanId);
      if (response.success) {
        toast.success('Scan triggered successfully');
        await fetchScans(); // Refresh the list
      }
    } catch (error) {
      console.error('Error triggering scan:', error);
      toast.error('Failed to trigger scan');
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
    return <Loading message="Loading scans..." />;
  }

  return (
    <ScansContainer>
      <PageHeader>
        <PageTitle>Accessibility Scans</PageTitle>
        <PageActions>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </Button>
          <Button as={Link} to="/scans/new" size="sm">
            <Plus size={16} />
            New Scan
          </Button>
        </PageActions>
      </PageHeader>

      <FiltersRow>
        <SearchWrapper>
          <SearchIcon />
          <SearchInput
            placeholder="Search by URL or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchWrapper>

        <FilterSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="running">Running</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </FilterSelect>
      </FiltersRow>

      {filteredScans.length > 0 ? (
        <ScansGrid>
          {filteredScans.map((scan) => (
            <ScanCard key={scan.id}>
              <ScanHeader>
                <ScanUrl>
                  <Globe />
                  {scan.websiteUrl}
                </ScanUrl>
                <ScanActions>
                  {scan.status === 'completed' && (
                    <ActionButton
                      as={Link}
                      to={`/scans/${scan.id}/result`}
                      title="View Report"
                    >
                      <Eye />
                    </ActionButton>
                  )}
                  {scan.status === 'pending' && (
                    <ActionButton
                      onClick={() => handleTriggerScan(scan.id!)}
                      title="Trigger Now"
                    >
                      <RefreshCw />
                    </ActionButton>
                  )}
                  <ActionButton
                    onClick={() => handleDeleteScan(scan.id!)}
                    title="Delete Scan"
                  >
                    <Trash2 />
                  </ActionButton>
                </ScanActions>
              </ScanHeader>

              <ScanDetails>
                <DetailItem>
                  <Mail />
                  {scan.email}
                </DetailItem>
                <DetailItem>
                  <Calendar />
                  {new Date(scan.scheduledTime).toLocaleString()}
                </DetailItem>
              </ScanDetails>

              <ScanFooter>
                <ScanMeta>
                  Created {scan.createdAt ? new Date(scan.createdAt).toLocaleDateString() : 'Unknown'}
                </ScanMeta>
                {getStatusBadge(scan.status)}
              </ScanFooter>
            </ScanCard>
          ))}
        </ScansGrid>
      ) : (
        <Card>
          <EmptyState>
            <Globe size={64} style={{ margin: '0 auto 1rem', color: colors.gray[400] }} />
            <h3>No scans found</h3>
            <p>
              {searchTerm || statusFilter !== 'all'
                ? 'No scans match your current filters.'
                : 'Schedule your first accessibility scan to get started.'}
            </p>
            {(!searchTerm && statusFilter === 'all') && (
              <Button as={Link} to="/scans/new" style={{ marginTop: '1rem' }}>
                <Plus size={16} />
                Schedule First Scan
              </Button>
            )}
          </EmptyState>
        </Card>
      )}
    </ScansContainer>
  );
};

export default Scans;
