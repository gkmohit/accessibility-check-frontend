import axios from 'axios';
import { ScanRequest, ScanResult, ApiResponse, DashboardStats } from '../types';

const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://127.0.0.1:8000' // Use 127.0.0.1 to match backend CORS settings
  : process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Disable credentials for CORS
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.name === 'TypeError') {
      const networkError = new Error('Network error - check if the API server is running');
      return Promise.reject(networkError);
    }
    
    // Check for API error responses
    if (error.response?.data?.error) {
      const apiError = new Error(error.response.data.error);
      return Promise.reject(apiError);
    }
    
    // Handle HTTP status errors
    if (error.response?.status === 404) {
      const notFoundError = new Error(`API endpoint not found: ${error.config?.url}`);
      return Promise.reject(notFoundError);
    }
    
    return Promise.reject(error);
  }
);

export const scanService = {
  // Health check
  checkHealth: async (): Promise<{ status: string }> => {
    const response = await api.get('/health');
    return response.data;
  },

  // Run immediate scan
  runImmediateScan: async (email: string, url: string): Promise<{ job_id: string; message: string }> => {
    const response = await api.post('/run-once', { email, url });
    return response.data;
  },

  // Schedule scan with flexible scheduling options
  scheduleScan: async (scanData: {
    email: string;
    url: string;
    schedule: {
      type: 'cron' | 'interval' | 'date';
      timezone?: string;
      cron?: {
        minute?: string;
        hour?: string;
        day_of_week?: string;
      };
      interval?: {
        minutes?: number;
        hours?: number;
        days?: number;
      };
      run_at?: string;
    };
  }): Promise<{ job_id: string; message: string }> => {
    const response = await api.post('/schedule', scanData);
    return response.data;
  },

  // List all scheduled jobs
  listScheduledJobs: async (): Promise<{ jobs: Array<{
    id: string;
    email: string;
    url: string;
    schedule: any;
    next_run_time: string | null;
    created_at: string;
  }> }> => {
    const response = await api.get('/jobs');
    return response.data;
  },

  // Remove scheduled job
  removeScheduledJob: async (jobId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/jobs/${jobId}`);
    return response.data;
  }
};

// Email management service
export const emailService = {
  // Store email address for marketing
  storeEmail: async (email: string, name?: string): Promise<{ id: string; message: string }> => {
    const response = await api.post('/emails', { 
      email, 
      name: name || '',
      active: true 
    });
    return response.data;
  },

  // List all emails
  listEmails: async (activeOnly: boolean = true): Promise<{ emails: Array<{
    id: string;
    email: string;
    name: string;
    active: boolean;
    created_at: string;
    updated_at: string;
  }> }> => {
    const response = await api.get('/emails', {
      params: activeOnly ? { active: true } : {}
    });
    return response.data;
  },

  // Update email address or display name
  updateEmail: async (id: string, data: { email?: string; name?: string }): Promise<{ message: string }> => {
    const response = await api.put(`/emails/${id}`, data);
    return response.data;
  },

  // Soft delete (deactivate) email
  deleteEmail: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/emails/${id}`);
    return response.data;
  }
};

// Legacy API service for compatibility with existing components
export const apiService = {
  createScanRequest: async (scanData: Omit<ScanRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ScanRequest>> => {
    // Convert to immediate scan for now
    try {
      const result = await scanService.runImmediateScan(scanData.email, scanData.websiteUrl);
      return {
        success: true,
        data: {
          id: result.job_id,
          websiteUrl: scanData.websiteUrl,
          email: scanData.email,
          scheduledTime: scanData.scheduledTime,
          status: 'pending',
          createdAt: new Date(),
        },
        message: result.message,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        errors: [error.message],
      };
    }
  },

  getScanRequests: async (): Promise<ApiResponse<ScanRequest[]>> => {
    try {
      const result = await scanService.listScheduledJobs();
      const scanRequests: ScanRequest[] = result.jobs.map(job => ({
        id: job.id,
        websiteUrl: job.url,
        email: job.email,
        scheduledTime: job.next_run_time ? new Date(job.next_run_time) : new Date(),
        status: 'pending' as const,
        createdAt: new Date(job.created_at),
      }));

      return {
        success: true,
        data: scanRequests,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        errors: [error.message],
      };
    }
  },

  getScanRequest: async (id: string): Promise<ApiResponse<ScanRequest>> => {
    try {
      const result = await scanService.listScheduledJobs();
      const job = result.jobs.find(j => j.id === id);
      
      if (!job) {
        return {
          success: false,
          message: 'Scan request not found',
          errors: ['Scan request not found'],
        };
      }

      const scanRequest: ScanRequest = {
        id: job.id,
        websiteUrl: job.url,
        email: job.email,
        scheduledTime: job.next_run_time ? new Date(job.next_run_time) : new Date(),
        status: 'pending',
        createdAt: new Date(job.created_at),
      };

      return {
        success: true,
        data: scanRequest,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        errors: [error.message],
      };
    }
  },

  deleteScanRequest: async (id: string): Promise<ApiResponse<void>> => {
    try {
      await scanService.removeScheduledJob(id);
      return {
        success: true,
        message: 'Scan request deleted successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        errors: [error.message],
      };
    }
  },

  triggerImmediateScan: async (scanId: string): Promise<ApiResponse<void>> => {
    try {
      // For the backend API, we need to get the job details first, then trigger immediate scan
      const scanRequest = await scanService.getScanRequest(scanId);
      if (!scanRequest.success || !scanRequest.data) {
        throw new Error('Scan request not found');
      }

      await scanService.runImmediateScan(scanRequest.data.email, scanRequest.data.websiteUrl);
      return {
        success: true,
        message: 'Scan triggered successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        errors: [error.message],
      };
    }
  },

  // Mock methods for dashboard (not implemented in backend yet)
  getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
    try {
      const jobs = await scanService.listScheduledJobs();
      const stats: DashboardStats = {
        totalScans: jobs.jobs.length,
        pendingScans: jobs.jobs.length,
        completedScans: 0,
        averageAccessibilityScore: 85,
        averagePerformanceScore: 78,
        criticalIssues: 3,
      };

      return {
        success: true,
        data: stats,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        errors: [error.message],
      };
    }
  },

  getScanResult: async (scanId: string): Promise<ApiResponse<ScanResult>> => {
    // This would need to be implemented in the backend
    return {
      success: false,
      message: 'Scan results not yet implemented in backend',
      errors: ['Scan results not yet implemented in backend'],
    };
  },

  updateScanRequest: async (id: string, updates: Partial<ScanRequest>): Promise<ApiResponse<ScanRequest>> => {
    return {
      success: false,
      message: 'Update scan request not yet implemented in backend',
      errors: ['Update scan request not yet implemented in backend'],
    };
  },
};

export default api;
