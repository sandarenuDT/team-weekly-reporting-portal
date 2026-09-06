'use client';

import { StatusBadge } from '@/components/StatusBadge';
import { VersionHistoryPanel } from './VersionHistoryPanel';
import { Report } from '@/types';

export function ReportDetailView({ report }: { report: Report }) {
  const v = report.currentVersion;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">
            {report.userName} — Week of {report.weekStart}
          </h1>
          <p className="text-sm text-gray-500">{report.projectName}</p>
        </div>
        <StatusBadge status={report.status} />
      </div>

      {report.latestReviewerComment && (
        <div className="bg-amber-50 border border-amber-200 rounded px-4 py-3 text-sm text-amber-800">
          <strong>Latest reviewer comment:</strong> {report.latestReviewerComment}
        </div>
      )}

      <section>
        <h2 className="text-sm font-medium text-gray-700 mb-2">Tasks completed</h2>
        <div className="overflow-x-auto border border-gray-200 rounded">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="px-3 py-2 font-medium">Task</th>
                <th className="px-3 py-2 font-medium">Priority</th>
                <th className="px-3 py-2 font-medium">Planned %</th>
                <th className="px-3 py-2 font-medium">Actual %</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Hours (P/S)</th>
                <th className="px-3 py-2 font-medium">Deliverable</th>
              </tr>
            </thead>
            <tbody>
              {v.tasks.map((t, i) => (
                <tr key={i} className="border-t border-gray-100">
                  <td className="px-3 py-2">{t.name}</td>
                  <td className="px-3 py-2">{t.priority}</td>
                  <td className="px-3 py-2">{t.plannedPct ?? '—'}</td>
                  <td className="px-3 py-2">{t.actualPct ?? '—'}</td>
                  <td className="px-3 py-2">{t.status}</td>
                  <td className="px-3 py-2">{t.timePlannedHours ?? '—'} / {t.timeSpentHours ?? '—'}</td>
                  <td className="px-3 py-2">{t.deliverable ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-medium text-gray-700 mb-2">Tasks planned for next week</h2>
        <p className="text-sm text-gray-600">{v.tasksPlannedNextWeek || '—'}</p>
      </section>

      <section>
        <h2 className="text-sm font-medium text-gray-700 mb-2">Blockers / challenges</h2>
        {v.blockers.length === 0 ? (
          <p className="text-sm text-gray-400">None reported.</p>
        ) : (
          <ul className="text-sm text-gray-600 space-y-1">
            {v.blockers.map((b, i) => (
              <li key={i}>
                {b.keyIssue && <span className="font-medium text-amber-700">[Key issue] </span>}
                {b.description}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-sm font-medium text-gray-700 mb-2">Achievements / highlights</h2>
        {v.achievements.length === 0 ? (
          <p className="text-sm text-gray-400">None reported.</p>
        ) : (
          <ul className="text-sm text-gray-600 space-y-1">
            {v.achievements.map((a, i) => (
              <li key={i}>
                {a.keyAchievement && <span className="font-medium text-green-700">[Key achievement] </span>}
                {a.description}
              </li>
            ))}
          </ul>
        )}
      </section>

      {v.hoursByTaskType.length > 0 && (
        <section>
          <h2 className="text-sm font-medium text-gray-700 mb-2">Hours by task type</h2>
          <ul className="text-sm text-gray-600 space-y-1">
            {v.hoursByTaskType.map((h, i) => (
              <li key={i}>{h.taskType}: {h.hours}h</li>
            ))}
          </ul>
        </section>
      )}

      {v.notes && (
        <section>
          <h2 className="text-sm font-medium text-gray-700 mb-2">Notes</h2>
          <p className="text-sm text-gray-600">{v.notes}</p>
        </section>
      )}

      <VersionHistoryPanel reportId={report.id} currentVersionNumber={v.versionNumber} />
    </div>
  );
}