package com.finplanner.repository;

import com.finplanner.model.ClientIncome;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClientIncomeRepository extends JpaRepository<ClientIncome, Integer> {

    // Find all incomes by clientUuid
    List<ClientIncome> findByClientUuid(UUID clientUuid);

    // If we need an exact single record by (clientUuid, clientIncomeName)
    Optional<ClientIncome> findByClientUuidAndClientIncomeName(UUID clientUuid, String clientIncomeName);

}
