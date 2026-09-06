'use client';

import { useEffect, useState } from 'react';
import { RouteGuard } from '@/components/RouteGuard';
import { AppShell } from '@/components/AppShell';
import { ReportTable } from '@/components/reports/ReportTable';
import { getMyReports } from '@/lib/reportService';
import { ReportSummary } from '@/types';

export default function HistoryPage() {
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyReports().then((data) => {
      setReports(data);
      setLoading(false);
    });
  }, []);

  return (
    <RouteGuard allowedRoles={['TEAM_MEMBER']}>
      <AppShell>
        <div className="max-w-4xl mx-auto p-8">
          <h1 className="text-xl font-semibold mb-1">Report history</h1>
          <p className="text-sm text-gray-500 mb-6">All your past weekly reports and their status.</p>
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : (
            <ReportTable reports={reports} detailBasePath="/member/reports" />
          )}
        </div>
      </AppShell>
    </RouteGuard>
  );
}