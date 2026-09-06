import { apiClient } from './apiClient';
import { Project } from '@/types';

export async function getProjects(): Promise<Project[]> {
  const { data } = await apiClient.get<Project[]>('/projects');
  return data;
}

export async function createProject(name: string, description: string): Promise<Project> {
  const { data } = await apiClient.post<Project>('/projects', { name, description });
  return data;
}

export async function updateProject(id: number, name: string, description: string): Promise<Project> {
  const { data } = await apiClient.put<Project>(`/projects/${id}`, { name, description });
  return data;
}

export async function deleteProject(id: number): Promise<void> {
  await apiClient.delete(`/projects/${id}`);
}