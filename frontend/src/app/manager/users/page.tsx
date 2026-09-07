'use client';

import { useEffect, useState } from 'react';
import { RouteGuard } from '@/components/RouteGuard';
import { AppShell } from '@/components/AppShell';
import { Modal } from '@/components/Modal';
import {
  TeamMember, deactivateUser, getAllUsers, inviteUser, reactivateUser, updateUserRole,
} from '@/lib/userService';
import { toast } from 'sonner';
export default function UsersPage() {
  const [users, setUsers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('TEAM_MEMBER');
  const [error, setError] = useState('');

  function load() {
    getAllUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }

  useEffect(load, []);

  async function handleInvite() {
    setError('');
    if (!name || !email || !password) {
      toast.error('All fields are required.');
      setError('All fields are required.');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    try {
      await inviteUser(name, email, password, role);
      setInviting(false);
      setName(''); setEmail(''); setPassword(''); setRole('TEAM_MEMBER');
      toast.success('User invited successfully.');
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Could not invite this user.');
    }
  }

  async function handleRoleChange(userId: number, newRole: string) {
    await updateUserRole(userId, newRole);
    toast.success('User role updated successfully.');
    load();
  }

  async function handleToggleActive(user: TeamMember) {
  console.log('Toggle clicked for user:', user.id, 'currently active:', user.active);
  try {
    if (user.active) {
      await deactivateUser(user.id);
      toast.success('User deactivated successfully.');
    } else {
      await reactivateUser(user.id);
      toast.success('User reactivated successfully.');
    }
    load();
  } catch (err: any) {
    console.error('Toggle active failed:', err.response?.status, err.response?.data);
    toast.error(err.response?.data?.message ?? 'Could not update this user.');
  }
}
  return (
    <RouteGuard allowedRoles={['MANAGER']}>
      <AppShell>
        <div className="max-w-3xl mx-auto p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Users</h1>
              <p className="text-sm text-gray-500">Invite team members and manage roles.</p>
            </div>
            <button
              onClick={() => setInviting(true)}
              className="bg-gray-900 text-white rounded px-4 py-2 text-sm font-medium"
            >
              + Invite user
            </button>
          </div>

          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : (
            <div className="border border-gray-200 rounded divide-y divide-gray-100 bg-white">
              {users.map((u) => (
                <div key={u.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">
                      {u.name}
                      {!u.active && <span className="text-xs text-gray-400 ml-2">(deactivated)</span>}
                    </p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-xs"
                    >
                      <option value="TEAM_MEMBER">Team member</option>
                      <option value="MANAGER">Manager</option>
                    </select>
                    <button
                      onClick={() => handleToggleActive(u)}
                      className={`text-sm underline ${
                        u.active ? 'text-red-600 hover:text-red-800' : 'text-green-700 hover:text-green-900'
                      }`}
                    >
                      {u.active ? 'Deactivate' : 'Reactivate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {inviting && (
          <Modal title="Invite a user" onClose={() => setInviting(false)}>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Temporary password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                  <option value="TEAM_MEMBER">Team member</option>
                  <option value="MANAGER">Manager</option>
                </select>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setInviting(false)} className="border border-gray-300 rounded px-4 py-2 text-sm">Cancel</button>
                <button onClick={handleInvite} className="bg-gray-900 text-white rounded px-4 py-2 text-sm font-medium">Invite</button>
              </div>
            </div>
          </Modal>
        )}
      </AppShell>
    </RouteGuard>
  );
}