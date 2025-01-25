package com.finplanner.repository;

import com.finplanner.model.CfpInfo;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CfpInfoRepository extends JpaRepository<CfpInfo, Integer> {
    Optional<CfpInfo> findByCfpEmail(String cfpEmail);

    Optional<CfpInfo> findByCfpId(Integer cfpId);

    Optional<CfpInfo> findByCfpUuid(UUID cfpUuid);
}
