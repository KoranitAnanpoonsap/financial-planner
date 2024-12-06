package com.finplanner.repository;

import com.finplanner.model.ClientDebt;
import com.finplanner.model.ClientDebtId;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientDebtRepository extends JpaRepository<ClientDebt, ClientDebtId> {
    List<ClientDebt> findById_ClientId(Integer clientId);
}
