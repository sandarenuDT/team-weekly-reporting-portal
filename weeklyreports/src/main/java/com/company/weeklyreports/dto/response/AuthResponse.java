package com.company.weeklyreports.dto.response;

import com.company.weeklyreports.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class AuthResponse {
    private String accessToken;
    private Long userId;
    private String name;
    private String email;
    private Role role;
}