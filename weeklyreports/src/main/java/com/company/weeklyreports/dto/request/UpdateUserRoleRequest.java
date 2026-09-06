package com.company.weeklyreports.dto.request;

import com.company.weeklyreports.entity.Role;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserRoleRequest {

    @NotNull
    private Role role;
}