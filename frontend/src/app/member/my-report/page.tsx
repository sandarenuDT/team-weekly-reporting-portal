
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RouteGuard } from '@/components/RouteGuard';
import { AppShell } from '@/components/AppShell';
import { StatusBadge } from '@/components/StatusBadge';
import { TaskTable } from '@/components/reports/TaskTable';
import { FlaggableList } from '@/components/reports/FlaggableList';
import { getProjects } from '@/lib/projectService';
import {
  createReport, getMyReports, getReport, submitReport, updateReport, ReportContentPayload,
} from '@/lib/reportService';
// import { useToast } from '@/context/ToastContext';
import { toast } from 'sonner';
import { Achievement, Blocker, HoursByTaskType, Project, Report, ReportStatus, Task } from '@/types';

function mondayOfCurrentWeek(): string {
  const today = new Date();
  const day = today.getDay() === 0 ? 7 : today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - day + 1);
  return monday.toISOString().split('T')[0];
}

function NothingToDo({ weekStart, status }: { weekStart: string; status: ReportStatus }) {
  const router = useRouter();
  const copy = status === 'APPROVED'
    ? { title: 'You\u2019re all set for this week', body: 'Your report for this week has already been approved. There\u2019s nothing left to submit.' }
    : { title: 'Report already submitted', body: 'Your report for this week is in with your manager for review. You\u2019ll be notified if any changes are needed.' };

  return (
    <div className="max-w-lg mx-auto text-center py-20">
      <div className="w-14 h-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-2xl font-bold mx-auto mb-5">
        {status === 'APPROVED' ? '\u2713' : '\u25cf'}
      </div>
      <h1 className="font-heading text-lg font-semibold text-gray-900 mb-1.5">{copy.title}</h1>
      <p className="text-sm text-gray-500 mb-1">{copy.body}</p>
      <p className="text-xs text-gray-400 mb-6">Week of {weekStart}</p>
      <button
        onClick={() => router.push('/member/history')}
        className="text-sm text-brand-600 hover:text-brand-700 font-medium underline"
      >
        View it in your report history →
      </button>
    </div>
  );
}

