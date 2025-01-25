package com.finplanner.repository;

import com.finplanner.model.CfpClientPortfolioAssets;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CfpClientPortfolioAssetsRepository
        extends JpaRepository<CfpClientPortfolioAssets, Integer> {
    List<CfpClientPortfolioAssets> findByClientUuid(UUID clientUuid);

    Optional<CfpClientPortfolioAssets> findByClientUuidAndInvestName(UUID clientUuid, String investName);
}
