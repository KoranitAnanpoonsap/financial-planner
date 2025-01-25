package com.finplanner.repository;

import com.finplanner.model.RetirementGoal;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RetirementGoalRepository extends JpaRepository<RetirementGoal, Integer> {
    Optional<RetirementGoal> findByClientUuid(UUID clientUuid);
}
