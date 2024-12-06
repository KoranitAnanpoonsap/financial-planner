package com.finplanner.repository;

import com.finplanner.model.CfpClientPortfolioAssets;
import com.finplanner.model.CfpClientPortfolioAssetsId;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CfpClientPortfolioAssetsRepository
        extends JpaRepository<CfpClientPortfolioAssets, CfpClientPortfolioAssetsId> {
    List<CfpClientPortfolioAssets> findById_ClientId(Integer clientId);
}
