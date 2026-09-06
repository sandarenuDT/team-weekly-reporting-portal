interface Props {
  label: string;
  value: string | number;
  tone?: 'default' | 'warning' | 'danger';
}

const TONES: Record<string, string> = {
  default: 'text-gray-900',
  warning: 'text-amber-700',
  danger: 'text-red-700',
};

export function MetricCard({ label, value, tone = 'default' }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-5 py-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-semibold ${TONES[tone]}`}>{value}</p>
    </div>
  );
}