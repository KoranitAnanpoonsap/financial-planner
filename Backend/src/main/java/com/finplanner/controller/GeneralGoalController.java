package com.finplanner.controller;

import com.finplanner.model.GeneralGoal;
import com.finplanner.repository.GeneralGoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/generalgoal")
public class GeneralGoalController {

    @Autowired
    private GeneralGoalRepository generalGoalRepository;

    // Get a GeneralGoal by clientId
    @GetMapping("/{clientId}")
    public ResponseEntity<GeneralGoal> getGeneralGoalByClientId(@PathVariable("clientId") Integer clientId) {
        Optional<GeneralGoal> generalGoalOpt = generalGoalRepository.findById(clientId);
        return generalGoalOpt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new GeneralGoal
    @PostMapping
    public ResponseEntity<GeneralGoal> createGeneralGoal(@RequestBody GeneralGoal generalGoal) {
        // Ensure that clientId is set before saving. GeneralGoal clientId is the PK.
        // Also ensure that the corresponding ClientInfo entry exists or this will fail
        // due to FK constraint.
        GeneralGoal created = generalGoalRepository.save(generalGoal);
        return ResponseEntity.ok(created);
    }

    // Delete a GeneralGoal by clientId
    @DeleteMapping("/{clientId}")
    public ResponseEntity<Void> deleteGeneralGoal(@PathVariable("clientId") Integer clientId) {
        if (generalGoalRepository.existsById(clientId)) {
            generalGoalRepository.deleteById(clientId);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Update an existing GeneralGoal by clientId
    @PutMapping("/{clientId}")
    public ResponseEntity<GeneralGoal> updateGeneralGoal(@PathVariable("clientId") Integer clientId,
            @RequestBody GeneralGoal updatedGoal) {
        return generalGoalRepository.findById(clientId)
                .map(existingGoal -> {
                    // Update fields as needed
                    existingGoal.setClientGeneralGoalName(updatedGoal.getClientGeneralGoalName());
                    existingGoal.setClientGeneralGoalValue(updatedGoal.getClientGeneralGoalValue());
                    existingGoal.setClientGeneralGoalPeriod(updatedGoal.getClientGeneralGoalPeriod());
                    existingGoal.setClientNetIncome(updatedGoal.getClientNetIncome());
                    existingGoal.setClientNetIncomeGrowth(updatedGoal.getClientNetIncomeGrowth());

                    GeneralGoal saved = generalGoalRepository.save(existingGoal);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
