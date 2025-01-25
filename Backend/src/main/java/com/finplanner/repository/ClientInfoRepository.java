package com.finplanner.repository;

import com.finplanner.model.ClientInfo;
import com.finplanner.model.CfpClientInfoSidePanel;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientInfoRepository extends JpaRepository<ClientInfo, Integer> {
    // Existing method to find clients by CFP ID
    List<ClientInfo> findByCfpOfThisClient_CfpUuid(UUID cfpUuid);

    // Existing method to find a client for the BluePanel by ID
    @Query("SELECT c FROM ClientInfo c WHERE c.clientUuid = :clientUuid")
    Optional<CfpClientInfoSidePanel> findByClientSideUuid(UUID clientUuid);

    // New method to authenticate a client by email and password
    Optional<ClientInfo> findByClientEmailAndClientPassword(String email, String password);

    Optional<ClientInfo> findByClientUuid(UUID clientUuid);
}
