package com.finplanner.repository;

import com.finplanner.model.ClientAssets;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientAssetRepository extends JpaRepository<ClientAssets, Integer> {
    List<ClientAssets> findByClientUuid(UUID clientUuid);

    Optional<ClientAssets> findByClientUuidAndClientAssetName(UUID clientUuid, String clientAssetName);
}
