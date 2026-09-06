'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login');
    } else {
      router.push(user.role === 'MANAGER' ? '/manager/dashboard' : '/member/my-report');
    }
  }, [user, loading, router]);

  return null;
}