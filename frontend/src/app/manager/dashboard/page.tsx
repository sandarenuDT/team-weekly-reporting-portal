'use client';

import { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { RouteGuard } from '@/components/RouteGuard';
import { AppShell } from '@/components/AppShell';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import {
  ActivityItem,
  getHoursByTaskType,
  getMetrics,
  getRecentActivity,
  getStatusByMember,
  getTasksTrend,
  getWorkloadByProject,
} from '@/lib/dashboardService';
import { ChartSeries, DashboardMetrics, ReportStatus } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';
const COLORS = ['#2563eb', '#16a34a', '#d97706', '#dc2626', '#7c3aed', '#0891b2'];
const STATUS_LABELS = ['Draft', 'Submitted', 'Needs correction', 'Approved'];
const ORDINAL_TO_STATUS: Record<number, ReportStatus> = {
  0: 'DRAFT',
  1: 'SUBMITTED',
  2: 'NEEDS_CORRECTION',
  3: 'APPROVED',
};
function mondayOfCurrentWeek(): string {
  const today = new Date();
  const day = today.getDay() === 0 ? 7 : today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - day + 1);
  return monday.toISOString().split('T')[0];
}

export default function ManagerDashboardPage() {
  const weekStart = mondayOfCurrentWeek();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [tasksTrend, setTasksTrend] = useState<ChartSeries[]>([]);
  const [workload, setWorkload] = useState<ChartSeries[]>([]);
  const [hoursByType, setHoursByType] = useState<ChartSeries[]>([]);
  const [statusByMember, setStatusByMember] = useState<ChartSeries[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getMetrics(weekStart),
      getTasksTrend(),
      getWorkloadByProject(),
      getHoursByTaskType(),
      getStatusByMember(weekStart),
      getRecentActivity(),
    ]).then(([m, trend, wl, hbt, sbm, act]) => {
      setMetrics(m);
      setTasksTrend(trend);
      setWorkload(wl);
      setHoursByType(hbt);
      setStatusByMember(sbm);
      setActivity(act);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || !metrics) {
    return (
      <RouteGuard allowedRoles={['MANAGER']}>
        <AppShell>
          <div className="p-8 text-gray-500">Loading dashboard...</div>
        </AppShell>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard allowedRoles={['MANAGER']}>
      <AppShell>
        <div className="p-8 max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-xl font-semibold">Team dashboard</h1>
            <p className="text-sm text-gray-500">Week of {weekStart}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="Submitted this week" value={metrics.submittedThisWeek} />
            <MetricCard label="Compliance rate" value={`${metrics.complianceRatePct}%`} />
            <MetricCard
              label="Needs correction"
              value={metrics.needsCorrectionCount}
              tone={metrics.needsCorrectionCount > 0 ? 'warning' : 'default'}
            />
            <MetricCard
              label="Open blockers"
              value={metrics.openBlockersCount}
              tone={metrics.openBlockersCount > 0 ? 'danger' : 'default'}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <ChartCard title="Tasks completed trend">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={tasksTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Workload by project">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={workload}
                    dataKey="value"
                    innerRadius={38}
                    nameKey="label"
                    outerRadius={54}
                    paddingAngle={2}
                    stroke="none"
                    label={({ label, value }) => `${label} (${value})`}
                  >
                    {workload.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={24} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Time spent by task type (team-wide)">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={hoursByType}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#16a34a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
            
            <ChartCard title="Submission status by member">
              <div className="space-y-2">
                {statusByMember.map((m) => (
                  <div key={m.label} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{m.label}</span>
                    <StatusBadge status={ORDINAL_TO_STATUS[m.value]} />
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>

          <ChartCard title="Recent activity">
            <ActivityFeed items={activity} />
          </ChartCard>
        </div>
      </AppShell>
    </RouteGuard>
  );
}