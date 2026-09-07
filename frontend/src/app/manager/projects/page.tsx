'use client';

import { useEffect, useState } from 'react';
import { RouteGuard } from '@/components/RouteGuard';
import { AppShell } from '@/components/AppShell';
import { Modal } from '@/components/Modal';
import { createProject, deleteProject, getProjects, updateProject } from '@/lib/projectService';
import { Project } from '@/types';
import { toast } from 'sonner';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | 'new' | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  function load() {
    getProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }

  useEffect(load, []);

  function openNew() {
    setEditing('new');
    setName('');
    setDescription('');
    setError('');
  }

  function openEdit(project: Project) {
    setEditing(project);
    setName(project.name);
    setDescription(project.description ?? '');
    setError('');
  }

  async function handleSave() {
    if (!name.trim()) {
      toast.error('Project name is required.');
      setError('Project name is required.');
      return;
    }
    try {
      if (editing === 'new') {
        await createProject(name, description);
        toast.success('Project created successfully.');
      } else if (editing) {
        await updateProject(editing.id, name, description);
        toast.success('Project updated successfully.');
      }
      setEditing(null);
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Could not save the project.');
      setError(err.response?.data?.message ?? 'Could not save the project.');
    }
  }

  async function handleDelete(project: Project) {
    if (!confirm(`Deactivate "${project.name}"? Existing reports will keep their history.`)) return;
    await deleteProject(project.id);
    toast.success('Project deactivated successfully.');
    load();
  }

  return (
    <RouteGuard allowedRoles={['MANAGER']}>
      <AppShell>
        <div className="max-w-3xl mx-auto p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Projects</h1>
              <p className="text-sm text-gray-500">Manage projects and categories used across reports.</p>
            </div>
            <button
              onClick={openNew}
              className="bg-gray-900 text-white rounded px-4 py-2 text-sm font-medium"
            >
              + Add project
            </button>
          </div>

          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : (
            <div className="border border-gray-200 rounded divide-y divide-gray-100 bg-white">
              {projects.map((p) => (
                <div key={p.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    {p.description && <p className="text-xs text-gray-500">{p.description}</p>}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => openEdit(p)}
                      className="text-sm text-gray-600 hover:text-gray-900 underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p)}
                      className="text-sm text-red-600 hover:text-red-800 underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <p className="text-sm text-gray-400 px-4 py-6">No projects yet.</p>
              )}
            </div>
          )}
        </div>

        {editing && (
          <Modal title={editing === 'new' ? 'Add project' : 'Edit project'} onClose={() => setEditing(null)}>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setEditing(null)}
                  className="border border-gray-300 rounded px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-gray-900 text-white rounded px-4 py-2 text-sm font-medium"
                >
                  Save
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AppShell>
    </RouteGuard>
  );
}