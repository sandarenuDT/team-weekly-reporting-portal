package com.company.weeklyreports.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class DashboardMetricsResponse {
    private long totalMembers;
    private long submittedThisWeek;
    private long pendingThisWeek;
    private long lateThisWeek;
    private long needsCorrectionCount;
    private long openBlockersCount;
    private double complianceRatePct;
}