package com.company.weeklyreports.repository;

import com.company.weeklyreports.entity.Blocker;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlockerRepository extends JpaRepository<Blocker, Long> {
}