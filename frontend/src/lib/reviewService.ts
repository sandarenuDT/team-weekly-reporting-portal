import { apiClient } from './apiClient';
import { Report } from '@/types';

export interface ReviewCommentItem {
  id: number;
  action: 'APPROVED' | 'REQUESTED_CHANGES';
  comment: string | null;
  reviewerName: string;
  reviewedVersionNumber: number;
  createdAt: string;
}

export async function reviewReport(
  reportId: number,
  action: 'APPROVED' | 'REQUESTED_CHANGES',
  comment?: string,
): Promise<Report> {
  const { data } = await apiClient.post<Report>(`/reports/${reportId}/review`, {
    action,
    comment,
  });
  return data;
}

export async function getCommentHistory(reportId: number): Promise<ReviewCommentItem[]> {
  const { data } = await apiClient.get<ReviewCommentItem[]>(`/reports/${reportId}/review/history`);
  return data;
}