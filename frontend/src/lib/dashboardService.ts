import { apiClient } from './apiClient';
import { ChartSeries, DashboardMetrics } from '@/types';

export async function getMetrics(weekStart: string): Promise<DashboardMetrics> {
  const { data } = await apiClient.get<DashboardMetrics>('/dashboard/metrics', {
    params: { weekStart },
  });
  return data;
}

export async function getTasksTrend(): Promise<ChartSeries[]> {
  const { data } = await apiClient.get<ChartSeries[]>('/dashboard/charts/tasks-trend');
  return data;
}

export async function getWorkloadByProject(): Promise<ChartSeries[]> {
  const { data } = await apiClient.get<ChartSeries[]>('/dashboard/charts/workload-by-project');
  return data;
}

export async function getHoursByTaskType(): Promise<ChartSeries[]> {
  const { data } = await apiClient.get<ChartSeries[]>('/dashboard/charts/hours-by-task-type');
  return data;
}

export async function getStatusByMember(weekStart: string): Promise<ChartSeries[]> {
  const { data } = await apiClient.get<ChartSeries[]>('/dashboard/charts/status-by-member', {
    params: { weekStart },
  });
  return data;
}

export interface ActivityItem {
  memberName: string;
  reviewerName: string;
  action: 'APPROVED' | 'REQUESTED_CHANGES';
  weekLabel: string;
  timestamp: string;
}

export async function getRecentActivity(limit = 8): Promise<ActivityItem[]> {
  const { data } = await apiClient.get<ActivityItem[]>('/dashboard/activity', { params: { limit } });
  return data;
}
export interface TeamMemberStatus {
  userId: number;
  userName: string;
  reportId: number | null;
  status: 'DRAFT' | 'SUBMITTED' | 'NEEDS_CORRECTION' | 'APPROVED' | 'NOT_STARTED';
}

export async function getTeamStatus(weekStart: string): Promise<TeamMemberStatus[]> {
  const { data } = await apiClient.get<TeamMemberStatus[]>('/dashboard/team-status', {
    params: { weekStart },
  });
  return data;
}