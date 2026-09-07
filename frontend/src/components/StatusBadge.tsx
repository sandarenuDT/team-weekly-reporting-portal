import { ReportStatus } from '@/types';

const STYLES: Record<ReportStatus, string> = {
  DRAFT: 'bg-gray-100 text-gray-600',
  SUBMITTED: 'bg-brand-600/10 text-brand-700',
  NEEDS_CORRECTION: 'bg-amber-50 text-amber-700 border border-amber-200',
  APPROVED: 'bg-green-50 text-green-700 border border-green-200',
};

const LABELS: Record<ReportStatus, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  NEEDS_CORRECTION: 'Needs correction',
  APPROVED: 'Approved',
};

export function StatusBadge({ status }: { status: ReportStatus }) {
  return (
    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${STYLES[status]}`}>
      {LABELS[status]}
    </span>
  );
}