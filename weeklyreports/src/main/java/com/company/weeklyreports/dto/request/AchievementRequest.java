package com.company.weeklyreports.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AchievementRequest {

    @NotBlank
    private String description;

    private boolean keyAchievement;
}