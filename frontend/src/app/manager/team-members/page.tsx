'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RouteGuard } from '@/components/RouteGuard';
import { AppShell } from '@/components/AppShell';
import { getTeamMembers, TeamMember } from '@/lib/userService';

export default function TeamMembersPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getTeamMembers().then((data) => {
      setMembers(data);
      setLoading(false);
    });
  }, []);

  return (
    <RouteGuard allowedRoles={['MANAGER']}>
      <AppShell>
        <div className="max-w-3xl mx-auto p-8 space-y-6">
          <div>
            <h1 className="text-xl font-semibold">Team members</h1>
            <p className="text-sm text-gray-500">Click a member to see their full report history.</p>
          </div>

          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : (
            <div className="border border-gray-200 rounded divide-y divide-gray-100 bg-white">
              {members.map((m) => (
                <button
                  key={m.id}
                  onClick={() => router.push(`/manager/team-members/${m.id}`)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
                >
                  <div>
                    <p className="text-sm font-medium">{m.name}</p>
                    <p className="text-xs text-gray-500">{m.email}</p>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </AppShell>
    </RouteGuard>
  );
}