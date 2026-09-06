'use client';

import { Task } from '@/types';

interface Props {
  tasks: Task[];
  onChange: (tasks: Task[]) => void;
}

const EMPTY_TASK: Task = {
  name: '',
  priority: 'MEDIUM',
  status: 'NOT_STARTED',
};

export function TaskTable({ tasks, onChange }: Props) {
  function updateTask(index: number, field: keyof Task, value: any) {
    const next = [...tasks];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  }

  function removeTask(index: number) {
    onChange(tasks.filter((_, i) => i !== index));
  }

  function addTask() {
    onChange([...tasks, { ...EMPTY_TASK }]);
  }

  return (
    <div>
      <div className="overflow-x-auto border border-gray-200 rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-3 py-2 font-medium">Task</th>
              <th className="px-3 py-2 font-medium w-28">Priority</th>
              <th className="px-3 py-2 font-medium w-24">Planned %</th>
              <th className="px-3 py-2 font-medium w-24">Actual %</th>
              <th className="px-3 py-2 font-medium w-32">Status</th>
              <th className="px-3 py-2 font-medium w-24">Planned hrs</th>
              <th className="px-3 py-2 font-medium w-24">Spent hrs</th>
              <th className="px-3 py-2 font-medium">Deliverable</th>
              <th className="px-2 py-2 w-8" />
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, i) => (
              <tr key={i} className="border-t border-gray-100">
                <td className="px-3 py-2">
                  <input
                    value={task.name}
                    onChange={(e) => updateTask(i, 'name', e.target.value)}
                    className="w-full border border-gray-200 rounded px-2 py-1"
                    placeholder="Task name"
                  />
                </td>
                <td className="px-3 py-2">
                  <select
                    value={task.priority}
                    onChange={(e) => updateTask(i, 'priority', e.target.value)}
                    className="w-full border border-gray-200 rounded px-2 py-1"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number" min={0} max={100}
                    value={task.plannedPct ?? ''}
                    onChange={(e) => updateTask(i, 'plannedPct', Number(e.target.value))}
                    className="w-full border border-gray-200 rounded px-2 py-1"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number" min={0} max={100}
                    value={task.actualPct ?? ''}
                    onChange={(e) => updateTask(i, 'actualPct', Number(e.target.value))}
                    className="w-full border border-gray-200 rounded px-2 py-1"
                  />
                </td>
                <td className="px-3 py-2">
                  <select
                    value={task.status}
                    onChange={(e) => updateTask(i, 'status', e.target.value)}
                    className="w-full border border-gray-200 rounded px-2 py-1"
                  >
                    <option value="NOT_STARTED">Not started</option>
                    <option value="IN_PROGRESS">In progress</option>
                    <option value="DONE">Done</option>
                    <option value="BLOCKED">Blocked</option>
                  </select>
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number" step="0.5"
                    value={task.timePlannedHours ?? ''}
                    onChange={(e) => updateTask(i, 'timePlannedHours', Number(e.target.value))}
                    className="w-full border border-gray-200 rounded px-2 py-1"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number" step="0.5"
                    value={task.timeSpentHours ?? ''}
                    onChange={(e) => updateTask(i, 'timeSpentHours', Number(e.target.value))}
                    className="w-full border border-gray-200 rounded px-2 py-1"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    value={task.deliverable ?? ''}
                    onChange={(e) => updateTask(i, 'deliverable', e.target.value)}
                    className="w-full border border-gray-200 rounded px-2 py-1"
                    placeholder="PR link, doc, etc."
                  />
                </td>
                <td className="px-2 py-2 text-center">
                  <button
                    type="button"
                    onClick={() => removeTask(i)}
                    className="text-gray-400 hover:text-red-600 text-sm"
                    aria-label="Remove task"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={addTask}
        className="mt-2 text-sm text-gray-600 hover:text-gray-900 underline"
      >
        + Add task
      </button>
    </div>
  );
}