export default function MyReportPage() {
  const router = useRouter();
  // const toast = useToast();
  const weekStart = mondayOfCurrentWeek();

  const [report, setReport] = useState<Report | null>(null); // null = no report yet this week
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState<number | ''>('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksPlannedNextWeek, setTasksPlannedNextWeek] = useState('');
  const [blockers, setBlockers] = useState<Blocker[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [hours, setHours] = useState<HoursByTaskType[]>([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const editable = !report || report.status === 'DRAFT' || report.status === 'NEEDS_CORRECTION';
  const locked = report && (report.status === 'SUBMITTED' || report.status === 'APPROVED');

  useEffect(() => {
    async function load() {
      const [projectList, myReports] = await Promise.all([getProjects(), getMyReports()]);
      setProjects(projectList);

      const existing = myReports.find((r) => r.weekStart === weekStart);
      if (existing) {
        const full = await getReport(existing.id);
        hydrateFromReport(full);
      } else if (projectList.length > 0) {
        setProjectId(projectList[0].id);
      }
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function hydrateFromReport(r: Report) {
    setReport(r);
    setProjectId(r.projectId);
    setTasks(r.currentVersion.tasks);
    setTasksPlannedNextWeek(r.currentVersion.tasksPlannedNextWeek ?? '');
    setBlockers(r.currentVersion.blockers.map((b) => ({ ...b })));
    setAchievements(r.currentVersion.achievements.map((a) => ({ ...a })));
    setHours(r.currentVersion.hoursByTaskType.map((h) => ({ ...h })));
    setNotes(r.currentVersion.notes ?? '');
  }

  function buildPayload(): ReportContentPayload {
    return {
      projectId: Number(projectId), weekStart, tasks, tasksPlannedNextWeek,
      blockers, achievements, hoursByTaskType: hours, notes,
    };
  }

  async function handleSaveDraft() {
    if (!projectId) {
      toast.success('report.submit.noProject');
      return;
    }
    setSaving(true);
    try {
      const payload = buildPayload();
      const saved = report ? await updateReport(report.id, payload) : await createReport(payload);
      hydrateFromReport(saved);
      toast.success('report.draft.saved');
    } catch {
      toast.error('report.draft.error');
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit() {
    if (!projectId || tasks.length === 0) {
      toast.success('report.submit.noTasks');
      return;
    }
    setSaving(true);
    try {
      const payload = buildPayload();
      const saved = report ? await updateReport(report.id, payload) : await createReport(payload);
      const submitted = await submitReport(saved.id);
      hydrateFromReport(submitted);
      toast.success('report.submit.success');
    } catch {
      toast.error('report.submit.error');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <RouteGuard allowedRoles={['TEAM_MEMBER']}>
        <AppShell><div className="p-8 text-sm text-gray-400">Loading\u2026</div></AppShell>
      </RouteGuard>
    );
  }

  // State 3: locked — nothing to fill in, just a message.
  if (locked && report) {
    return (
      <RouteGuard allowedRoles={['TEAM_MEMBER']}>
        <AppShell><NothingToDo weekStart={weekStart} status={report.status} /></AppShell>
      </RouteGuard>
    );
  }

  // States 1 & 2: blank form (no report yet) or editable form (draft / needs correction).
  return (
    <RouteGuard allowedRoles={['TEAM_MEMBER']}>
      <AppShell>
        <div className="max-w-13xl mx-auto p-8 pb-24">
          <div className="flex items-center justify-between mb-1">
            <h1 className="font-heading text-xl font-semibold text-gray-900">
              {report ? 'Edit report' : 'New report'}
            </h1>
            {report && <StatusBadge status={report.status} />}
          </div>
          <p className="text-sm text-gray-500 mb-6">Week of {weekStart}</p>

          {report?.status === 'NEEDS_CORRECTION' && report.latestReviewerComment && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 mb-6">
              <span className="font-medium">Manager feedback:</span> {report.latestReviewerComment}
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Project</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(Number(e.target.value))}
                className="w-full max-w-xs border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-900 mb-3">Tasks completed</h2>
              <TaskTable tasks={tasks} onChange={setTasks} />
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-900 mb-2">Planned for next week</h2>
              <textarea
                value={tasksPlannedNextWeek}
                onChange={(e) => setTasksPlannedNextWeek(e.target.value)}
                rows={2}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15"
              />
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-900 mb-2">Blockers</h2>
              <FlaggableList items={blockers} flagKey="keyIssue" flagLabel="Key issue"
                placeholder="Anything holding you up?" onChange={setBlockers} />
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-900 mb-2">Achievements</h2>
              <FlaggableList items={achievements} flagKey="keyAchievement" flagLabel="Key achievement"
                placeholder="Something worth highlighting?" onChange={setAchievements} />
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-900 mb-2">
                Hours by task type <span className="text-gray-400 font-normal text-xs">(optional)</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {hours.map((h, i) => (
                  <div key={i} className="flex border border-gray-200 rounded-md overflow-hidden">
                    <input
                      value={h.taskType}
                      onChange={(e) => {
                        const next = [...hours];
                        next[i] = { ...next[i], taskType: e.target.value };
                        setHours(next);
                      }}
                      placeholder="e.g. Development"
                      className="w-32 px-2.5 py-1.5 text-sm outline-none"
                    />
                    <input
                      type="number" step="0.5"
                      value={h.hours}
                      onChange={(e) => {
                        const next = [...hours];
                        next[i] = { ...next[i], hours: Number(e.target.value) };
                        setHours(next);
                      }}
                      className="w-16 px-2 py-1.5 text-sm outline-none border-l border-gray-200"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setHours([...hours, { taskType: '', hours: 0 }])}
                  className="text-sm text-brand-600 hover:text-brand-700 font-medium px-2"
                >
                  + Add
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-900 mb-2">
                Notes or links <span className="text-gray-400 font-normal text-xs">(optional)</span>
              </h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15"
              />
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-56 right-0 bg-white border-t border-gray-200 px-8 py-4 flex justify-end gap-3">
          <button
            onClick={handleSaveDraft}
            disabled={saving}
            className="border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50"
          >
            Save draft
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-brand-600 hover:bg-brand-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition disabled:opacity-50"
          >
            {report?.status === 'NEEDS_CORRECTION' ? 'Resubmit' : 'Submit'}
          </button>
        </div>
      </AppShell>
    </RouteGuard>
  );
}