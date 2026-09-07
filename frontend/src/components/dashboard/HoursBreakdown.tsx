import { HoursByTaskType } from '@/types';

export function HoursBreakdown({ hours }: { hours: HoursByTaskType[] }) {
  const total = hours.reduce((sum, h) => sum + h.hours, 0);
  const max = Math.max(...hours.map((h) => h.hours), 1);

  if (hours.length === 0) {
    return <p className="text-sm text-gray-400">No hours logged for this week yet.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
        <span>This week</span>
        <span>Total {total}h</span>
      </div>
      {hours.map((h) => (
        <div key={h.taskType}>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">{h.taskType}</span>
            <span className="text-gray-500">{h.hours}h</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-600 rounded-full"
              style={{ width: `${(h.hours / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}