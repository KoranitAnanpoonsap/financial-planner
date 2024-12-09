package com.finplanner.controller;

import com.finplanner.model.CashflowGoal;
import com.finplanner.model.CashflowGoalId;
import com.finplanner.model.CashflowResult;
import com.finplanner.repository.CashflowGoalRepository;
import com.finplanner.service.CashflowCalculationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cashflow")
public class CashflowController {

    @Autowired
    private CashflowCalculationService cashflowCalculationService;

    @Autowired
    private CashflowGoalRepository cashflowGoalRepository;

    // Existing endpoint to calculate cashflow
    @GetMapping("/calculate/{clientId}")
    public CashflowResult getCashflow(@PathVariable("clientId") Integer clientId) {
        return cashflowCalculationService.calculateCashflow(clientId);
    }

    // Get all goals for a given clientId
    @GetMapping("/{clientId}")
    public List<CashflowGoal> getGoalsByClientId(@PathVariable("clientId") Integer clientId) {
        return cashflowGoalRepository.findById_ClientId(clientId);
    }

    // Create a new goal record
    @PostMapping
    public ResponseEntity<CashflowGoal> createGoal(@RequestBody CashflowGoal cashflowGoal) {
        CashflowGoal createdGoal = cashflowGoalRepository.save(cashflowGoal);
        return ResponseEntity.ok(createdGoal);
    }

    // Delete a goal by clientId and clientGoalName
    @DeleteMapping("/{clientId}/{clientGoalName}")
    public ResponseEntity<Void> deleteGoal(@PathVariable("clientId") Integer clientId,
            @PathVariable("clientGoalName") String clientGoalName) {
        CashflowGoalId id = new CashflowGoalId(clientId, clientGoalName);
        cashflowGoalRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Update a goal by clientId and clientGoalName
    @PutMapping("/{clientId}/{clientGoalName}")
    public ResponseEntity<CashflowGoal> updateGoal(@PathVariable("clientId") Integer clientId,
            @PathVariable("clientGoalName") String clientGoalName,
            @RequestBody CashflowGoal updatedGoal) {
        CashflowGoalId id = new CashflowGoalId(clientId, clientGoalName);

        return cashflowGoalRepository.findById(id)
                .map(existingGoal -> {
                    // Update the fields as needed. Assuming the PUT request provides all fields:
                    existingGoal.setClientGoalPeriod(updatedGoal.getClientGoalPeriod());
                    existingGoal.setClientSavingGrowth(updatedGoal.getClientSavingGrowth());
                    existingGoal.setClientGoalValue(updatedGoal.getClientGoalValue());
                    // Save the updated entity
                    CashflowGoal savedGoal = cashflowGoalRepository.save(existingGoal);
                    return ResponseEntity.ok(savedGoal);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
