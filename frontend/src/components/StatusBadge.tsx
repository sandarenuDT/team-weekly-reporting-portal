import { ReportStatus } from '@/types';

const STYLES: Record<ReportStatus, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  SUBMITTED: 'bg-blue-100 text-blue-700',
  NEEDS_CORRECTION: 'bg-amber-100 text-amber-800',
  APPROVED: 'bg-green-100 text-green-700',
};

const LABELS: Record<ReportStatus, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  NEEDS_CORRECTION: 'Needs correction',
  APPROVED: 'Approved',
};

export function StatusBadge({ status }: { status: ReportStatus }) {
  return (
    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded ${STYLES[status]}`}>
      {LABELS[status]}
    </span>
  );
}