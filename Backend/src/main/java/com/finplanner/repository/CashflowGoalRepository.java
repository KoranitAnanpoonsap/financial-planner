package com.finplanner.repository;

import com.finplanner.model.CashflowGoal;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CashflowGoalRepository extends JpaRepository<CashflowGoal, Integer> {
    List<CashflowGoal> findByClientUuid(UUID clientUuid);

    Optional<CashflowGoal> findByClientUuidAndClientGoalName(UUID clientUuid, String clientGoalName);
}
