package com.company.weeklyreports.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class AchievementResponse {
    private Long id;
    private String description;
    private boolean keyAchievement;
}