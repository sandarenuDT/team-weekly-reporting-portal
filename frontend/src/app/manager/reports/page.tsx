'use client';

import { useEffect, useState } from 'react';
import { RouteGuard } from '@/components/RouteGuard';
import { AppShell } from '@/components/AppShell';
import { ReportTable } from '@/components/reports/ReportTable';
import { ReportFiltersBar, FilterState } from '@/components/reports/ReportFiltersBar';
import { Pagination } from '@/components/Pagination';
import { getFilteredReports, PagedReports } from '@/lib/reportService';
import { getProjects } from '@/lib/projectService';
import { getTeamMembers, TeamMember } from '@/lib/userService';
import { Project } from '@/types';

const EMPTY_FILTERS: FilterState = {
  userId: '', projectId: '', status: '', weekFrom: '', weekTo: '',
};

export default function ManagerReportsPage() {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [page, setPage] = useState(0);
  const [data, setData] = useState<PagedReports | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTeamMembers(), getProjects()]).then(([m, p]) => {
      setMembers(m);
      setProjects(p);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    getFilteredReports({
      userId: filters.userId ? Number(filters.userId) : undefined,
      projectId: filters.projectId ? Number(filters.projectId) : undefined,
      status: filters.status || undefined,
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
    setPage(0); // reset to first page whenever filters change
  }

  return (
    <RouteGuard allowedRoles={['MANAGER']}>
      <AppShell>
        <div className="max-w-5xl mx-auto p-8 space-y-6">
          <div>
            <h1 className="text-xl font-semibold">Reports</h1>
            <p className="text-sm text-gray-500">Filter and review reports across the team.</p>
          </div>

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
        </div>
      </AppShell>
    </RouteGuard>
  );
}