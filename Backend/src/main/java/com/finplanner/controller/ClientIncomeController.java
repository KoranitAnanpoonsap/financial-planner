package com.finplanner.controller;

import com.finplanner.model.ClientIncome;
import com.finplanner.repository.ClientIncomeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/clientincome")
public class ClientIncomeController {

    @Autowired
    private ClientIncomeRepository clientIncomeRepository;

    // Get all incomes for a given clientId
    @GetMapping("/{clientUuid}")
    public List<ClientIncome> getIncomesByClientId(@PathVariable String clientUuid) {
        UUID uuid = UUID.fromString(clientUuid); // Convert String to UUID
        return clientIncomeRepository.findByClientUuid(uuid);
    }

    // Create a new income record
    @PostMapping
    public ResponseEntity<ClientIncome> createIncome(@RequestBody ClientIncome clientIncome) {
        ClientIncome createdIncome = clientIncomeRepository.save(clientIncome);
        return ResponseEntity.ok(createdIncome);
    }

    // Delete an income by clientUuid and clientIncomeName
    @DeleteMapping("/{clientUuid}/{clientIncomeName}")
    public ResponseEntity<Object> deleteIncome(
            @PathVariable String clientUuid,
            @PathVariable String clientIncomeName) {

        UUID uuid = UUID.fromString(clientUuid);
        return clientIncomeRepository.findByClientUuidAndClientIncomeName(uuid, clientIncomeName)
                .map(existing -> {
                    clientIncomeRepository.delete(existing);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Update an existing income by clientUuid and clientIncomeName
    @PutMapping("/{clientUuid}/{clientIncomeName}")
    public ResponseEntity<ClientIncome> updateIncome(
            @PathVariable String clientUuid,
            @PathVariable String clientIncomeName,
            @RequestBody ClientIncome updatedIncome) {

        UUID uuid = UUID.fromString(clientUuid);
        return clientIncomeRepository.findByClientUuidAndClientIncomeName(uuid, clientIncomeName)
                .map(existing -> {
                    existing.setClientIncomeType(updatedIncome.getClientIncomeType());
                    existing.setClientIncomeFrequency(updatedIncome.getClientIncomeFrequency());
                    existing.setClientIncomeAmount(updatedIncome.getClientIncomeAmount());
                    existing.setClientIncomeAnnualGrowthRate(updatedIncome.getClientIncomeAnnualGrowthRate());
                    existing.setClientIncome405Type(updatedIncome.getClientIncome405Type());
                    existing.setClientIncome406Type(updatedIncome.getClientIncome406Type());
                    existing.setClientIncome408Type(updatedIncome.getClientIncome408Type());
                    existing.setClientIncome408TypeOtherExpenseDeduction(
                            updatedIncome.getClientIncome408TypeOtherExpenseDeduction());

                    ClientIncome saved = clientIncomeRepository.save(existing);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}