'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { CalendarCheck } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
}

const MEMBER_NAV: NavItem[] = [
  { href: '/member/dashboard', label: 'Dashboard' },
  { href: '/member/my-report', label: 'Create Report' },
  // { href: '/member/team-reports', label: 'Create Report' },
  { href: '/member/history', label: 'History' },
];

const MANAGER_NAV: NavItem[] = [
  { href: '/manager/dashboard', label: 'Dashboard' },
  { href: '/manager/team-members', label: 'Team members' },
  { href: '/manager/reports', label: 'Reports' },
  { href: '/manager/projects', label: 'Projects' },
  { href: '/manager/users', label: 'Users' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navItems = user?.role === 'MANAGER' ? MANAGER_NAV : MEMBER_NAV;

  return (
    <div className="min-h-screen flex bg-brand-bg">
      <aside className="w-56 border-r border-gray-200 bg-brand-navy flex flex-col">
         <div className="flex items-center gap-2.5 px-5 py-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <CalendarCheck className="h-4.5 w-4.5 text-white" strokeWidth={2.25} />
          </span>
          <p className="text-[15px] font-semibold text-white">Weekly Report</p>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-0.5">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
               <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition ${
                  active
                    ? 'bg-brand-600/10 text-brand-bg'
                    : 'text-brand-bg hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
         <div className="px-5 py-4 border-t border-gray-100">
          <p className="text-sm font-medium text-white">{user?.name}</p>
          <p className="text-xs text-brand-bg mb-3">{user?.role === 'MANAGER' ? 'Manager' : 'Team member'}</p>
          <button onClick={logout} className="text-xs text-white hover:text-brand-700 font-medium">
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}