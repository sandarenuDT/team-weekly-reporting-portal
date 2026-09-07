'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface Segment {
  label: string;
  value: number;
  color: string;
}

export function DonutSummary({ segments, total }: { segments: Segment[]; total: number }) {
  const data = segments.filter((s) => s.value > 0);

  return (
    <div className="flex items-center gap-5">
      <div className="relative w-28 h-28 flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={38}
              outerRadius={54}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((s, i) => (
                <Cell key={i} fill={s.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-semibold text-gray-900">{total}</span>
          <span className="text-[10px] text-gray-400">Total Reports</span>
        </div>
      </div>
      <div className="space-y-2">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-gray-600">
              {s.label} <span className="text-gray-400">({s.value} {total > 0 ? `· ${Math.round((s.value / total) * 100)}%` : ''})</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}