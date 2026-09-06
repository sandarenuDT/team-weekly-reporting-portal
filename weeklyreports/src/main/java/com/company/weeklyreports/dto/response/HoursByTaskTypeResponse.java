package com.company.weeklyreports.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
@AllArgsConstructor
public class HoursByTaskTypeResponse {
    private Long id;
    private String taskType;
    private BigDecimal hours;
}