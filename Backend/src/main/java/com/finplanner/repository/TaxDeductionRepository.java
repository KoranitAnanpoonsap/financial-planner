package com.finplanner.repository;

import com.finplanner.model.TaxDeduction;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaxDeductionRepository extends JpaRepository<TaxDeduction, Integer> {
    Optional<TaxDeduction> findByClientUuid(UUID clientUuid);
}
