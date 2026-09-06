'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { RouteGuard } from '@/components/RouteGuard';
import { AppShell } from '@/components/AppShell';
import { ReportDetailView } from '@/components/reports/ReportDetailView';
import { getReport } from '@/lib/reportService';
import { Report } from '@/types';

export default function MemberReportDetailPage() {
  const params = useParams();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReport(Number(params.id)).then((data) => {
      setReport(data);
      setLoading(false);
    });
  }, [params.id]);

  return (
    <RouteGuard allowedRoles={['TEAM_MEMBER']}>
      <AppShell>
        <div className="max-w-4xl mx-auto p-8">
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : report ? (
            <ReportDetailView report={report} />
          ) : (
            <p className="text-sm text-gray-500">Report not found.</p>
          )}
        </div>
      </AppShell>
    </RouteGuard>
  );
}