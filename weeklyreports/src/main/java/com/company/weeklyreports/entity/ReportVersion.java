package com.company.weeklyreports.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(
        name = "report_versions",
        uniqueConstraints = @UniqueConstraint(columnNames = {"report_id", "version_number"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "report_id", nullable = false)
    private Report report;

    @Column(name = "version_number", nullable = false)
    private Integer versionNumber;

    @Column(name = "tasks_planned_next_week", columnDefinition = "TEXT")
    private String tasksPlannedNextWeek;

    @Column(columnDefinition = "TEXT")
    private String notes;

    // Null while the version is still a draft (not yet submitted).
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "reportVersion", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Task> tasks = new ArrayList<>();

    @OneToMany(mappedBy = "reportVersion", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Blocker> blockers = new ArrayList<>();

    @OneToMany(mappedBy = "reportVersion", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Achievement> achievements = new ArrayList<>();

    @OneToMany(mappedBy = "reportVersion", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<HoursByTaskType> hoursByTaskType = new ArrayList<>();
}