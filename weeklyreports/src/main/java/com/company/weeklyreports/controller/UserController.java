package com.company.weeklyreports.controller;

import com.company.weeklyreports.dto.request.RegisterRequest;
import com.company.weeklyreports.dto.request.UpdateUserRoleRequest;
import com.company.weeklyreports.dto.response.UserResponse;
import com.company.weeklyreports.dto.response.UserStatsResponse;
import com.company.weeklyreports.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // Manager-only
    @GetMapping
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<UserResponse>> findAll() {
        return ResponseEntity.ok(userService.findAll());
    }

    // Team-member list used by the "Team Members" nav section
    @GetMapping("/team-members")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<UserResponse>> findTeamMembers() {
        return ResponseEntity.ok(userService.findTeamMembers());
    }

    @PostMapping("/invite")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<UserResponse> invite(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(userService.inviteUser(request));
    }

    @PatchMapping("/{id}/role")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<UserResponse> updateRole(
            @PathVariable Long id, @Valid @RequestBody UpdateUserRoleRequest request) {
        return ResponseEntity.ok(userService.updateRole(id, request));
    }

    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Void> deactivate(@PathVariable Long id) {
        userService.deactivate(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/reactivate")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Void> reactivate(@PathVariable Long id) {
        userService.reactivate(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/stats")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<UserStatsResponse> stats(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getStats(id));
    }
}