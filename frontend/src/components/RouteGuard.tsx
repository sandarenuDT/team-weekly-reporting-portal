'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/types';

interface Props {
  allowedRoles?: Role[];
  children: React.ReactNode;
}

// Wraps any page that requires auth. If allowedRoles is omitted, any
// authenticated user (either role) may view it.
export function RouteGuard({ allowedRoles, children }: Props) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.push(user.role === 'MANAGER' ? '/manager/dashboard' : '/member/my-report');
    }
  }, [user, loading, allowedRoles, router]);

  if (loading || !user) return <div className="p-8 text-gray-500">Loading...</div>;
  if (allowedRoles && !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}