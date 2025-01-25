package com.finplanner.controller;

import com.finplanner.model.ClientAssets;
import com.finplanner.repository.ClientAssetRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/clientassets")
public class ClientAssetController {

    @Autowired
    private ClientAssetRepository clientAssetRepository;

    // Get all assets for a given clientId
    @GetMapping("/{clientUuid}")
    public List<ClientAssets> getAssetsByClientId(@PathVariable String clientUuid) {
        UUID uuid = UUID.fromString(clientUuid); // Convert String to UUID
        return clientAssetRepository.findByClientUuid(uuid);
    }

    // Create a new asset record
    @PostMapping
    public ResponseEntity<ClientAssets> createAsset(@RequestBody ClientAssets clientAsset) {
        ClientAssets createdAsset = clientAssetRepository.save(clientAsset);
        return ResponseEntity.ok(createdAsset);
    }

    // Delete an asset by clientId and clientAssetName
    @DeleteMapping("/{clientUuid}/{clientAssetName}")
    public ResponseEntity<Object> deleteAsset(@PathVariable String clientUuid,
            @PathVariable("clientAssetName") String clientAssetName) {
        UUID uuid = UUID.fromString(clientUuid); // Convert String to UUID
        return clientAssetRepository.findByClientUuidAndClientAssetName(uuid, clientAssetName)
                .map(existing -> {
                    clientAssetRepository.delete(existing);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Update an existing asset by clientId and clientAssetName
    @PutMapping("/{clientUuid}/{clientAssetName}")
    public ResponseEntity<ClientAssets> updateAsset(@PathVariable String clientUuid,
            @PathVariable("clientAssetName") String clientAssetName,
            @RequestBody ClientAssets updatedAsset) {
        UUID uuid = UUID.fromString(clientUuid); // Convert String to UUID

        return clientAssetRepository.findByClientUuidAndClientAssetName(uuid, clientAssetName)
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
