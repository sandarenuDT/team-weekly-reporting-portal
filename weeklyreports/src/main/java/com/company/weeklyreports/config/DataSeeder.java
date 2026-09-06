package com.company.weeklyreports.config;

import com.company.weeklyreports.entity.*;
import com.company.weeklyreports.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@Profile("seed")
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ReportRepository reportRepository;
    private final ReportVersionRepository reportVersionRepository;
    private final TaskRepository taskRepository;
    private final BlockerRepository blockerRepository;
    private final AchievementRepository achievementRepository;
    private final HoursByTaskTypeRepository hoursByTaskTypeRepository;
    private final ReviewCommentRepository reviewCommentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            System.out.println("Seed skipped — data already exists.");
            return;
        }

        System.out.println("Seeding database...");

        // ---------- Users ----------
        User manager = save(User.builder()
                .name("Priya Nair").email("manager@company.com")
                .passwordHash(hash("password123")).role(Role.MANAGER).build());

        User alice = save(User.builder()
                .name("Alice Fernando").email("alice@company.com")
                .passwordHash(hash("password123")).role(Role.TEAM_MEMBER).build());
        User bilal = save(User.builder()
                .name("Bilal Rahman").email("bilal@company.com")
                .passwordHash(hash("password123")).role(Role.TEAM_MEMBER).build());
        User carla = save(User.builder()
                .name("Carla Mendes").email("carla@company.com")
                .passwordHash(hash("password123")).role(Role.TEAM_MEMBER).build());
        User dinesh = save(User.builder()
                .name("Dinesh Kumar").email("dinesh@company.com")
                .passwordHash(hash("password123")).role(Role.TEAM_MEMBER).build());
        User elena = save(User.builder()
                .name("Elena Silva").email("elena@company.com")
                .passwordHash(hash("password123")).role(Role.TEAM_MEMBER).build());

        List<User> members = List.of(alice, bilal, carla, dinesh, elena);

        // ---------- Projects ----------
        Project clientA = save(Project.builder().name("Client A").description("External client engagement").build());
        Project internal = save(Project.builder().name("Internal Tooling").description("Internal dev tools").build());
        Project rnd = save(Project.builder().name("R&D").description("Exploratory research").build());
        Project marketing = save(Project.builder().name("Marketing").description("Campaigns and content").build());

        List<Project> projects = List.of(clientA, internal, rnd, marketing);

        // ---------- Reports across the last 4 weeks, mixed statuses ----------
        LocalDate thisWeekStart = mondayOfCurrentWeek();

        for (int weekOffset = 3; weekOffset >= 0; weekOffset--) {
            LocalDate weekStart = thisWeekStart.minusWeeks(weekOffset);

            for (int i = 0; i < members.size(); i++) {
                User member = members.get(i);
                Project project = projects.get(i % projects.size());

                // Skip one member in the most recent week to demonstrate
                // "not yet started" on the dashboard.
                if (weekOffset == 0 && i == 4) continue;

                ReportStatus status = pickStatus(weekOffset, i);
                createSeededReport(member, project, weekStart, status, manager, i);
            }
        }

        System.out.println("Seed complete: " + userRepository.count() + " users, "
                + reportRepository.count() + " reports.");
    }

    private ReportStatus pickStatus(int weekOffset, int memberIndex) {
        if (weekOffset == 0) {
            // current week: a mix, including one still needing correction
            return switch (memberIndex) {
                case 0 -> ReportStatus.SUBMITTED;
                case 1 -> ReportStatus.NEEDS_CORRECTION;
                case 2 -> ReportStatus.DRAFT;
                case 3 -> ReportStatus.APPROVED;
                default -> ReportStatus.SUBMITTED;
            };
        }
        // past weeks: mostly approved, to show a healthy history
        return memberIndex == 2 && weekOffset == 1 ? ReportStatus.NEEDS_CORRECTION : ReportStatus.APPROVED;
    }

    private void createSeededReport(User member, Project project, LocalDate weekStart,
                                    ReportStatus targetStatus, User manager, int seedVariant) {
        Report report = Report.builder()
                .user(member).project(project)
                .weekStart(weekStart).weekEnd(weekStart.plusDays(6))
                .status(ReportStatus.DRAFT)
                .build();
        report = reportRepository.save(report);

        ReportVersion v1 = buildVersion(report, 1, seedVariant, false);
        v1 = reportVersionRepository.save(v1);
        report.setCurrentVersion(v1);
        reportRepository.save(report);

        if (targetStatus == ReportStatus.DRAFT) {
            return; // stays as-is, no submission
        }

        // Submit v1
        v1.setSubmittedAt(LocalDateTime.now().minusDays(3));
        reportVersionRepository.save(v1);
        report.setStatus(ReportStatus.SUBMITTED);
        reportRepository.save(report);

        if (targetStatus == ReportStatus.SUBMITTED) {
            return;
        }

        if (targetStatus == ReportStatus.NEEDS_CORRECTION) {
            reviewCommentRepository.save(ReviewComment.builder()
                    .report(report).reportVersion(v1).reviewer(manager)
                    .action(ReviewAction.REQUESTED_CHANGES)
                    .comment("Please add the missing deliverable link for the second task.")
                    .build());
            report.setStatus(ReportStatus.NEEDS_CORRECTION);
            reportRepository.save(report);
            return;
        }

        if (targetStatus == ReportStatus.APPROVED) {
            reviewCommentRepository.save(ReviewComment.builder()
                    .report(report).reportVersion(v1).reviewer(manager)
                    .action(ReviewAction.APPROVED)
                    .comment("Looks good, thanks!")
                    .build());
            report.setStatus(ReportStatus.APPROVED);
            reportRepository.save(report);
        }
    }

    private ReportVersion buildVersion(Report report, int versionNumber, int seedVariant, boolean submitted) {
        ReportVersion version = ReportVersion.builder()
                .report(report)
                .versionNumber(versionNumber)
                .tasksPlannedNextWeek("Continue with next phase of the current milestone.")
                .notes("No additional notes this week.")
                .build();
        version = reportVersionRepository.save(version);

        taskRepository.save(Task.builder()
                .reportVersion(version).name("Feature implementation")
                .priority(TaskPriority.HIGH).plannedPct(100).actualPct(80 + seedVariant % 3 * 5)
                .status(TaskStatus.IN_PROGRESS)
                .timePlannedHours(new BigDecimal("20")).timeSpentHours(new BigDecimal("18"))
                .deliverable("PR #" + (100 + seedVariant)).build());

        taskRepository.save(Task.builder()
                .reportVersion(version).name("Code review and QA")
                .priority(TaskPriority.MEDIUM).plannedPct(100).actualPct(100)
                .status(TaskStatus.DONE)
                .timePlannedHours(new BigDecimal("8")).timeSpentHours(new BigDecimal("6"))
                .deliverable("Test report").build());

        blockerRepository.save(Blocker.builder()
                .reportVersion(version)
                .description("Waiting on API credentials from the client")
                .isKeyIssue(true).build());

        achievementRepository.save(Achievement.builder()
                .reportVersion(version)
                .description("Shipped the new dashboard filter feature")
                .isKeyAchievement(true).build());

        hoursByTaskTypeRepository.save(HoursByTaskType.builder()
                .reportVersion(version).taskType("Development").hours(new BigDecimal("24")).build());
        hoursByTaskTypeRepository.save(HoursByTaskType.builder()
                .reportVersion(version).taskType("Meetings").hours(new BigDecimal("6")).build());
        hoursByTaskTypeRepository.save(HoursByTaskType.builder()
                .reportVersion(version).taskType("Testing").hours(new BigDecimal("5")).build());
        hoursByTaskTypeRepository.save(HoursByTaskType.builder()
                .reportVersion(version).taskType("Documentation").hours(new BigDecimal("3")).build());

        return version;
    }

    private LocalDate mondayOfCurrentWeek() {
        LocalDate today = LocalDate.now();
        return today.minusDays(today.getDayOfWeek().getValue() - 1);
    }

    private String hash(String raw) {
        return passwordEncoder.encode(raw);
    }

    private User save(User u) { return userRepository.save(u); }
    private Project save(Project p) { return projectRepository.save(p); }
}