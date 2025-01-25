package com.finplanner.controller;

import com.finplanner.model.CashflowGoal;
import com.finplanner.repository.CashflowGoalRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/cashflow")
public class CashflowController {

    @Autowired
    private CashflowGoalRepository cashflowGoalRepository;

    // Get all goals for a given clientId
    @GetMapping("/{clientUuid}")
    public List<CashflowGoal> getGoalsByClientId(@PathVariable String clientUuid) {
        UUID uuid = UUID.fromString(clientUuid); // Convert String to UUID
        return cashflowGoalRepository.findByClientUuid(uuid);
    }

    // Create a new goal record
    @PostMapping
    public ResponseEntity<CashflowGoal> createGoal(@RequestBody CashflowGoal cashflowGoal) {
        CashflowGoal createdGoal = cashflowGoalRepository.save(cashflowGoal);
        return ResponseEntity.ok(createdGoal);
    }

    // Delete a goal by clientId and clientGoalName
    @DeleteMapping("/{clientUuid}/{clientGoalName}")
    public ResponseEntity<Object> deleteGoal(@PathVariable String clientUuid,
            @PathVariable("clientGoalName") String clientGoalName) {
        UUID uuid = UUID.fromString(clientUuid); // Convert String to UUID
        return cashflowGoalRepository.findByClientUuidAndClientGoalName(uuid, clientGoalName)
                .map(existing -> {
                    cashflowGoalRepository.delete(existing);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Update a goal by clientId and clientGoalName
    @PutMapping("/{clientUuid}/{clientGoalName}")
    public ResponseEntity<CashflowGoal> updateGoal(@PathVariable String clientUuid,
            @PathVariable("clientGoalName") String clientGoalName,
            @RequestBody CashflowGoal updatedGoal) {
        UUID uuid = UUID.fromString(clientUuid); // Convert String to UUID

        return cashflowGoalRepository.findByClientUuidAndClientGoalName(uuid, clientGoalName)
                .map(existingGoal -> {
                    // Update the fields as needed. Assuming the PUT request provides all fields:
                    existingGoal.setClientGoalPeriod(updatedGoal.getClientGoalPeriod());
                    existingGoal.setClientGoalValue(updatedGoal.getClientGoalValue());
                    // Save the updated entity
                    CashflowGoal savedGoal = cashflowGoalRepository.save(existingGoal);
                    return ResponseEntity.ok(savedGoal);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
