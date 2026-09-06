package com.company.weeklyreports.dto.response;

import com.company.weeklyreports.entity.TaskPriority;
import com.company.weeklyreports.entity.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
@AllArgsConstructor
public class TaskResponse {
    private Long id;
    private String name;
    private TaskPriority priority;
    private Integer plannedPct;
    private Integer actualPct;
    private TaskStatus status;
    private BigDecimal timePlannedHours;
    private BigDecimal timeSpentHours;
    private String deliverable;
}