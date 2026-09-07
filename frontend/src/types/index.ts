export type Role = 'TEAM_MEMBER' | 'MANAGER';

export type ReportStatus = 'DRAFT' | 'SUBMITTED' | 'NEEDS_CORRECTION' | 'APPROVED';

export interface AuthUser {
  userId: number;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  userId: number;
  name: string;
  email: string;
  role: Role;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface Task {
  id?: number;
  name: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  plannedPct?: number;
  actualPct?: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'DONE' | 'BLOCKED';
  timePlannedHours?: number;
  timeSpentHours?: number;
  deliverable?: string;
}

export interface Blocker {
  id?: number;
  description: string;
  keyIssue: boolean;
}

export interface Achievement {
  id?: number;
  description: string;
  keyAchievement: boolean;
}

export interface HoursByTaskType {
  id?: number;
  taskType: string;
  hours: number;
}

export interface ReportVersion {
  id: number;
  versionNumber: number;
  submittedAt: string | null;
  tasksPlannedNextWeek: string;
  notes: string;
  tasks: Task[];
  blockers: Blocker[];
  achievements: Achievement[];
  hoursByTaskType: HoursByTaskType[];
}

export interface Report {
  id: number;
  userId: number;
  userName: string;
  projectId: number;
  projectName: string;
  weekStart: string;
  weekEnd: string;
  status: ReportStatus;
  latestReviewerComment: string | null;
  currentVersion: ReportVersion;
}

export interface ReportSummary {
  id: number;
  userId: number;
  userName: string;
  projectName: string;
  weekStart: string;
  weekEnd: string;
  status: ReportStatus;
}

export interface DashboardMetrics {
  totalMembers: number;
  submittedThisWeek: number;
  pendingThisWeek: number;
  lateThisWeek: number;
  needsCorrectionCount: number;
  openBlockersCount: number;
  complianceRatePct: number;
}

export interface ChartSeries {
  label: string;
  value: number;
}