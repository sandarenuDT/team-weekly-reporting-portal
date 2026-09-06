package com.company.weeklyreports.dto.request;

import com.company.weeklyreports.entity.ReviewAction;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewActionRequest {

    @NotNull
    private ReviewAction action;

    @Size(max = 2000)
    private String comment;
}