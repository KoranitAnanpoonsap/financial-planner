package com.finplanner.controller;

import com.finplanner.model.CfpClientPortfolioAssets;
import com.finplanner.repository.CfpClientPortfolioAssetsRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/portassets")
public class CfpClientPortfolioAssetsController {

    @Autowired
    private CfpClientPortfolioAssetsRepository repository;

    @GetMapping("/{clientUuid}")
    public List<CfpClientPortfolioAssets> getAssetsByClientId(@PathVariable String clientUuid) {
        UUID uuid = UUID.fromString(clientUuid); // Convert String to UUID
        return repository.findByClientUuid(uuid);
    }

    // Create a new asset
    @PostMapping
    public ResponseEntity<CfpClientPortfolioAssets> createAsset(@RequestBody CfpClientPortfolioAssets asset) {
        CfpClientPortfolioAssets createdAsset = repository.save(asset);
        return ResponseEntity.ok(createdAsset);
    }

    // Delete an asset by clientId and investName
    @DeleteMapping("/{clientUuid}/{investName}")
    public ResponseEntity<Object> deleteAsset(@PathVariable String clientUuid, @PathVariable String investName) {
        UUID uuid = UUID.fromString(clientUuid); // Convert String to UUID
        return repository.findByClientUuidAndInvestName(uuid, investName)
                .map(existing -> {
                    repository.delete(existing);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Update an existing asset by clientId and clientAssetName
    @PutMapping("/{clientUuid}/{investName}")
    public ResponseEntity<CfpClientPortfolioAssets> updateAsset(@PathVariable String clientUuid,
            @PathVariable String investName,
            @RequestBody CfpClientPortfolioAssets updateAsset) {
        UUID uuid = UUID.fromString(clientUuid); // Convert String to UUID

        return repository.findByClientUuidAndInvestName(uuid, investName)
                .map(existingAsset -> {
                    // Update the fields as needed
                    existingAsset.setInvestType(updateAsset.getInvestType());
                    existingAsset.setInvestAmount(updateAsset.getInvestAmount());
                    existingAsset.setYearlyReturn(updateAsset.getYearlyReturn());

                    // Save the updated entity
                    CfpClientPortfolioAssets savedAsset = repository.save(existingAsset);
                    return ResponseEntity.ok(savedAsset);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
