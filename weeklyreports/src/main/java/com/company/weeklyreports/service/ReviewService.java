package com.company.weeklyreports.service;

import com.company.weeklyreports.dto.request.ReviewActionRequest;
import com.company.weeklyreports.dto.response.ReportResponse;
import com.company.weeklyreports.dto.response.ReviewCommentResponse;
import com.company.weeklyreports.entity.*;
import com.company.weeklyreports.exception.ResourceNotFoundException;
import com.company.weeklyreports.repository.ReportRepository;
import com.company.weeklyreports.repository.ReviewCommentRepository;
import com.company.weeklyreports.repository.UserRepository;
import com.company.weeklyreports.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReportRepository reportRepository;
    private final ReviewCommentRepository reviewCommentRepository;
    private final UserRepository userRepository;
    private final ReportService reportService; // reuse toResponse-style mapping via findById


    @Transactional
    public ReportResponse review(CustomUserDetails manager, Long reportId, ReviewActionRequest request) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found: " + reportId));

        if (report.getStatus() != ReportStatus.SUBMITTED) {
            throw new IllegalStateException("Only a submitted report can be reviewed.");
        }

        ReportVersion versionUnderReview = report.getCurrentVersion();
        if (versionUnderReview == null) {
            throw new IllegalStateException("This report has no submitted content to review.");
        }

        User reviewer = userRepository.findById(manager.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Reviewer not found"));

        if (request.getAction() == ReviewAction.REQUESTED_CHANGES
                && (request.getComment() == null || request.getComment().isBlank())) {
            throw new IllegalStateException("A comment is required when requesting changes.");
        }

        ReviewComment comment = ReviewComment.builder()
                .report(report)
                .reportVersion(versionUnderReview)
                .reviewer(reviewer)
                .action(request.getAction())
                .comment(request.getComment())
                .build();
        reviewCommentRepository.save(comment);

        report.setStatus(request.getAction() == ReviewAction.APPROVED
                ? ReportStatus.APPROVED
                : ReportStatus.NEEDS_CORRECTION);
        reportRepository.save(report);

        return reportService.findById(manager, reportId);
    }

    @Transactional(readOnly = true)
    public List<ReviewCommentResponse> findCommentHistory(CustomUserDetails currentUser, Long reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found: " + reportId));

        boolean isOwner = report.getUser().getId().equals(currentUser.getUserId());
        boolean isManager = currentUser.getUser().getRole() == Role.MANAGER;
        if (!isOwner && !isManager) {
            throw new com.company.weeklyreports.exception.AccessDeniedCustomException(
                    "You do not have access to this report.");
        }

        return reviewCommentRepository.findByReportIdOrderByCreatedAtDesc(reportId).stream()
                .map(c -> ReviewCommentResponse.builder()
                        .id(c.getId())
                        .action(c.getAction())
                        .comment(c.getComment())
                        .reviewerName(c.getReviewer().getName())
                        .reviewedVersionNumber(c.getReportVersion().getVersionNumber())
                        .createdAt(c.getCreatedAt())
                        .build())
                .toList();
    }
}