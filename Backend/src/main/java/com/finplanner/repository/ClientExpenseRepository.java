package com.finplanner.repository;

import com.finplanner.model.ClientExpense;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientExpenseRepository extends JpaRepository<ClientExpense, Integer> {

    List<ClientExpense> findByClientUuid(UUID clientUuid);

    Optional<ClientExpense> findByClientUuidAndClientExpenseName(UUID clientUuid, String clientExpenseName);
}
