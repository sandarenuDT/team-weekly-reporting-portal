package com.company.weeklyreports.service;

import com.company.weeklyreports.dto.request.RegisterRequest;
import com.company.weeklyreports.dto.request.UpdateUserRoleRequest;
import com.company.weeklyreports.dto.response.UserResponse;
import com.company.weeklyreports.dto.response.UserStatsResponse;
import com.company.weeklyreports.entity.Role;
import com.company.weeklyreports.entity.TaskStatus;
import com.company.weeklyreports.entity.User;
import com.company.weeklyreports.exception.ResourceNotFoundException;
import com.company.weeklyreports.repository.ReportRepository;
import com.company.weeklyreports.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ReportRepository reportRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<UserResponse> findAll() {
        return userRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<UserResponse> findTeamMembers() {
        return userRepository.findByRole(Role.TEAM_MEMBER).stream().map(this::toResponse).toList();
    }


    @Transactional
    public UserResponse inviteUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalStateException("An account with this email already exists.");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : Role.TEAM_MEMBER)
                .build();

        return toResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse updateRole(Long userId, UpdateUserRoleRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        user.setRole(request.getRole());
        return toResponse(userRepository.save(user));
    }

    @Transactional
    public void deactivate(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        user.setActive(false);
        userRepository.save(user);
    }

    @Transactional
    public void reactivate(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        user.setActive(true);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public UserStatsResponse getStats(Long userId) {
        var reports = reportRepository.findByUserIdOrderByWeekStartDesc(userId);

        long approved = reports.stream().filter(r -> r.getStatus().name().equals("APPROVED")).count();
        long needsCorrection = reports.stream().filter(r -> r.getStatus().name().equals("NEEDS_CORRECTION")).count();

        var allTasks = reports.stream()
                .filter(r -> r.getCurrentVersion() != null)
                .flatMap(r -> r.getCurrentVersion().getTasks().stream())
                .filter(t -> t.getPlannedPct() != null && t.getActualPct() != null)
                .toList();

        double avgGap = allTasks.isEmpty() ? 0.0 : allTasks.stream()
                .mapToInt(t -> Math.abs(t.getPlannedPct() - t.getActualPct()))
                .average()
                .orElse(0.0);

        long blockersRaised = reports.stream()
                .filter(r -> r.getCurrentVersion() != null)
                .mapToLong(r -> r.getCurrentVersion().getBlockers().size())
                .sum();

        return UserStatsResponse.builder()
                .totalReports(reports.size())
                .approvedCount(approved)
                .needsCorrectionCount(needsCorrection)
                .avgPlannedVsActualPct(Math.round(avgGap * 10.0) / 10.0)
                .totalBlockersRaised(blockersRaised)
                .build();
    }

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}