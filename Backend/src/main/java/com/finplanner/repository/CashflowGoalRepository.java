package com.finplanner.repository;

import com.finplanner.model.CashflowGoal;
import com.finplanner.model.CashflowGoalId;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CashflowGoalRepository extends JpaRepository<CashflowGoal, CashflowGoalId> {
    List<CashflowGoal> findById_ClientId(Integer clientId);
}
