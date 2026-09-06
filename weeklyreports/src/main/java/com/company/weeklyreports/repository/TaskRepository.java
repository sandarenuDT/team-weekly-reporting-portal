package com.company.weeklyreports.repository;

import com.company.weeklyreports.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
}