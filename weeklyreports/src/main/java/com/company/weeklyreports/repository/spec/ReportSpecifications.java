package com.company.weeklyreports.repository.spec;

import com.company.weeklyreports.entity.Report;
import com.company.weeklyreports.entity.ReportStatus;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class ReportSpecifications {

    public static Specification<Report> hasUserId(Long userId) {
        return (root, query, cb) -> userId == null ? null : cb.equal(root.get("user").get("id"), userId);
    }

    public static Specification<Report> hasProjectId(Long projectId) {
        return (root, query, cb) -> projectId == null ? null : cb.equal(root.get("project").get("id"), projectId);
    }

    public static Specification<Report> hasStatus(ReportStatus status) {
        return (root, query, cb) -> status == null ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<Report> weekStartFrom(LocalDate from) {
        return (root, query, cb) -> from == null ? null : cb.greaterThanOrEqualTo(root.get("weekStart"), from);
    }

    public static Specification<Report> weekStartTo(LocalDate to) {
        return (root, query, cb) -> to == null ? null : cb.lessThanOrEqualTo(root.get("weekStart"), to);
    }
}