package com.finplanner.controller;

import com.finplanner.model.TaxPlan;
import com.finplanner.repository.TaxPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/taxplan")
public class TaxPlanController {

    @Autowired
    private TaxPlanRepository taxPlanRepository;

    // Get a TaxPlan by clientId
    @GetMapping("/{clientId}")
    public ResponseEntity<TaxPlan> getTaxPlanByClientId(@PathVariable("clientId") Integer clientId) {
        Optional<TaxPlan> taxPlanOpt = taxPlanRepository.findById(clientId);
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

    // Delete a TaxPlan by clientId
    @DeleteMapping("/{clientId}")
    public ResponseEntity<Void> deleteTaxPlan(@PathVariable("clientId") Integer clientId) {
        if (taxPlanRepository.existsById(clientId)) {
            taxPlanRepository.deleteById(clientId);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Update an existing TaxPlan by clientId
    @PutMapping("/{clientId}")
    public ResponseEntity<TaxPlan> updateTaxPlan(@PathVariable("clientId") Integer clientId,
            @RequestBody TaxPlan updatedTaxPlan) {
        return taxPlanRepository.findById(clientId)
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
