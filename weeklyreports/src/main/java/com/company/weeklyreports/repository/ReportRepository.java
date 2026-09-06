package com.company.weeklyreports.repository;

import com.company.weeklyreports.entity.Report;
import com.company.weeklyreports.entity.ReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ReportRepository extends JpaRepository<Report, Long>,
        JpaSpecificationExecutor<Report> {

    Optional<Report> findByUserIdAndWeekStart(Long userId, LocalDate weekStart);

    List<Report> findByUserIdOrderByWeekStartDesc(Long userId);

    long countByWeekStartAndStatus(LocalDate weekStart, ReportStatus status);

    List<Report> findByWeekStart(LocalDate weekStart);

    long countByStatus(ReportStatus status);

    // Workload by project, week-independent (team-wide totals)
    @Query("SELECT r.project.name, COUNT(r) FROM Report r GROUP BY r.project.name")
    List<Object[]> countByProjectGrouped();

    // Tasks-completed trend: number of DONE tasks per week, across all versions
    @Query("""
        SELECT r.weekStart, COUNT(t)
        FROM Report r JOIN r.currentVersion v JOIN v.tasks t
        WHERE t.status = com.company.weeklyreports.entity.TaskStatus.DONE
        GROUP BY r.weekStart
        ORDER BY r.weekStart
        """)
    List<Object[]> tasksCompletedTrend();

    // Status by team member, for the current week
    @Query("""
        SELECT u.name, r.status
        FROM Report r JOIN r.user u
        WHERE r.weekStart = :weekStart
        """)
    List<Object[]> statusByMemberForWeek(@Param("weekStart") LocalDate weekStart);
}