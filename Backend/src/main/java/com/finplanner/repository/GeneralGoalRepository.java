package com.finplanner.repository;

import com.finplanner.model.GeneralGoal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GeneralGoalRepository extends JpaRepository<GeneralGoal, Integer> {
}
