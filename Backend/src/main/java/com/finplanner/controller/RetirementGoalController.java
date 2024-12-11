package com.finplanner.controller;

import com.finplanner.model.RetirementGoal;
import com.finplanner.repository.RetirementGoalRepository;
import com.finplanner.service.RetirementGoalCalculationService;
import com.finplanner.service.RetirementGoalCalculationService.RetirementGoalCalculationResult;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/retirementgoal")
public class RetirementGoalController {

    @Autowired
    private RetirementGoalRepository retirementGoalRepository;

    @Autowired
    private RetirementGoalCalculationService retirementGoalCalculationService;

    // Get a RetirementGoal by clientId
    @GetMapping("/{clientId}")
    public ResponseEntity<RetirementGoal> getRetirementGoalByClientId(@PathVariable("clientId") Integer clientId) {
        Optional<RetirementGoal> retirementGoalOpt = retirementGoalRepository.findById(clientId);
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

    // Delete a RetirementGoal by clientId
    @DeleteMapping("/{clientId}")
    public ResponseEntity<Void> deleteRetirementGoal(@PathVariable("clientId") Integer clientId) {
        if (retirementGoalRepository.existsById(clientId)) {
            retirementGoalRepository.deleteById(clientId);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Update an existing RetirementGoal by clientId
    @PutMapping("/{clientId}")
    public ResponseEntity<RetirementGoal> updateRetirementGoal(@PathVariable("clientId") Integer clientId,
            @RequestBody RetirementGoal updatedGoal) {
        return retirementGoalRepository.findById(clientId)
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

    // Get retirement goal calculation
    @GetMapping("/calculate/{clientId}")
    public RetirementGoalCalculationResult calculateRetirementGoalDetails(@PathVariable("clientId") Integer clientId) {
        return retirementGoalCalculationService.calculateForClient(clientId);
    }
}
