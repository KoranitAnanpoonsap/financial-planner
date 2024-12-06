package com.finplanner.repository;

import com.finplanner.model.ClientIncome;
import com.finplanner.model.ClientIncomeId;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientIncomeRepository extends JpaRepository<ClientIncome, ClientIncomeId> {
    List<ClientIncome> findById_ClientId(Integer clientId);
}
