'use client';

import { useEffect, useState } from 'react';
import { getCommentHistory, ReviewCommentItem } from '@/lib/reviewService';

export function CommentHistoryPanel({ reportId }: { reportId: number }) {
  const [comments, setComments] = useState<ReviewCommentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCommentHistory(reportId).then((data) => {
      setComments(data);
      setLoading(false);
    });
  }, [reportId]);

  if (loading) return null;
  if (comments.length === 0) return null;

  return (
    <div className="border border-gray-200 rounded">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <h3 className="text-sm font-medium text-gray-700">Review comment history</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {comments.map((c) => (
          <div key={c.id} className="px-4 py-3 text-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-gray-900">
                {c.reviewerName} —{' '}
                <span className={c.action === 'APPROVED' ? 'text-green-700' : 'text-amber-700'}>
                  {c.action === 'APPROVED' ? 'Approved' : 'Requested changes'}
                </span>
              </span>
              <span className="text-xs text-gray-400">
                v{c.reviewedVersionNumber} · {new Date(c.createdAt).toLocaleString()}
              </span>
            </div>
            {c.comment && <p className="text-gray-600">{c.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}