package com.finplanner.repository;

import com.finplanner.model.ClientAssets;
import com.finplanner.model.ClientAssetId;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientAssetRepository extends JpaRepository<ClientAssets, ClientAssetId> {
    List<ClientAssets> findById_ClientId(Integer clientId);
}
