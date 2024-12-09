package com.finplanner.controller;

import com.finplanner.model.ClientAssets;
import com.finplanner.model.ClientAssetId;
import com.finplanner.repository.ClientAssetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientassets")
public class ClientAssetController {

    @Autowired
    private ClientAssetRepository clientAssetRepository;

    // Get all assets for a given clientId
    @GetMapping("/{clientId}")
    public List<ClientAssets> getAssetsByClientId(@PathVariable("clientId") Integer clientId) {
        return clientAssetRepository.findById_ClientId(clientId);
    }

    // Create a new asset record
    @PostMapping
    public ResponseEntity<ClientAssets> createAsset(@RequestBody ClientAssets clientAsset) {
        ClientAssets createdAsset = clientAssetRepository.save(clientAsset);
        return ResponseEntity.ok(createdAsset);
    }

    // Delete an asset by clientId and clientAssetName
    @DeleteMapping("/{clientId}/{clientAssetName}")
    public ResponseEntity<Void> deleteAsset(@PathVariable("clientId") Integer clientId,
            @PathVariable("clientAssetName") String clientAssetName) {
        ClientAssetId id = new ClientAssetId(clientId, clientAssetName);
        clientAssetRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Update an existing asset by clientId and clientAssetName
    @PutMapping("/{clientId}/{clientAssetName}")
    public ResponseEntity<ClientAssets> updateAsset(@PathVariable("clientId") Integer clientId,
            @PathVariable("clientAssetName") String clientAssetName,
            @RequestBody ClientAssets updatedAsset) {
        ClientAssetId id = new ClientAssetId(clientId, clientAssetName);

        return clientAssetRepository.findById(id)
                .map(existingAsset -> {
                    // Update the fields as needed
                    existingAsset.setClientAssetType(updatedAsset.getClientAssetType());
                    existingAsset.setClientAssetAmount(updatedAsset.getClientAssetAmount());
                    existingAsset.setClientAssetBuyDate(updatedAsset.getClientAssetBuyDate());
                    existingAsset.setClientAssetInvestType(updatedAsset.getClientAssetInvestType());
                    existingAsset.setClientAssetInvestRisk(updatedAsset.getClientAssetInvestRisk());

                    // Save the updated entity
                    ClientAssets savedAsset = clientAssetRepository.save(existingAsset);
                    return ResponseEntity.ok(savedAsset);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
