'use client';

import { useEffect, useState } from 'react';
import { getReportVersions } from '@/lib/reportService';
import { ReportVersion } from '@/types';

interface Props {
  reportId: number;
  currentVersionNumber: number;
}

export function VersionHistoryPanel({ reportId, currentVersionNumber }: Props) {
  const [versions, setVersions] = useState<ReportVersion[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReportVersions(reportId).then((data) => {
      setVersions(data);
      setLoading(false);
    });
  }, [reportId]);

  if (loading) return <p className="text-sm text-gray-500">Loading version history...</p>;
  if (versions.length <= 1) return null; // nothing to show for a first-time submission

  return (
    <div className="border border-gray-200 rounded">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <h3 className="text-sm font-medium text-gray-700">Version history</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {versions.map((v) => {
          const isCurrent = v.versionNumber === currentVersionNumber;
          const isOpen = expanded === v.versionNumber;
          return (
            <div key={v.id}>
              <button
                onClick={() => setExpanded(isOpen ? null : v.versionNumber)}
                className="w-full flex items-center justify-between px-4 py-3 text-left text-sm hover:bg-gray-50"
              >
                <span>
                  Version {v.versionNumber}
                  {isCurrent && <span className="text-gray-400 ml-2">(current)</span>}
                </span>
                <span className="text-gray-400">
                  {v.submittedAt ? `Submitted ${new Date(v.submittedAt).toLocaleString()}` : 'Draft'}
                </span>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 text-sm text-gray-600 space-y-3">
                  <div>
                    <p className="font-medium text-gray-700 mb-1">Tasks</p>
                    <ul className="list-disc list-inside space-y-0.5">
                      {v.tasks.map((t, i) => (
                        <li key={i}>
                          {t.name} — {t.status} ({t.actualPct ?? 0}% of {t.plannedPct ?? 0}% planned)
                        </li>
                      ))}
                    </ul>
                  </div>
                  {v.blockers.length > 0 && (
                    <div>
                      <p className="font-medium text-gray-700 mb-1">Blockers</p>
                      <ul className="list-disc list-inside space-y-0.5">
                        {v.blockers.map((b, i) => (
                          <li key={i}>{b.description}{b.keyIssue && ' (key issue)'}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}