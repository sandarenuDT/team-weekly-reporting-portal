import { apiClient } from './apiClient';

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: 'TEAM_MEMBER' | 'MANAGER';
  isActive: boolean;
  createdAt: string;
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const { data } = await apiClient.get<TeamMember[]>('/users/team-members');
  return data;
}

export async function getAllUsers(): Promise<TeamMember[]> {
  const { data } = await apiClient.get<TeamMember[]>('/users');
  return data;
}

export async function inviteUser(name: string, email: string, password: string, role: string) {
  const { data } = await apiClient.post('/users/invite', { name, email, password, role });
  return data;
}

export async function updateUserRole(userId: number, role: string) {
  const { data } = await apiClient.patch(`/users/${userId}/role`, { role });
  return data;
}

export async function deactivateUser(userId: number) {
  await apiClient.patch(`/users/${userId}/deactivate`);
}

export async function reactivateUser(userId: number) {
  await apiClient.patch(`/users/${userId}/reactivate`);
}

export interface UserStats {
  totalReports: number;
  approvedCount: number;
  needsCorrectionCount: number;
  avgPlannedVsActualPct: number;
  totalBlockersRaised: number;
}

export async function getUserStats(userId: number): Promise<UserStats> {
  const { data } = await apiClient.get<UserStats>(`/users/${userId}/stats`);
  return data;
}