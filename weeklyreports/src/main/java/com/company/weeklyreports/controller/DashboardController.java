package com.company.weeklyreports.controller;

import com.company.weeklyreports.dto.response.*;
import com.company.weeklyreports.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('MANAGER')") // the whole dashboard is manager-only
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/metrics")
    public ResponseEntity<DashboardMetricsResponse> metrics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStart) {
        return ResponseEntity.ok(dashboardService.getMetrics(weekStart));
    }

    @GetMapping("/charts/tasks-trend")
    public ResponseEntity<List<ChartSeriesResponse>> tasksTrend() {
        return ResponseEntity.ok(dashboardService.getTasksCompletedTrend());
    }

    @GetMapping("/charts/workload-by-project")
    public ResponseEntity<List<ChartSeriesResponse>> workloadByProject() {
        return ResponseEntity.ok(dashboardService.getWorkloadByProject());
    }

    @GetMapping("/charts/hours-by-task-type")
    public ResponseEntity<List<ChartSeriesResponse>> hoursByTaskType() {
        return ResponseEntity.ok(dashboardService.getHoursByTaskType());
    }

    @GetMapping("/charts/status-by-member")
    public ResponseEntity<List<ChartSeriesResponse>> statusByMember(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStart) {
        return ResponseEntity.ok(dashboardService.getStatusByMember(weekStart));
    }

    @GetMapping("/activity")
    public ResponseEntity<List<ActivityItemResponse>> recentActivity(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(dashboardService.getRecentActivity(limit));
    }
    @GetMapping("/team-status")
    public ResponseEntity<List<TeamMemberStatusResponse>> teamStatus(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStart) {
        return ResponseEntity.ok(dashboardService.getTeamStatus(weekStart));
    }
}