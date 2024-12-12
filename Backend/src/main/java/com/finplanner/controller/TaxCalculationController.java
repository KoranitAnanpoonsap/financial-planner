package com.finplanner.controller;

import com.finplanner.service.TaxCalculationService;
import com.finplanner.service.TaxCalculationService.TaxCalculationResult;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tax")
public class TaxCalculationController {

    @Autowired
    private TaxCalculationService taxCalculationService;

    @GetMapping("/calculate/{clientId}")
    public TaxCalculationResult calculateTax(@PathVariable("clientId") Integer clientId) {
        return taxCalculationService.calculateTaxForClient(clientId);
    }
}
