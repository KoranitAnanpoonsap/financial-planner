package com.finplanner.model;

import java.math.BigDecimal;

public class PortfolioSummary {
    private BigDecimal totalInvestAmount;
    private BigDecimal portfolioReturn;

    public PortfolioSummary(BigDecimal totalInvestAmount, BigDecimal portfolioReturn) {
        this.totalInvestAmount = totalInvestAmount;
        this.portfolioReturn = portfolioReturn;
    }

    public BigDecimal getTotalInvestAmount() {
        return totalInvestAmount;
    }

    public BigDecimal getPortfolioReturn() {
        return portfolioReturn;
    }
}
