package com.finplanner.repository;

import com.finplanner.model.ClientDebt;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientDebtRepository extends JpaRepository<ClientDebt, Integer> {

    List<ClientDebt> findByClientUuid(UUID clientUuid);

    Optional<ClientDebt> findByClientUuidAndClientDebtName(UUID clientUuid, String clientDebtName);
}
