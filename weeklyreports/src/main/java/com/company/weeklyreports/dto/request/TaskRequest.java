package com.company.weeklyreports.dto.request;

import com.company.weeklyreports.entity.TaskPriority;
import com.company.weeklyreports.entity.TaskStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class TaskRequest {

    @NotBlank
    private String name;

    private TaskPriority priority;

    @Min(0) @Max(100)
    private Integer plannedPct;

    @Min(0) @Max(100)
    private Integer actualPct;

    private TaskStatus status;

    private BigDecimal timePlannedHours;
    private BigDecimal timeSpentHours;
    private String deliverable;
}