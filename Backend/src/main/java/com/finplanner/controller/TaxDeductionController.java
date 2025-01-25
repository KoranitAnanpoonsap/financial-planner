package com.finplanner.controller;

import com.finplanner.model.TaxDeduction;
import com.finplanner.repository.TaxDeductionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/taxdeduction")
public class TaxDeductionController {

    @Autowired
    private TaxDeductionRepository taxDeductionRepository;

    // Get a TaxDeduction by clientId
    @GetMapping("/{clientUuid}")
    public ResponseEntity<TaxDeduction> getTaxDeductionByClientId(@PathVariable String clientUuid) {
        UUID uuid = UUID.fromString(clientUuid); // Convert String to UUID
        Optional<TaxDeduction> taxDeductionOpt = taxDeductionRepository.findByClientUuid(uuid);
        return taxDeductionOpt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new TaxDeduction
    @PostMapping
    public ResponseEntity<TaxDeduction> createTaxDeduction(@RequestBody TaxDeduction taxDeduction) {
        TaxDeduction created = taxDeductionRepository.save(taxDeduction);
        return ResponseEntity.ok(created);
    }

    // Update an existing TaxDeduction by clientId
    @PutMapping("/{clientUuid}")
    public ResponseEntity<TaxDeduction> updateTaxDeduction(@PathVariable String clientUuid,
            @RequestBody TaxDeduction updatedTaxDeduction) {
        UUID uuid = UUID.fromString(clientUuid); // Convert String to UUID
        return taxDeductionRepository.findByClientUuid(uuid)
                .map(existingDeduction -> {
                    // Update fields as needed
                    existingDeduction.setMaritalStatus(updatedTaxDeduction.getMaritalStatus());
                    existingDeduction.setChild(updatedTaxDeduction.getChild());
                    existingDeduction.setChild2561(updatedTaxDeduction.getChild2561());
                    existingDeduction.setAdoptedChild(updatedTaxDeduction.getAdoptedChild());
                    existingDeduction.setParentalCare(updatedTaxDeduction.getParentalCare());
                    existingDeduction.setDisabledCare(updatedTaxDeduction.getDisabledCare());
                    existingDeduction.setPrenatalCare(updatedTaxDeduction.getPrenatalCare());
                    existingDeduction.setParentHealthInsurance(updatedTaxDeduction.getParentHealthInsurance());
                    existingDeduction.setLifeInsurance(updatedTaxDeduction.getLifeInsurance());
                    existingDeduction.setHealthInsurance(updatedTaxDeduction.getHealthInsurance());
                    existingDeduction.setPensionInsurance(updatedTaxDeduction.getPensionInsurance());
                    existingDeduction
                            .setSpouseNoIncomeLifeInsurance(updatedTaxDeduction.getSpouseNoIncomeLifeInsurance());
                    existingDeduction.setRmf(updatedTaxDeduction.getRmf());
                    existingDeduction.setSsf(updatedTaxDeduction.getSsf());
                    existingDeduction.setGovPensionFund(updatedTaxDeduction.getGovPensionFund());
                    existingDeduction.setPvd(updatedTaxDeduction.getPvd());
                    existingDeduction.setNationSavingsFund(updatedTaxDeduction.getNationSavingsFund());
                    existingDeduction.setSocialSecurityPremium(updatedTaxDeduction.getSocialSecurityPremium());
                    existingDeduction.setSocialEnterprise(updatedTaxDeduction.getSocialEnterprise());
                    existingDeduction.setThaiEsg(updatedTaxDeduction.getThaiEsg());
                    existingDeduction.setGeneralDonation(updatedTaxDeduction.getGeneralDonation());
                    existingDeduction.setEduDonation(updatedTaxDeduction.getEduDonation());
                    existingDeduction.setPoliticalPartyDonation(updatedTaxDeduction.getPoliticalPartyDonation());

                    TaxDeduction saved = taxDeductionRepository.save(existingDeduction);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
