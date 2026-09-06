package com.company.weeklyreports.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class ReportVersionResponse {
    private Long id;
    private Integer versionNumber;
    private LocalDateTime submittedAt;
    private String tasksPlannedNextWeek;
    private String notes;
    private List<TaskResponse> tasks;
    private List<BlockerResponse> blockers;
    private List<AchievementResponse> achievements;
    private List<HoursByTaskTypeResponse> hoursByTaskType;
}