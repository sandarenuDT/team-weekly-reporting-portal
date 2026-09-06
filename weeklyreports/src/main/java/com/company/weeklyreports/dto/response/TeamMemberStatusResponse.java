package com.company.weeklyreports.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class TeamMemberStatusResponse {
    private Long userId;
    private String userName;
    private Long reportId;
    private String status;
}