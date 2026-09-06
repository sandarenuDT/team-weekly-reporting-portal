package com.company.weeklyreports.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class HoursByTaskTypeRequest {

    @NotBlank
    private String taskType;

    private BigDecimal hours;
}