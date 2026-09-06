'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { RouteGuard } from '@/components/RouteGuard';
import { AppShell } from '@/components/AppShell';
import { ReportTable } from '@/components/reports/ReportTable';
import { StatCard } from '@/components/dashboard/StartCard';
import { getFilteredReports } from '@/lib/reportService';
import { getAllUsers, getUserStats, TeamMember, UserStats } from '@/lib/userService';
import { ReportSummary } from '@/types';

export default function TeamMemberProfilePage() {
  const params = useParams();
  const userId = Number(params.id);
  const [member, setMember] = useState<TeamMember | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAllUsers(),
      getUserStats(userId),
      getFilteredReports({ userId, size: 100 }),
    ]).then(([users, userStats, reportPage]) => {
      setMember(users.find((u) => u.id === userId) ?? null);
      setStats(userStats);
      setReports(reportPage.content);
      setLoading(false);
    });
  }, [userId]);

  if (loading) {
    return (
      <RouteGuard allowedRoles={['MANAGER']}>
        <AppShell>
          <div className="p-8 text-gray-500">Loading...</div>
        </AppShell>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard allowedRoles={['MANAGER']}>
      <AppShell>
        <div className="max-w-4xl mx-auto p-8 space-y-8">
          <div>
            <h1 className="text-xl font-semibold">{member?.name}</h1>
            <p className="text-sm text-gray-500">{member?.email}</p>
          </div>

          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <StatCard label="Total reports" value={stats.totalReports} />
              <StatCard label="Approved" value={stats.approvedCount} />
              <StatCard label="Needs correction" value={stats.needsCorrectionCount} />
              <StatCard label="Avg plan vs actual gap" value={`${stats.avgPlannedVsActualPct}%`} />
              <StatCard label="Blockers raised" value={stats.totalBlockersRaised} />
            </div>
          )}

          <section>
            <h2 className="text-sm font-medium text-gray-700 mb-3">Report history</h2>
            <ReportTable reports={reports} detailBasePath="/manager/reports" />
          </section>
        </div>
      </AppShell>
    </RouteGuard>
  );
}