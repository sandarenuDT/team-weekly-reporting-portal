'use client';

import { useEffect, useState } from 'react';
import { RouteGuard } from '@/components/RouteGuard';
import { AppShell } from '@/components/AppShell';
import { ReportTable } from '@/components/reports/ReportTable';
import { ReportFiltersBar, FilterState } from '@/components/reports/ReportFiltersBar';
import { TeamStatusGrid } from '@/components/dashboard/TeamStatusGrid';
import { Pagination } from '@/components/Pagination';
import { getFilteredReports, PagedReports } from '@/lib/reportService';
import { getProjects } from '@/lib/projectService';
import { getTeamMembers, TeamMember } from '@/lib/userService';
import { getTeamStatus, TeamMemberStatus } from '@/lib/dashboardService';
import { Project } from '@/types';

const EMPTY_FILTERS: FilterState = {
  userId: '', projectId: '', status: '', weekFrom: '', weekTo: '',
};

function mondayOfCurrentWeek(): string {
  const today = new Date();
  const day = today.getDay() === 0 ? 7 : today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - day + 1);
  return monday.toISOString().split('T')[0];
}

export default function ManagerReportsPage() {
  const weekStart = mondayOfCurrentWeek();
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [page, setPage] = useState(0);
  const [data, setData] = useState<PagedReports | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamStatus, setTeamStatus] = useState<TeamMemberStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTeamMembers(), getProjects(), getTeamStatus(weekStart)]).then(
      ([m, p, ts]) => {
        setMembers(m);
        setProjects(p);
        setTeamStatus(ts);
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLoading(true);
    getFilteredReports({
      userId: filters.userId ? Number(filters.userId) : undefined,
      projectId: filters.projectId ? Number(filters.projectId) : undefined,
      status: filters.status && filters.status !== 'NOT_STARTED' ? filters.status : undefined,
      weekFrom: filters.weekFrom || undefined,
      weekTo: filters.weekTo || undefined,
      page,
    }).then((result) => {
      setData(result);
      setLoading(false);
    });
  }, [filters, page]);

  function handleFilterChange(next: FilterState) {
    setFilters(next);
    setPage(0);
  }

  return (
    <RouteGuard allowedRoles={['MANAGER']}>
      <AppShell>
        <div className="max-w-5xl mx-auto p-8 space-y-8">
          <div>
            <h1 className="text-xl font-semibold">Reports</h1>
            <p className="text-sm text-gray-500">Filter and review reports across the team.</p>
          </div>

          <section>
            <h2 className="text-sm font-medium text-gray-700 mb-3">
              This week&apos;s status — week of {weekStart}
            </h2>
            <TeamStatusGrid members={teamStatus} statusFilter={filters.status} />
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-medium text-gray-700">All reports</h2>
            <ReportFiltersBar
              filters={filters}
              onChange={handleFilterChange}
              members={members}
              projects={projects}
            />
            {loading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : (
              <>
                <ReportTable reports={data?.content ?? []} showMember detailBasePath="/manager/reports" />
                {data && (
                  <Pagination page={data.number} totalPages={data.totalPages} onChange={setPage} />
                )}
              </>
            )}
          </section>
        </div>
      </AppShell>
    </RouteGuard>
  );
}