package com.company.weeklyreports.repository;

import com.company.weeklyreports.entity.ReviewComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewCommentRepository extends JpaRepository<ReviewComment, Long> {
    List<ReviewComment> findByReportIdOrderByCreatedAtDesc(Long reportId);
}