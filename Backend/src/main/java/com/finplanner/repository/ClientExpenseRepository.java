package com.finplanner.repository;

import com.finplanner.model.ClientExpense;
import com.finplanner.model.ClientExpenseId;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientExpenseRepository extends JpaRepository<ClientExpense, ClientExpenseId> {
    List<ClientExpense> findById_ClientId(Integer clientId);
}
