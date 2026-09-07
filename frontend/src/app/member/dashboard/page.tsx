'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RouteGuard } from '@/components/RouteGuard';
import { AppShell } from '@/components/AppShell';
import { StatusBadge } from '@/components/StatusBadge';
import { DonutSummary } from '@/components/dashboard/DonutSummary';
import { HoursBreakdown } from '@/components/dashboard/HoursBreakdown';
import { useAuth } from '@/context/AuthContext';
import { getMyReports, getReport } from '@/lib/reportService';
import { getCommentHistory } from '@/lib/reviewService';
import { ReportSummary, Report } from '@/types';

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${s.toLocaleDateString('en-US', opts)} – ${e.toLocaleDateString('en-US', opts)}, ${s.getFullYear()}`;
}

function formatDate(value: string | null): string {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function mondayOfCurrentWeek(): string {
  const today = new Date();
  const day = today.getDay() === 0 ? 7 : today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - day + 1);
  return monday.toISOString().split('T')[0];
}

export default function MemberDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [latest, setLatest] = useState<ReportSummary | null>(null);
  const [commentCount, setCommentCount] = useState(0);
  const [currentWeekReport, setCurrentWeekReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const list = await getMyReports();
      setReports(list);

      const sorted = [...list].sort((a, b) => b.weekStart.localeCompare(a.weekStart));
      const mostRecent = sorted[0] ?? null;
      setLatest(mostRecent);

      if (mostRecent) {
        getCommentHistory(mostRecent.id).then((c) => setCommentCount(c.length));
      }

      const thisWeekStart = mondayOfCurrentWeek();
      const thisWeek = list.find((r) => r.weekStart === thisWeekStart);
      if (thisWeek) {
        const full = await getReport(thisWeek.id);
        setCurrentWeekReport(full);
      }

      setLoading(false);
    }
    load();
  }, []);
  
  const total = reports.length;
  const approved = reports.filter((r) => r.status === 'APPROVED').length;
  const needsCorrection = reports.filter((r) => r.status === 'NEEDS_CORRECTION').length;
  const draft = reports.filter((r) => r.status === 'DRAFT').length;
  // const recent = [...reports].sort((a, b) => b.weekStart.localeCompare(a.weekStart)).slice(0, 5);
  // const submittedAt = reports.filter((r) => r.status === 'SUBMITTED').length;
const recent = [...reports].sort((a, b) => b.weekStart.localeCompare(a.weekStart)).slice(0, 5);
  if (loading) {
    return (
      <RouteGuard allowedRoles={['TEAM_MEMBER']}>
        <AppShell>
          <div className="p-8 text-sm text-gray-400">Loading…</div>
        </AppShell>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard allowedRoles={['TEAM_MEMBER']}>
      <AppShell>
        <div className="max-w-6xl mx-auto p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-xl font-semibold text-gray-900">
                {greeting()}, {user?.name?.split(' ')[0]} 👋
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">Here's your weekly report overview.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-xs text-gray-500 mb-2">Total Reports</p>
              <p className="text-2xl font-semibold text-gray-900">{total}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-xs text-gray-500 mb-2">Approved</p>
              <p className="text-2xl font-semibold text-green-600">{approved}</p>
              <p className="text-xs text-gray-400 mt-1">{total > 0 ? Math.round((approved / total) * 100) : 0}% of total</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-xs text-gray-500 mb-2">Needs Correction</p>
              <p className="text-2xl font-semibold text-amber-600">{needsCorrection}</p>
              <p className="text-xs text-gray-400 mt-1">{total > 0 ? Math.round((needsCorrection / total) * 100) : 0}% of total</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-xs text-gray-500 mb-2">Draft</p>
              <p className="text-2xl font-semibold text-gray-500">{draft}</p>
              <p className="text-xs text-gray-400 mt-1">{total > 0 ? Math.round((draft / total) * 100) : 0}% of total</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="font-heading text-sm font-semibold text-gray-900 mb-4">Latest Report</h2>
                {latest ? (
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        {formatDateRange(latest.weekStart, latest.weekEnd)}
                      </span>
                      <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">
                        {latest.projectName}
                      </span>
                      <span className="ml-auto">
                        <StatusBadge status={latest.status} />
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-4">
                      Submitted on {formatDate(latest.submittedAt)}
                      {commentCount > 0 && ` · ${commentCount} comment${commentCount > 1 ? 's' : ''}`}
                    </p>
                    <button
                      onClick={() => router.push(`/member/reports/${latest.id}`)}
                      className="bg-brand-600 hover:bg-brand-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition"
                    >
                      View Report
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No reports yet — create your first one.</p>
                )}
              </div> */}

              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="font-heading text-sm font-semibold text-gray-900">Recent Reports</h2>
                </div>
                {recent.length === 0 ? (
                  <p className="text-sm text-gray-400 px-6 py-6">No reports yet.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="bg-brand-bg text-left">
                      <tr>
                        <th className="px-6 py-2.5 font-medium text-gray-500">Week</th>
                        <th className="px-6 py-2.5 font-medium text-gray-500">Project</th>
                        <th className="px-6 py-2.5 font-medium text-gray-500">Status</th>
                        <th className="px-6 py-2.5 font-medium text-gray-500">Submitted</th>
                        <th className="px-6 py-2.5 font-medium text-gray-500 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recent.map((r) => (
                        <tr key={r.id} className="border-t border-gray-100">
                          <td className="px-6 py-3 text-gray-900">{formatDateRange(r.weekStart, r.weekEnd)}</td>
                          <td className="px-6 py-3 text-gray-600">{r.projectName}</td>
                          <td className="px-6 py-3"><StatusBadge status={r.status} /></td>
                          {/* <td className="px-6 py-3 text-gray-500">{formatDate(r.submittedAt)}</td> */}
                          <td className="px-6 py-3 text-right">
                            <button
                              onClick={() => router.push(`/member/reports/${r.id}`)}
                              className="text-brand-600 hover:text-brand-700 font-medium text-xs"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-2">
                <h2 className="font-heading text-sm font-semibold text-gray-900 mb-3">Quick Actions</h2>
                <button
                  onClick={() => router.push('/member/my-report')}
                  className="w-full flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg px-3.5 py-2.5 text-sm font-medium transition"
                >
                  + Create New Report
                </button>
                <button
                  onClick={() => router.push('/member/history')}
                  className="w-full flex items-center gap-2 border border-gray-200 hover:bg-gray-50 rounded-lg px-3.5 py-2.5 text-sm font-medium text-gray-700 transition"
                >
                  View Report History
                </button>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h2 className="font-heading text-sm font-semibold text-gray-900 mb-4">This Week's Summary</h2>
                <DonutSummary
                  total={total}
                  segments={[
                    { label: 'Approved', value: approved, color: '#16a34a' },
                    { label: 'Needs Correction', value: needsCorrection, color: '#d97706' },
                    { label: 'Draft', value: draft, color: '#9ca3af' },
                  ]}
                />
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h2 className="font-heading text-sm font-semibold text-gray-900 mb-4">Your Weekly Hours</h2>
                <HoursBreakdown hours={currentWeekReport?.currentVersion?.hoursByTaskType ?? []} />
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    </RouteGuard>
  );
}