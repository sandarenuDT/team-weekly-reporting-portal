'use client';

import { useRouter } from 'next/navigation';
import { ReportSummary } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';

interface Props {
  reports: ReportSummary[];
  showMember?: boolean;
  detailBasePath: string; // e.g. '/member/reports' or '/manager/reports'
}

export function ReportTable({ reports, showMember = false, detailBasePath }: Props) {
  const router = useRouter();

  if (reports.length === 0) {
    return <p className="text-sm text-gray-500 py-6">No reports found.</p>;
  }

  return (
    <div className="overflow-x-auto border border-gray-200 rounded">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 text-left">
          <tr>
            {showMember && <th className="px-4 py-2 font-medium">Member</th>}
            <th className="px-4 py-2 font-medium">Week</th>
            <th className="px-4 py-2 font-medium">Project</th>
            <th className="px-4 py-2 font-medium">Status</th>
            <th className="px-4 py-2 font-medium w-20" />
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr
              key={r.id}
              className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer"
              onClick={() => router.push(`${detailBasePath}/${r.id}`)}
            >
              {showMember && <td className="px-4 py-2">{r.userName}</td>}
              <td className="px-4 py-2">
                {r.weekStart} – {r.weekEnd}
              </td>
              <td className="px-4 py-2">{r.projectName}</td>
              <td className="px-4 py-2">
                <StatusBadge status={r.status} />
              </td>
              <td className="px-4 py-2 text-right text-gray-400">→</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}