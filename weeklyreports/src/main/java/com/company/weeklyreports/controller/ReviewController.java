package com.company.weeklyreports.controller;

import com.company.weeklyreports.dto.request.ReviewActionRequest;
import com.company.weeklyreports.dto.response.ReportResponse;
import com.company.weeklyreports.dto.response.ReviewCommentResponse;
import com.company.weeklyreports.security.CustomUserDetails;
import com.company.weeklyreports.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports/{reportId}/review")
@RequiredArgsConstructor
@PreAuthorize("hasRole('MANAGER')") // applies to every method in this controller
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReportResponse> review(
            @AuthenticationPrincipal CustomUserDetails manager,
            @PathVariable Long reportId,
            @Valid @RequestBody ReviewActionRequest request) {
        return ResponseEntity.ok(reviewService.review(manager, reportId, request));
    }

    @GetMapping("/history")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ReviewCommentResponse>> history(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable Long reportId) {
        return ResponseEntity.ok(reviewService.findCommentHistory(currentUser, reportId));
    }
}