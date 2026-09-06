'use client';

import { useRouter } from 'next/navigation';
import { TeamMemberStatus } from '@/lib/dashboardService';

const STYLES: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  SUBMITTED: 'bg-blue-100 text-blue-700',
  NEEDS_CORRECTION: 'bg-amber-100 text-amber-800',
  APPROVED: 'bg-green-100 text-green-700',
  NOT_STARTED: 'bg-red-50 text-red-600 border border-red-200',
};

const LABELS: Record<string, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  NEEDS_CORRECTION: 'Needs correction',
  APPROVED: 'Approved',
  NOT_STARTED: 'Not started',
};

interface Props {
  members: TeamMemberStatus[];
  statusFilter: string; // '' = all, includes 'NOT_STARTED'
}

export function TeamStatusGrid({ members, statusFilter }: Props) {
  const router = useRouter();
  const filtered = statusFilter ? members.filter((m) => m.status === statusFilter) : members;

  if (filtered.length === 0) {
    return <p className="text-sm text-gray-400 py-4">No team members match this filter.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {filtered.map((m) => (
        <button
          key={m.userId}
          onClick={() => m.reportId && router.push(`/manager/reports/${m.reportId}`)}
          disabled={!m.reportId}
          className="text-left border border-gray-200 rounded-lg p-4 bg-white hover:bg-gray-50 disabled:hover:bg-white disabled:cursor-default"
        >
          <p className="text-sm font-medium mb-2">{m.userName}</p>
          <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded ${STYLES[m.status]}`}>
            {LABELS[m.status]}
          </span>
        </button>
      ))}
    </div>
  );
}