package com.company.weeklyreports.dto.response;

import com.company.weeklyreports.entity.ReviewAction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class ReviewCommentResponse {
    private Long id;
    private ReviewAction action;
    private String comment;
    private String reviewerName;
    private Integer reviewedVersionNumber;
    private LocalDateTime createdAt;
}