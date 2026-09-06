package com.company.weeklyreports.dto.request;

import com.company.weeklyreports.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 150)
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    // Optional — omit to default to TEAM_MEMBER in the service.
    // In a stricter build you'd only let an existing MANAGER set this
    // via the admin user-management endpoint, not open self-registration.
    private Role role;
}