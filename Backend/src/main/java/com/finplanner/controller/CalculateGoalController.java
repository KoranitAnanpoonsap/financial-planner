package com.finplanner.controller;

import com.finplanner.model.CalculateGoal;

import com.finplanner.repository.CalculateGoalRepository;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/calculategoal")
public class CalculateGoalController {

    @Autowired
    private CalculateGoalRepository calculateGoalRepository;

    // Get a CalculateGoal by clientId
    @GetMapping("/{clientUuid}")
    public ResponseEntity<CalculateGoal> getCalculateGoalByClientUuid(@PathVariable("clientUuid") String clientUuid) {
        UUID uuid = UUID.fromString(clientUuid); // Convert String to UUID
        return calculateGoalRepository.findByClientUuid(uuid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new CalculateGoal
    @PostMapping
    public ResponseEntity<CalculateGoal> createCalculateGoal(@RequestBody CalculateGoal calculateGoal) {
        CalculateGoal created = calculateGoalRepository.save(calculateGoal);
        return ResponseEntity.ok(created);
    }

    // Update an existing CalculateGoal by clientId
    @PutMapping("/{clientUuid}")
    public ResponseEntity<CalculateGoal> updateCalculateGoal(
            @PathVariable("clientUuid") String clientUuid,
            @RequestBody CalculateGoal updatedGoal) {
        UUID uuid = UUID.fromString(clientUuid); // Convert String to UUID
        return calculateGoalRepository.findByClientUuid(uuid)
                .map(existingGoal -> {
                    existingGoal.setGoalName(updatedGoal.getGoalName());
                    existingGoal.setGoalValue(updatedGoal.getGoalValue());
                    existingGoal.setGoalPeriod(updatedGoal.getGoalPeriod());
                    existingGoal.setNetIncome(updatedGoal.getNetIncome());
                    existingGoal.setNetIncomeGrowth(updatedGoal.getNetIncomeGrowth());
                    existingGoal.setPortReturn(updatedGoal.getPortReturn());
                    existingGoal.setTotalInvestment(updatedGoal.getTotalInvestment());

                    CalculateGoal savedGoal = calculateGoalRepository.save(existingGoal);
                    return ResponseEntity.ok(savedGoal);
                })
                .orElse(ResponseEntity.notFound().build());
    }

}
