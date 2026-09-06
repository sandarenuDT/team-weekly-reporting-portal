'use client';

import { useEffect, useState } from 'react';
import { RouteGuard } from '@/components/RouteGuard';
import { AppShell } from '@/components/AppShell';
import { StatusBadge } from '@/components/StatusBadge';
import { TaskTable } from '@/components/reports/TaskTable';
import { FlaggableList } from '@/components/reports/FlaggableList';
import { getProjects } from '@/lib/projectService';
import {
  createReport,
  getMyReports,
  submitReport,
  updateReport,
  ReportContentPayload,
} from '@/lib/reportService';
import { getReport } from '@/lib/reportService';
import { Achievement, Blocker, HoursByTaskType, Project, Report, Task } from '@/types';

function mondayOfCurrentWeek(): string {
  const today = new Date();
  const day = today.getDay() === 0 ? 7 : today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - day + 1);
  return monday.toISOString().split('T')[0];
}

export default function MyReportPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [report, setReport] = useState<Report | null>(null);
  const [projectId, setProjectId] = useState<number | ''>('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksPlannedNextWeek, setTasksPlannedNextWeek] = useState('');
  const [blockers, setBlockers] = useState<Blocker[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [hours, setHours] = useState<HoursByTaskType[]>([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const weekStart = mondayOfCurrentWeek();
  const editable = !report || report.status === 'DRAFT' || report.status === 'NEEDS_CORRECTION';

  useEffect(() => {
    async function load() {
      const [projectList, myReports] = await Promise.all([getProjects(), getMyReports()]);
      setProjects(projectList);

      const thisWeek = myReports.find((r) => r.weekStart === weekStart);
      if (thisWeek) {
        const full = await getReport(thisWeek.id);
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
      projectId: Number(projectId),
      weekStart,
      tasks,
      tasksPlannedNextWeek,
      blockers,
      achievements,
      hoursByTaskType: hours,
      notes,
    };
  }

  async function handleSaveDraft() {
    if (!projectId) {
      setMessage('Select a project before saving.');
      return;
    }
    setSaving(true);
    setMessage('');
    try {
      const payload = buildPayload();
      const saved = report ? await updateReport(report.id, payload) : await createReport(payload);
      hydrateFromReport(saved);
      setMessage('Draft saved.');
    } catch {
      setMessage('Could not save the draft. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit() {
    if (!projectId || tasks.length === 0) {
      setMessage('Add at least one task before submitting.');
      return;
    }
    setSaving(true);
    setMessage('');
    try {
      const payload = buildPayload();
      const saved = report ? await updateReport(report.id, payload) : await createReport(payload);
      const submitted = await submitReport(saved.id);
      hydrateFromReport(submitted);
      setMessage('Report submitted for review.');
    } catch {
      setMessage('Could not submit the report. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <RouteGuard allowedRoles={['TEAM_MEMBER']}>
        <AppShell>
          <div className="p-8 text-gray-500">Loading...</div>
        </AppShell>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard allowedRoles={['TEAM_MEMBER']}>
      <AppShell>
        <div className="max-w-4xl mx-auto p-8">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-xl font-semibold">Week of {weekStart}</h1>
            {report && <StatusBadge status={report.status} />}
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Every report follows the same fixed structure across the team.
          </p>

          {report?.status === 'NEEDS_CORRECTION' && report.latestReviewerComment && (
            <div className="bg-amber-50 border border-amber-200 rounded px-4 py-3 mb-6 text-sm text-amber-800">
              <strong>Manager feedback:</strong> {report.latestReviewerComment}
            </div>
          )}

          <div className="space-y-8">
            <section>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(Number(e.target.value))}
                disabled={!editable}
                className="w-full max-w-xs border border-gray-300 rounded px-3 py-2 text-sm disabled:bg-gray-50"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </section>

            <section>
              <h2 className="text-sm font-medium text-gray-700 mb-2">Tasks completed</h2>
              <TaskTable tasks={tasks} onChange={setTasks} />
            </section>

            <section>
              <h2 className="text-sm font-medium text-gray-700 mb-2">Tasks planned for next week</h2>
              <textarea
                value={tasksPlannedNextWeek}
                onChange={(e) => setTasksPlannedNextWeek(e.target.value)}
                disabled={!editable}
                rows={3}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm disabled:bg-gray-50"
              />
            </section>

            <section>
              <h2 className="text-sm font-medium text-gray-700 mb-2">Blockers / challenges</h2>
              <FlaggableList
                items={blockers}
                flagKey="keyIssue"
                flagLabel="Key issue"
                placeholder="Describe the blocker"
                onChange={setBlockers}
              />
            </section>

            <section>
              <h2 className="text-sm font-medium text-gray-700 mb-2">Achievements / highlights</h2>
              <FlaggableList
                items={achievements}
                flagKey="keyAchievement"
                flagLabel="Key achievement"
                placeholder="Describe the achievement"
                onChange={setAchievements}
              />
            </section>

            <section>
              <h2 className="text-sm font-medium text-gray-700 mb-2">
                Hours by task type <span className="text-gray-400 font-normal">(optional)</span>
              </h2>
              <div className="space-y-2 max-w-md">
                {hours.map((h, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      value={h.taskType}
                      onChange={(e) => {
                        const next = [...hours];
                        next[i] = { ...next[i], taskType: e.target.value };
                        setHours(next);
                      }}
                      placeholder="e.g. Development"
                      className="flex-1 border border-gray-200 rounded px-2 py-1 text-sm"
                    />
                    <input
                      type="number" step="0.5"
                      value={h.hours}
                      onChange={(e) => {
                        const next = [...hours];
                        next[i] = { ...next[i], hours: Number(e.target.value) };
                        setHours(next);
                      }}
                      className="w-24 border border-gray-200 rounded px-2 py-1 text-sm"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setHours([...hours, { taskType: '', hours: 0 }])}
                  className="text-sm text-gray-600 hover:text-gray-900 underline"
                >
                  + Add
                </button>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-medium text-gray-700 mb-2">
                Notes or links <span className="text-gray-400 font-normal">(optional)</span>
              </h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={!editable}
                rows={2}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm disabled:bg-gray-50"
              />
            </section>
          </div>

          {message && <p className="text-sm text-gray-600 mt-6">{message}</p>}

          {editable && (
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveDraft}
                disabled={saving}
                className="border border-gray-300 rounded px-4 py-2 text-sm font-medium disabled:opacity-50"
              >
                Save draft
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="bg-gray-900 text-white rounded px-4 py-2 text-sm font-medium disabled:opacity-50"
              >
                {report?.status === 'NEEDS_CORRECTION' ? 'Resubmit' : 'Submit'}
              </button>
            </div>
          )}
        </div>
      </AppShell>
    </RouteGuard>
  );
}