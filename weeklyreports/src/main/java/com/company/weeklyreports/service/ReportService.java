package com.company.weeklyreports.service;

import com.company.weeklyreports.dto.request.*;
import com.company.weeklyreports.dto.response.*;
import com.company.weeklyreports.entity.*;
import com.company.weeklyreports.exception.AccessDeniedCustomException;
import com.company.weeklyreports.exception.ResourceNotFoundException;
import com.company.weeklyreports.repository.*;
import com.company.weeklyreports.repository.spec.ReportSpecifications;
import com.company.weeklyreports.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final ReportVersionRepository reportVersionRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ReviewCommentRepository reviewCommentRepository;


    @Transactional
    public ReportResponse createDraft(CustomUserDetails currentUser, ReportContentRequest request) {
        User user = userRepository.findById(currentUser.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        reportRepository.findByUserIdAndWeekStart(user.getId(), request.getWeekStart())
                .ifPresent(r -> {
                    throw new IllegalStateException("A report for this week already exists.");
                });

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        Report report = Report.builder()
                .user(user)
                .project(project)
                .weekStart(request.getWeekStart())
                .weekEnd(request.getWeekStart().plusDays(6))
                .status(ReportStatus.DRAFT)
                .build();
        report = reportRepository.save(report);

        ReportVersion version = ReportVersion.builder()
                .report(report)
                .versionNumber(1)
                .build();
        applyContent(version, request);
        version = reportVersionRepository.save(version);

        report.setCurrentVersion(version);
        report = reportRepository.save(report);

        return toResponse(report, version);
    }


    @Transactional
    public ReportResponse updateDraft(CustomUserDetails currentUser, Long reportId, ReportContentRequest request) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found: " + reportId));

        assertOwner(currentUser, report);

        if (report.getStatus() != ReportStatus.DRAFT && report.getStatus() != ReportStatus.NEEDS_CORRECTION) {
            throw new IllegalStateException("A report can only be edited while it is a draft or needs correction.");
        }

        if (request.getProjectId() != null
                && !request.getProjectId().equals(report.getProject().getId())) {
            Project project = projectRepository.findById(request.getProjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
            report.setProject(project);
        }

        ReportVersion current = report.getCurrentVersion();
        ReportVersion versionToEdit;

        if (current == null || current.getSubmittedAt() == null) {
            // unsubmitted draft
            versionToEdit = current != null ? current : ReportVersion.builder()
                    .report(report)
                    .versionNumber(1)
                    .build();
        } else {
            // Previously submitted and reviewed
            int nextVersionNumber = current.getVersionNumber() + 1;
            versionToEdit = ReportVersion.builder()
                    .report(report)
                    .versionNumber(nextVersionNumber)
                    .build();
        }

        applyContent(versionToEdit, request);
        versionToEdit = reportVersionRepository.save(versionToEdit);

        report.setCurrentVersion(versionToEdit);
        report = reportRepository.save(report);

        return toResponse(report, versionToEdit);
    }


    // SUBMIT
    @Transactional
    public ReportResponse submit(CustomUserDetails currentUser, Long reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found: " + reportId));

        assertOwner(currentUser, report);

        if (report.getStatus() != ReportStatus.DRAFT && report.getStatus() != ReportStatus.NEEDS_CORRECTION) {
            throw new IllegalStateException("Only a draft or a report needing correction can be submitted.");
        }

        ReportVersion current = report.getCurrentVersion();
        if (current == null) {
            throw new IllegalStateException("Cannot submit a report with no content.");
        }

        current.setSubmittedAt(java.time.LocalDateTime.now());
        reportVersionRepository.save(current);

        report.setStatus(ReportStatus.SUBMITTED);
        report = reportRepository.save(report);

        return toResponse(report, current);
    }


    @Transactional(readOnly = true)
    public ReportResponse findById(CustomUserDetails currentUser, Long reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found: " + reportId));

        boolean isOwner = report.getUser().getId().equals(currentUser.getUserId());
        boolean isManager = currentUser.getUser().getRole() == Role.MANAGER;

        if (!isOwner && !isManager) {
            throw new AccessDeniedCustomException("You do not have access to this report.");
        }

        return toResponse(report, report.getCurrentVersion());
    }

    @Transactional(readOnly = true)
    public List<ReportVersionResponse> findVersionHistory(CustomUserDetails currentUser, Long reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found: " + reportId));

        boolean isOwner = report.getUser().getId().equals(currentUser.getUserId());
        boolean isManager = currentUser.getUser().getRole() == Role.MANAGER;
        if (!isOwner && !isManager) {
            throw new AccessDeniedCustomException("You do not have access to this report.");
        }

        return reportVersionRepository.findByReportIdOrderByVersionNumberDesc(reportId).stream()
                .map(this::toVersionResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ReportSummaryResponse> findMyReports(CustomUserDetails currentUser) {
        return reportRepository.findByUserIdOrderByWeekStartDesc(currentUser.getUserId()).stream()
                .map(this::toSummaryResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<ReportSummaryResponse> findAllFiltered(
            Long userId, Long projectId, ReportStatus status,
            LocalDate weekFrom, LocalDate weekTo, Pageable pageable) {

        Specification<Report> spec = Specification
                .where(ReportSpecifications.hasUserId(userId))
                .and(ReportSpecifications.hasProjectId(projectId))
                .and(ReportSpecifications.hasStatus(status))
                .and(ReportSpecifications.weekStartFrom(weekFrom))
                .and(ReportSpecifications.weekStartTo(weekTo));

        return reportRepository.findAll(spec, pageable).map(this::toSummaryResponse);
    }

    private void assertOwner(CustomUserDetails currentUser, Report report) {
        if (!report.getUser().getId().equals(currentUser.getUserId())) {
            throw new AccessDeniedCustomException("You can only modify your own reports.");
        }
    }

    private void applyContent(ReportVersion version, ReportContentRequest request) {
        version.setTasksPlannedNextWeek(request.getTasksPlannedNextWeek());
        version.setNotes(request.getNotes());

        version.getTasks().clear();
        if (request.getTasks() != null) {
            request.getTasks().forEach(t -> version.getTasks().add(Task.builder()
                    .reportVersion(version)
                    .name(t.getName())
                    .priority(t.getPriority() != null ? t.getPriority() : TaskPriority.MEDIUM)
                    .plannedPct(t.getPlannedPct())
                    .actualPct(t.getActualPct())
                    .status(t.getStatus() != null ? t.getStatus() : TaskStatus.NOT_STARTED)
                    .timePlannedHours(t.getTimePlannedHours())
                    .timeSpentHours(t.getTimeSpentHours())
                    .deliverable(t.getDeliverable())
                    .build()));
        }

        version.getBlockers().clear();
        if (request.getBlockers() != null) {
            request.getBlockers().forEach(b -> version.getBlockers().add(Blocker.builder()
                    .reportVersion(version)
                    .description(b.getDescription())
                    .isKeyIssue(b.isKeyIssue())
                    .build()));
        }

        version.getAchievements().clear();
        if (request.getAchievements() != null) {
            request.getAchievements().forEach(a -> version.getAchievements().add(Achievement.builder()
                    .reportVersion(version)
                    .description(a.getDescription())
                    .isKeyAchievement(a.isKeyAchievement())
                    .build()));
        }

        version.getHoursByTaskType().clear();
        if (request.getHoursByTaskType() != null) {
            request.getHoursByTaskType().forEach(h -> version.getHoursByTaskType().add(HoursByTaskType.builder()
                    .reportVersion(version)
                    .taskType(h.getTaskType())
                    .hours(h.getHours())
                    .build()));
        }
    }

    private ReportResponse toResponse(Report report, ReportVersion version) {
        String latestComment = reviewCommentRepository
                .findByReportIdOrderByCreatedAtDesc(report.getId())
                .stream()
                .findFirst()
                .map(ReviewComment::getComment)
                .orElse(null);

        return ReportResponse.builder()
                .id(report.getId())
                .userId(report.getUser().getId())
                .userName(report.getUser().getName())
                .projectId(report.getProject().getId())
                .projectName(report.getProject().getName())
                .weekStart(report.getWeekStart())
                .weekEnd(report.getWeekEnd())
                .status(report.getStatus())
                .latestReviewerComment(latestComment)
                .currentVersion(version != null ? toVersionResponse(version) : null)
                .build();
    }

    private ReportSummaryResponse toSummaryResponse(Report report) {
        return ReportSummaryResponse.builder()
                .id(report.getId())
                .userId(report.getUser().getId())
                .userName(report.getUser().getName())
                .projectName(report.getProject().getName())
                .weekStart(report.getWeekStart())
                .weekEnd(report.getWeekEnd())
                .status(report.getStatus())
                .build();
    }

    private ReportVersionResponse toVersionResponse(ReportVersion version) {
        return ReportVersionResponse.builder()
                .id(version.getId())
                .versionNumber(version.getVersionNumber())
                .submittedAt(version.getSubmittedAt())
                .tasksPlannedNextWeek(version.getTasksPlannedNextWeek())
                .notes(version.getNotes())
                .tasks(version.getTasks().stream().map(t -> TaskResponse.builder()
                        .id(t.getId()).name(t.getName()).priority(t.getPriority())
                        .plannedPct(t.getPlannedPct()).actualPct(t.getActualPct())
                        .status(t.getStatus()).timePlannedHours(t.getTimePlannedHours())
                        .timeSpentHours(t.getTimeSpentHours()).deliverable(t.getDeliverable())
                        .build()).toList())
                .blockers(version.getBlockers().stream().map(b -> BlockerResponse.builder()
                        .id(b.getId()).description(b.getDescription()).keyIssue(b.isKeyIssue())
                        .build()).toList())
                .achievements(version.getAchievements().stream().map(a -> AchievementResponse.builder()
                        .id(a.getId()).description(a.getDescription()).keyAchievement(a.isKeyAchievement())
                        .build()).toList())
                .hoursByTaskType(version.getHoursByTaskType().stream().map(h -> HoursByTaskTypeResponse.builder()
                        .id(h.getId()).taskType(h.getTaskType()).hours(h.getHours())
                        .build()).toList())
                .build();
    }
}