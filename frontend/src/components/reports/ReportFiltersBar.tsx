'use client';

import { Project } from '@/types';
import { TeamMember } from '@/lib/userService';

export interface FilterState {
  userId: string;
  projectId: string;
  status: string;
  weekFrom: string;
  weekTo: string;
}

interface Props {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  members: TeamMember[];
  projects: Project[];
}

export function ReportFiltersBar({ filters, onChange, members, projects }: Props) {
  function set<K extends keyof FilterState>(key: K, value: string) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="flex flex-wrap gap-3 items-end bg-white border border-gray-200 rounded-lg p-4">
      <div>
        <label className="block text-xs text-gray-500 mb-1">Member</label>
        <select
          value={filters.userId}
          onChange={(e) => set('userId', e.target.value)}
          className="border border-gray-300 rounded px-2 py-1.5 text-sm"
        >
          <option value="">All members</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Project</label>
        <select
          value={filters.projectId}
          onChange={(e) => set('projectId', e.target.value)}
          className="border border-gray-300 rounded px-2 py-1.5 text-sm"
        >
          <option value="">All projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Status</label>
        <select
          value={filters.status}
          onChange={(e) => set('status', e.target.value)}
          className="border border-gray-300 rounded px-2 py-1.5 text-sm"
        >
          <option value="">All statuses</option>
          {/* <option value="DRAFT">Draft</option> */}
          <option value="SUBMITTED">Submitted</option>
          <option value="NEEDS_CORRECTION">Needs correction</option>
          <option value="APPROVED">Approved</option>
          <option value="NOT_STARTED">Not started</option>
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Week from</label>
        <input
          type="date"
          value={filters.weekFrom}
          onChange={(e) => set('weekFrom', e.target.value)}
          className="border border-gray-300 rounded px-2 py-1.5 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Week to</label>
        <input
          type="date"
          value={filters.weekTo}
          onChange={(e) => set('weekTo', e.target.value)}
          className="border border-gray-300 rounded px-2 py-1.5 text-sm"
        />
      </div>
      <button
        onClick={() => onChange({ userId: '', projectId: '', status: '', weekFrom: '', weekTo: '' })}
        className="text-sm text-gray-500 hover:text-gray-900 underline pb-1.5"
      >
        Clear
      </button>
    </div>
  );
}