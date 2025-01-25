package com.finplanner.controller;

import com.finplanner.model.RetirementGoal;
import com.finplanner.repository.RetirementGoalRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/retirementgoal")
public class RetirementGoalController {

    @Autowired
    private RetirementGoalRepository retirementGoalRepository;

    // Get a RetirementGoal by clientId
    @GetMapping("/{clientUuid}")
    public ResponseEntity<RetirementGoal> getRetirementGoalByClientId(@PathVariable String clientUuid) {
        UUID uuid = UUID.fromString(clientUuid); // Convert String to UUID
        Optional<RetirementGoal> retirementGoalOpt = retirementGoalRepository.findByClientUuid(uuid);
        return retirementGoalOpt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new RetirementGoal
    @PostMapping
    public ResponseEntity<RetirementGoal> createRetirementGoal(@RequestBody RetirementGoal retirementGoal) {
        // Ensure that clientId is set and that a corresponding ClientInfo record exists
        RetirementGoal created = retirementGoalRepository.save(retirementGoal);
        return ResponseEntity.ok(created);
    }

    // Update an existing RetirementGoal by clientId
    @PutMapping("/{clientUuid}")
    public ResponseEntity<RetirementGoal> updateRetirementGoal(@PathVariable String clientUuid,
            @RequestBody RetirementGoal updatedGoal) {
        UUID uuid = UUID.fromString(clientUuid); // Convert String to UUID
        return retirementGoalRepository.findByClientUuid(uuid)
                .map(existingGoal -> {
                    // Update fields as needed
                    existingGoal.setClientCurrentAge(updatedGoal.getClientCurrentAge());
                    existingGoal.setClientRetirementAge(updatedGoal.getClientRetirementAge());
                    existingGoal.setClientLifeExpectancy(updatedGoal.getClientLifeExpectancy());
                    existingGoal.setClientCurrentYearlyExpense(updatedGoal.getClientCurrentYearlyExpense());
                    existingGoal.setClientExpectedRetiredPortReturn(updatedGoal.getClientExpectedRetiredPortReturn());
                    existingGoal.setInflationRate(updatedGoal.getInflationRate());
                    existingGoal.setClientRetiredExpensePortion(updatedGoal.getClientRetiredExpensePortion());

                    RetirementGoal saved = retirementGoalRepository.save(existingGoal);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
