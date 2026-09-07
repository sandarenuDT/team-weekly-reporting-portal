'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { RouteGuard } from '@/components/RouteGuard';
import { AppShell } from '@/components/AppShell';
import { ReportDetailView } from '@/components/reports/ReportDetailView';
import { getReport } from '@/lib/reportService';
import { Report } from '@/types';
import { CommentHistoryPanel } from '@/components/reports/CommentHistoryPanel';
import { ReviewActionBar } from '@/components/reports/ReviewActionBar';

export default function MemberReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   getReport(Number(params.id)).then((data) => {
  //     setReport(data);
  //     setLoading(false);
  //   });
  // }, [params.id]);
const load = useCallback(() => {
    getReport(Number(params.id)).then((data) => {
      setReport(data);
      setLoading(false);
    });
  }, [params.id]);

  useEffect(() => {
    load();
  }, [load]);

  function handleReviewed() {
    load();
    setTimeout(() => router.push('/manager/reports'), 700);
  }
  return (
     <RouteGuard allowedRoles={['MANAGER']}>
      <AppShell>
        <div className="max-w-4xl mx-auto p-8 space-y-6">
          <button
            onClick={() => router.push('/manager/reports')}
            className="text-sm text-brand-600 hover:text-brand-700 font-medium"
          >
            ← Back to reports
          </button>

          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : report ? (
            <>
              <ReportDetailView report={report} />
              <CommentHistoryPanel reportId={report.id} />
              {report.status === 'SUBMITTED' && (
                <ReviewActionBar reportId={report.id} onReviewed={handleReviewed} />
              )}
            </>
          ) : (
            <p className="text-sm text-gray-500">Report not found.</p>
          )}
        </div>
      </AppShell>
    </RouteGuard>
  );
}