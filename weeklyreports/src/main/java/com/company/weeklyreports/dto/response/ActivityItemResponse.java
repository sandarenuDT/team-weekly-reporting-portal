package com.company.weeklyreports.dto.response;

import com.company.weeklyreports.entity.ReviewAction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class ActivityItemResponse {
    private String memberName;
    private String reviewerName;
    private ReviewAction action;
    private String weekLabel;
    private LocalDateTime timestamp;
}