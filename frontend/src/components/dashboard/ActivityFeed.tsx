import { ActivityItem } from '@/lib/dashboardService';

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-gray-400">No recent activity.</p>;
  }

  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="text-sm flex items-start gap-2">
          <span
            className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              item.action === 'APPROVED' ? 'bg-green-500' : 'bg-amber-500'
            }`}
          />
          <span className="text-gray-600">
            <strong className="text-gray-900">{item.reviewerName}</strong>{' '}
            {item.action === 'APPROVED' ? 'approved' : 'requested changes on'}{' '}
            <strong className="text-gray-900">{item.memberName}</strong>&apos;s report for week of{' '}
            {item.weekLabel}
            <span className="text-gray-400 ml-1">
              · {new Date(item.timestamp).toLocaleDateString()}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}