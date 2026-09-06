'use client';

import { useState } from 'react';
import { reviewReport } from '@/lib/reviewService';

interface Props {
  reportId: number;
  onReviewed: () => void;
}

export function ReviewActionBar({ reportId, onReviewed }: Props) {
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState<'approve' | 'reject' | null>(null);

  async function handleApprove() {
    setError('');
    setSubmitting('approve');
    try {
      await reviewReport(reportId, 'APPROVED', comment || undefined);
      onReviewed();
    } catch {
      setError('Could not approve the report. Please try again.');
    } finally {
      setSubmitting(null);
    }
  }

  async function handleRequestChanges() {
    setError('');
    if (!comment.trim()) {
      setError('A comment is required when requesting changes.');
      return;
    }
    setSubmitting('reject');
    try {
      await reviewReport(reportId, 'REQUESTED_CHANGES', comment);
      onReviewed();
    } catch {
      setError('Could not submit the review. Please try again.');
    } finally {
      setSubmitting(null);
    }
  }

  return (
    <div className="border border-gray-200 rounded p-5 bg-white">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Review this report</h3>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder="Comment (required if requesting changes)"
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-2"
      />
      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
      <div className="flex gap-3">
        <button
          onClick={handleRequestChanges}
          disabled={submitting !== null}
          className="border border-amber-300 text-amber-800 bg-amber-50 rounded px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {submitting === 'reject' ? 'Submitting...' : 'Request changes'}
        </button>
        <button
          onClick={handleApprove}
          disabled={submitting !== null}
          className="bg-green-600 text-white rounded px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {submitting === 'approve' ? 'Submitting...' : 'Approve'}
        </button>
      </div>
    </div>
  );
}