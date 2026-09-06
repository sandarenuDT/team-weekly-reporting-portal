'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface NavItem {
  href: string;
  label: string;
}

const MEMBER_NAV: NavItem[] = [
  { href: '/member/my-report', label: 'My report' },
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
    <div className="min-h-screen flex">
      <aside className="w-56 border-r border-gray-200 bg-white flex flex-col">
        <div className="px-4 py-5 text-base font-semibold border-b border-gray-100">
          Weekly reports
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded text-sm font-medium ${
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-4 border-t border-gray-100">
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="text-xs text-gray-500 mb-3">{user?.role === 'MANAGER' ? 'Manager' : 'Team member'}</p>
          <button
            onClick={logout}
            className="text-xs text-gray-500 hover:text-gray-900 underline"
          >
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}