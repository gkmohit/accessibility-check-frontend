export interface ScanRequest {
  id?: string;
  websiteUrl: string;
  email: string;
  scheduledTime: Date;
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ScanResult {
  id: string;
  scanRequestId: string;
  lighthouseReport: LighthouseReport;
  domIssues: DomIssue[];
  duration: number;
  completedAt: Date;
}

export interface LighthouseReport {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  pwa: number;
  issues: LighthouseIssue[];
}

export interface LighthouseIssue {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'performance' | 'accessibility' | 'best-practices' | 'seo' | 'pwa';
  element?: string;
  recommendation: string;
}

export interface DomIssue {
  id: string;
  type: 'structure' | 'visual' | 'semantic';
  severity: 'low' | 'medium' | 'high' | 'critical';
  element: string;
  description: string;
  recommendation: string;
  xpath?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface DashboardStats {
  totalScans: number;
  pendingScans: number;
  completedScans: number;
  averageAccessibilityScore: number;
  averagePerformanceScore: number;
  criticalIssues: number;
}
