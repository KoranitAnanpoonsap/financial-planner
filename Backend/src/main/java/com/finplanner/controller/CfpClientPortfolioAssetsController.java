package com.finplanner.controller;

import com.finplanner.model.CfpClientPortfolioAssets;
import com.finplanner.model.CfpClientPortfolioAssetsId;
import com.finplanner.repository.CfpClientPortfolioAssetsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", allowedHeaders = "*", methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT,
        RequestMethod.DELETE })
@RestController
@RequestMapping("/api/portassets")
public class CfpClientPortfolioAssetsController {

    @Autowired
    private CfpClientPortfolioAssetsRepository repository;

    @GetMapping("/{clientId}")
    public List<CfpClientPortfolioAssets> getAssetsByClientId(@PathVariable Integer clientId) {
        return repository.findById_ClientId(clientId);
    }

    // Create a new asset
    @PostMapping
    public ResponseEntity<CfpClientPortfolioAssets> createAsset(@RequestBody CfpClientPortfolioAssets asset) {
        CfpClientPortfolioAssets createdAsset = repository.save(asset);
        return ResponseEntity.ok(createdAsset);
    }

    // Delete an asset by clientId and investName
    @DeleteMapping("/{clientId}/{investName}")
    public ResponseEntity<Void> deleteAsset(@PathVariable Integer clientId, @PathVariable String investName) {
        CfpClientPortfolioAssetsId id = new CfpClientPortfolioAssetsId(clientId, investName);
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Update an existing asset by clientId and clientAssetName
    @PutMapping("/{clientId}/{investName}")
    public ResponseEntity<CfpClientPortfolioAssets> updateAsset(@PathVariable Integer clientId,
            @PathVariable String investName,
            @RequestBody CfpClientPortfolioAssets updateAsset) {
        CfpClientPortfolioAssetsId id = new CfpClientPortfolioAssetsId(clientId, investName);

        return repository.findById(id)
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
