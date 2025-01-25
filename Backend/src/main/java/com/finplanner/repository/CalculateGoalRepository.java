package com.finplanner.repository;

import com.finplanner.model.CalculateGoal;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CalculateGoalRepository extends JpaRepository<CalculateGoal, Integer> {
    Optional<CalculateGoal> findByClientUuid(UUID clientUuid);
}
