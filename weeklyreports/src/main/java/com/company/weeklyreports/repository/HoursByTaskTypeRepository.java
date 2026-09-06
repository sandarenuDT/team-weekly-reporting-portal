package com.company.weeklyreports.repository;

import com.company.weeklyreports.entity.HoursByTaskType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface HoursByTaskTypeRepository extends JpaRepository<HoursByTaskType, Long> {

    @Query("SELECT h.taskType, SUM(h.hours) FROM HoursByTaskType h GROUP BY h.taskType")
    List<Object[]> totalHoursByTaskType();
}