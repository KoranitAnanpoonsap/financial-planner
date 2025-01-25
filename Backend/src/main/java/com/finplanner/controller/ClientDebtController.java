package com.finplanner.controller;

import com.finplanner.model.ClientDebt;
import com.finplanner.repository.ClientDebtRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/clientdebt")
public class ClientDebtController {

    @Autowired
    private ClientDebtRepository repository;

    // Get all debts for a given clientId
    @GetMapping("/{clientUuid}")
    public List<ClientDebt> getDebtsByClientId(@PathVariable String clientUuid) {
        UUID uuid = UUID.fromString(clientUuid); // Convert String to UUID
        return repository.findByClientUuid(uuid);
    }

    // Create a new debt record
    @PostMapping
    public ResponseEntity<ClientDebt> createDebt(@RequestBody ClientDebt clientDebt) {
        ClientDebt createdDebt = repository.save(clientDebt);
        return ResponseEntity.ok(createdDebt);
    }

    // Delete a debt by clientId and clientDebtName
    @DeleteMapping("/{clientUuid}/{clientDebtName}")
    public ResponseEntity<Object> deleteDebt(@PathVariable String clientUuid, @PathVariable String clientDebtName) {
        UUID uuid = UUID.fromString(clientUuid); // Convert String to UUID
        return repository.findByClientUuidAndClientDebtName(uuid, clientDebtName)
                .map(existing -> {
                    repository.delete(existing);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Update a debt record by clientId and clientDebtName
    @PutMapping("/{clientUuid}/{clientDebtName}")
    public ResponseEntity<ClientDebt> updateDebt(@PathVariable String clientUuid,
            @PathVariable String clientDebtName,
            @RequestBody ClientDebt updatedDebt) {
        UUID uuid = UUID.fromString(clientUuid); // Convert String to UUID

        return repository.findByClientUuidAndClientDebtName(uuid, clientDebtName)
                .map(existingDebt -> {
                    // Update fields as needed. Assuming the PUT request provides all fields:
                    existingDebt.setClientDebtType(updatedDebt.getClientDebtType());
                    existingDebt.setClientDebtTerm(updatedDebt.getClientDebtTerm());
                    existingDebt.setClientDebtAmount(updatedDebt.getClientDebtAmount());
                    existingDebt.setClientDebtAnnualInterest(updatedDebt.getClientDebtAnnualInterest());
                    existingDebt.setClientStartDateDebt(updatedDebt.getClientStartDateDebt());
                    existingDebt.setClientDebtDuration(updatedDebt.getClientDebtDuration());
                    existingDebt.setClientDebtPrincipal(updatedDebt.getClientDebtPrincipal());

                    ClientDebt savedDebt = repository.save(existingDebt);
                    return ResponseEntity.ok(savedDebt);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
