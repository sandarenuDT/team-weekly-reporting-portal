package com.company.weeklyreports.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class UserStatsResponse {
    private long totalReports;
    private long approvedCount;
    private long needsCorrectionCount;
    private double avgPlannedVsActualPct; // average |planned - actual|
    private long totalBlockersRaised;
}