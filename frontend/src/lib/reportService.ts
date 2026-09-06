import { apiClient } from './apiClient';
import { Report, ReportSummary, ReportVersion } from '@/types';

export interface ReportContentPayload {
  projectId: number;
  weekStart: string;
  tasks: {
    name: string;
    priority: string;
    plannedPct?: number;
    actualPct?: number;
    status: string;
    timePlannedHours?: number;
    timeSpentHours?: number;
    deliverable?: string;
  }[];
  tasksPlannedNextWeek: string;
  blockers: { description: string; keyIssue: boolean }[];
  achievements: { description: string; keyAchievement: boolean }[];
  hoursByTaskType: { taskType: string; hours: number }[];
  notes: string;
}

export async function createReport(payload: ReportContentPayload): Promise<Report> {
  const { data } = await apiClient.post<Report>('/reports', payload);
  return data;
}

export async function updateReport(id: number, payload: ReportContentPayload): Promise<Report> {
  const { data } = await apiClient.put<Report>(`/reports/${id}`, payload);
  return data;
}

export async function submitReport(id: number): Promise<Report> {
  const { data } = await apiClient.post<Report>(`/reports/${id}/submit`);
  return data;
}

export async function getReport(id: number): Promise<Report> {
  const { data } = await apiClient.get<Report>(`/reports/${id}`);
  return data;
}

export async function getMyReports(): Promise<ReportSummary[]> {
  const { data } = await apiClient.get<ReportSummary[]>('/reports/mine');
  return data;
}

export async function getReportVersions(id: number): Promise<ReportVersion[]> {
  const { data } = await apiClient.get<ReportVersion[]>(`/reports/${id}/versions`);
  return data;
}
export interface PagedReports {
  content: ReportSummary[];
  totalPages: number;
  totalElements: number;
  number: number; // current page, 0-indexed
}

export interface ReportFilters {
  userId?: number;
  projectId?: number;
  status?: string;
  weekFrom?: string;
  weekTo?: string;
  page?: number;
  size?: number;
}

export async function getFilteredReports(filters: ReportFilters): Promise<PagedReports> {
  const { data } = await apiClient.get<PagedReports>('/reports', {
    params: {
      userId: filters.userId || undefined,
      projectId: filters.projectId || undefined,
      status: filters.status || undefined,
      weekFrom: filters.weekFrom || undefined,
      weekTo: filters.weekTo || undefined,
      page: filters.page ?? 0,
      size: filters.size ?? 20,
      sort: 'weekStart,desc',
    },
  });
  return data;
}