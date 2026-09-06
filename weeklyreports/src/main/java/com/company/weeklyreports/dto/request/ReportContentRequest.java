package com.company.weeklyreports.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class ReportContentRequest {

    @NotNull
    private Long projectId;

    @NotNull
    private LocalDate weekStart;
    @Valid
    private List<TaskRequest> tasks;

    private String tasksPlannedNextWeek;

    @Valid
    private List<BlockerRequest> blockers;

    @Valid
    private List<AchievementRequest> achievements;

    @Valid
    private List<HoursByTaskTypeRequest> hoursByTaskType; // optional per spec

    private String notes;
}