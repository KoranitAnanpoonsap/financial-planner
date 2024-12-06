package com.finplanner.repository;

import com.finplanner.model.TaxPlan;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaxPlanRepository extends JpaRepository<TaxPlan, Integer> {
}
