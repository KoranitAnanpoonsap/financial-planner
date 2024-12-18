package com.finplanner.repository;

import com.finplanner.model.ClientInfo;
import com.finplanner.model.ClientInfoBluePanel;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientInfoRepository extends JpaRepository<ClientInfo, Integer> {
    // Existing method to find clients by CFP ID
    Page<ClientInfo> findByCfpOfThisClient_CfpId(Integer cfpId, Pageable pageable);

    // Existing method to find clients by CFP ID and first/last name
    Page<ClientInfo> findByCfpOfThisClient_CfpIdAndClientFirstNameContainingOrCfpOfThisClient_CfpIdAndClientLastNameContaining(
            Integer cfpId, String firstName, Integer cfpId2, String lastName, Pageable pageable);

    // Existing method to find a client for the BluePanel by ID
    @Query("SELECT c FROM ClientInfo c WHERE c.clientId = :clientId")
    Optional<ClientInfoBluePanel> findByClientId(Integer clientId);

    // New method to authenticate a client by email and password
    Optional<ClientInfo> findByClientEmailAndClientPassword(String email, String password);
}
