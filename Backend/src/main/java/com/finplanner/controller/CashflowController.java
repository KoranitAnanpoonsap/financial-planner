package com.finplanner.controller;

import com.finplanner.service.CashflowCalculationService;
import com.finplanner.model.CashflowResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cashflow")
public class CashflowController {

    @Autowired
    private CashflowCalculationService cashflowCalculationService;

    @GetMapping("/{clientId}")
    public CashflowResult getCashflow(@PathVariable Integer clientId) {
        return cashflowCalculationService.calculateCashflow(clientId);
    }
}
