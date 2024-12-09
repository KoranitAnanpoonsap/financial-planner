package com.finplanner.controller;

import com.finplanner.model.PortfolioSummary;
import com.finplanner.service.PortfolioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    @Autowired
    private PortfolioService portfolioService;

    @GetMapping("/{clientId}")
    public PortfolioSummary getPortfolioSummary(@PathVariable Integer clientId) {
        return portfolioService.calculatePortfolioSummary(clientId);
    }
}
