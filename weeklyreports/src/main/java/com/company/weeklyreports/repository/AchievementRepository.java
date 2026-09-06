package com.company.weeklyreports.repository;

import com.company.weeklyreports.entity.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AchievementRepository extends JpaRepository<Achievement, Long> {
}