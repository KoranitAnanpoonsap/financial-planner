package com.finplanner.controller;

import com.finplanner.model.TaxPlan;

import com.finplanner.repository.TaxPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/taxplan")
public class TaxPlanController {

    @Autowired
    private TaxPlanRepository taxPlanRepository;

    // Get a TaxPlan by clientId
    @GetMapping("/{clientUuid}")
    public ResponseEntity<TaxPlan> getTaxPlanByClientId(@PathVariable String clientUuid) {
        UUID uuid = UUID.fromString(clientUuid); // Convert String to UUID
        Optional<TaxPlan> taxPlanOpt = taxPlanRepository.findByClientUuid(uuid);
        return taxPlanOpt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new TaxPlan
    @PostMapping
    public ResponseEntity<TaxPlan> createTaxPlan(@RequestBody TaxPlan taxPlan) {
        // Ensure that clientId is set and that a corresponding ClientInfo record exists
        TaxPlan created = taxPlanRepository.save(taxPlan);
        return ResponseEntity.ok(created);
    }

    // Update an existing TaxPlan by clientId
    @PutMapping("/{clientUuid}")
    public ResponseEntity<TaxPlan> updateTaxPlan(@PathVariable String clientUuid,
            @RequestBody TaxPlan updatedTaxPlan) {
        UUID uuid = UUID.fromString(clientUuid); // Convert String to UUID
        return taxPlanRepository.findByClientUuid(uuid)
                .map(existingPlan -> {
                    // Update fields as needed
                    existingPlan.setInvestRmf(updatedTaxPlan.getInvestRmf());
                    existingPlan.setInvestSsf(updatedTaxPlan.getInvestSsf());
                    existingPlan.setInvestGovPensionFund(updatedTaxPlan.getInvestGovPensionFund());
                    existingPlan.setInvestPvd(updatedTaxPlan.getInvestPvd());
                    existingPlan.setInvestNationSavingsFund(updatedTaxPlan.getInvestNationSavingsFund());
                    existingPlan.setInvestPensionInsurance(updatedTaxPlan.getInvestPensionInsurance());

                    TaxPlan saved = taxPlanRepository.save(existingPlan);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
