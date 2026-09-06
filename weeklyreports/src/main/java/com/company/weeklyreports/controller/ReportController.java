package com.company.weeklyreports.controller;

import com.company.weeklyreports.dto.request.ReportContentRequest;
import com.company.weeklyreports.dto.response.ReportResponse;
import com.company.weeklyreports.dto.response.ReportSummaryResponse;
import com.company.weeklyreports.dto.response.ReportVersionResponse;
import com.company.weeklyreports.entity.ReportStatus;
import com.company.weeklyreports.security.CustomUserDetails;
import com.company.weeklyreports.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;
    @PreAuthorize("hasRole('TEAM_MEMBER')")
    @PostMapping
    public ResponseEntity<ReportResponse> create(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @Valid @RequestBody ReportContentRequest request) {
        return ResponseEntity.ok(reportService.createDraft(currentUser, request));
    }

    @PreAuthorize("hasRole('TEAM_MEMBER')")
    @PutMapping("/{id}")
    public ResponseEntity<ReportResponse> update(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable Long id,
            @Valid @RequestBody ReportContentRequest request) {
        return ResponseEntity.ok(reportService.updateDraft(currentUser, id, request));
    }

    @PreAuthorize("hasRole('TEAM_MEMBER')")
    @PostMapping("/{id}/submit")
    public ResponseEntity<ReportResponse> submit(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable Long id) {
        return ResponseEntity.ok(reportService.submit(currentUser, id));
    }

    // member's own history page
    @GetMapping("/mine")
    public ResponseEntity<List<ReportSummaryResponse>> findMine(
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        return ResponseEntity.ok(reportService.findMyReports(currentUser));
    }

    // Report detail
    @GetMapping("/{id}")
    public ResponseEntity<ReportResponse> findById(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable Long id) {
        return ResponseEntity.ok(reportService.findById(currentUser, id));
    }

    // Version history
    @GetMapping("/{id}/versions")
    public ResponseEntity<List<ReportVersionResponse>> findVersions(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable Long id) {
        return ResponseEntity.ok(reportService.findVersionHistory(currentUser, id));
    }

    // Manager dashboard
    @GetMapping
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Page<ReportSummaryResponse>> findAll(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) ReportStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekTo,
            Pageable pageable) {
        return ResponseEntity.ok(
                reportService.findAllFiltered(userId, projectId, status, weekFrom, weekTo, pageable));
    }
}