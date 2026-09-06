package com.company.weeklyreports.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.math.BigDecimal;

@Entity
@Table(name = "hours_by_task_type")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HoursByTaskType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "report_version_id", nullable = false)
    private ReportVersion reportVersion;

    @Column(name = "task_type", nullable = false, length = 100)
    private String taskType; // e.g. Development, Testing, Meetings, Documentation

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal hours;
}