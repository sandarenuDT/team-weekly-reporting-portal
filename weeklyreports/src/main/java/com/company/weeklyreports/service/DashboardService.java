package com.company.weeklyreports.service;

import com.company.weeklyreports.dto.response.*;
import com.company.weeklyreports.entity.Report;
import com.company.weeklyreports.entity.ReportStatus;
import com.company.weeklyreports.entity.Role;
import com.company.weeklyreports.entity.User;
import com.company.weeklyreports.repository.HoursByTaskTypeRepository;
import com.company.weeklyreports.repository.ReportRepository;
import com.company.weeklyreports.repository.ReviewCommentRepository;
import com.company.weeklyreports.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ReportRepository reportRepository;
    private final HoursByTaskTypeRepository hoursByTaskTypeRepository;
    private final ReviewCommentRepository reviewCommentRepository;
    private final UserRepository userRepository;
    private static final Logger log =
            LoggerFactory.getLogger(DashboardService.class);
    @Transactional(readOnly = true)
    public DashboardMetricsResponse getMetrics(LocalDate weekStart) {
        long totalMembers = userRepository.count(); // includes managers; refine with a role filter if you separate them out
        long submitted = reportRepository.countByWeekStartAndStatus(weekStart, ReportStatus.SUBMITTED);
        long approved = reportRepository.countByWeekStartAndStatus(weekStart, ReportStatus.APPROVED);

        long needsCorrection = reportRepository.countByStatus(ReportStatus.NEEDS_CORRECTION);

        long reportsThisWeek = reportRepository.findByWeekStart(weekStart).size();
        long pending = Math.max(totalMembers - reportsThisWeek, 0); // "not yet started" = no row at all

        boolean weekHasEnded = LocalDate.now().isAfter(weekStart.plusDays(6));
        long late = weekHasEnded ? pending : 0;

        long openBlockers = countOpenBlockers();

        double complianceRate = totalMembers == 0
                ? 0.0
                : Math.round(((submitted + approved) * 1000.0 / totalMembers)) / 10.0;

        return DashboardMetricsResponse.builder()
                .totalMembers(totalMembers)
                .submittedThisWeek(submitted + approved)
                .pendingThisWeek(pending)
                .lateThisWeek(late)
                .needsCorrectionCount(needsCorrection)
                .openBlockersCount(openBlockers)
                .complianceRatePct(complianceRate)
                .build();
    }

    @Transactional(readOnly = true)
    public List<ChartSeriesResponse> getTasksCompletedTrend() {
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM d");
        return reportRepository.tasksCompletedTrend().stream()
                .map(row -> ChartSeriesResponse.builder()
                        .label(((LocalDate) row[0]).format(fmt))
                        .value(((Number) row[1]).doubleValue())
                        .build())
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ChartSeriesResponse> getWorkloadByProject() {
        return ChartSeriesResponse.of(reportRepository.countByProjectGrouped());
    }

    @Transactional(readOnly = true)
    public List<ChartSeriesResponse> getHoursByTaskType() {
        return ChartSeriesResponse.of(hoursByTaskTypeRepository.totalHoursByTaskType());
    }

    @Transactional(readOnly = true)
    public List<ChartSeriesResponse> getStatusByMember(LocalDate weekStart) {
        return reportRepository.statusByMemberForWeek(weekStart).stream()
                .map(row -> ChartSeriesResponse.builder()
                        .label((String) row[0])
                        .value(statusToOrdinal((ReportStatus) row[1]))
                        .build())
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ActivityItemResponse> getRecentActivity(int limit) {
        return reviewCommentRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(limit)
                .map(c -> ActivityItemResponse.builder()
                        .memberName(c.getReport().getUser().getName())
                        .reviewerName(c.getReviewer().getName())
                        .action(c.getAction())
                        .weekLabel(c.getReport().getWeekStart().toString())
                        .timestamp(c.getCreatedAt())
                        .build())
                .toList();
    }

    private long countOpenBlockers() {
        return reportRepository.findAll().stream()
                .filter(r -> r.getStatus() != ReportStatus.APPROVED)
                .filter(r -> r.getCurrentVersion() != null)
                .mapToLong(r -> r.getCurrentVersion().getBlockers().size())
                .sum();
    }

    private double statusToOrdinal(ReportStatus status) {
        return switch (status) {
            case DRAFT -> 0;
            case SUBMITTED -> 1;
            case NEEDS_CORRECTION -> 2;
            case APPROVED -> 3;
        };
    }
    @Transactional(readOnly = true)
    public List<TeamMemberStatusResponse> getTeamStatus(LocalDate weekStart) {
        List<User> teamMembers = userRepository.findByRole(Role.TEAM_MEMBER).stream()
                .filter(User::isActive)
                .toList();

        Map<Long, Report> reportsByUserId = reportRepository.findByWeekStart(weekStart).stream()
                .collect(java.util.stream.Collectors.toMap(r -> r.getUser().getId(), r -> r));

        return teamMembers.stream()
                .map(member -> {
                    Report report = reportsByUserId.get(member.getId());
                    return TeamMemberStatusResponse.builder()
                            .userId(member.getId())
                            .userName(member.getName())
                            .reportId(report != null ? report.getId() : null)
                            .status(report != null ? report.getStatus().name() : "NOT_STARTED")
                            .build();
                })
                .toList();
    }
    private TeamMemberStatusResponse toStatus(User member, Report report) {
        boolean draftHidden = report != null && report.getStatus() == ReportStatus.DRAFT;
        return TeamMemberStatusResponse.builder()
                .userId(member.getId())
                .userName(member.getName())
                .reportId(draftHidden ? null : (report != null ? report.getId() : null))
                .status(draftHidden || report == null ? "NOT_STARTED" : report.getStatus().name())
                .build();
    }

}