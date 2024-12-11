package com.finplanner.service;

import com.finplanner.model.GeneralGoal;
import com.finplanner.repository.GeneralGoalRepository;
import com.finplanner.service.PortfolioService.PortfolioSummary;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Optional;

@Service
public class GeneralGoalCalculationService {

    @Autowired
    private GeneralGoalRepository generalGoalRepository;

    @Autowired
    private PortfolioService portfolioService;

    public GeneralGoalCalculationResult calculateForClient(Integer clientId) {
        // Fetch GeneralGoal data
        Optional<GeneralGoal> goalOpt = generalGoalRepository.findById(clientId);

        if (goalOpt.isEmpty()) {
            return null; // Or throw an exception if client not found
        }

        GeneralGoal goal = goalOpt.get();

        Integer period = goal.getClientGeneralGoalPeriod();
        Integer goalValue = goal.getClientGeneralGoalValue();
        Float netIncomeGrowth = goal.getClientNetIncomeGrowth();

        // Retrieve portfolio summary
        PortfolioSummary summary = portfolioService.calculatePortfolioSummary(clientId);
        BigDecimal totalInvestAmount = summary.getTotalInvestAmount();
        BigDecimal portfolioReturn = summary.getPortfolioReturn();

        // Calculate FV of current investment
        // fv = totalInvestAmount * (1 + portfolioReturn)^(period)
        BigDecimal onePlusPortfolio = BigDecimal.ONE.add(portfolioReturn);
        BigDecimal fvOfCurrentInvestment = totalInvestAmount.multiply(
                onePlusPortfolio.pow(period)).setScale(2, RoundingMode.HALF_UP);

        // New general goal value = goalValue - fvOfCurrentInvestment
        BigDecimal newGeneralGoalValue = BigDecimal.valueOf(goalValue)
                .subtract(fvOfCurrentInvestment);

        // Calculate general goal annual saving
        // general_goal_annual_saving
        // = new_general_goal_value * ((portfolio_return - client_net_income_growth)
        // / [ (1+portfolio_return)^(period) - (1+client_net_income_growth)^(period) ])

        BigDecimal pReturn = portfolioReturn; // alias for readability
        BigDecimal cIncomeGrowth = BigDecimal.valueOf(netIncomeGrowth);
        BigDecimal numerator = pReturn.subtract(cIncomeGrowth);

        BigDecimal onePlusPortfolioPow = onePlusPortfolio.pow(period);
        BigDecimal onePlusIncomeGrowth = BigDecimal.ONE.add(cIncomeGrowth);
        BigDecimal onePlusIncomeGrowthPow = onePlusIncomeGrowth.pow(period);

        BigDecimal denominator = onePlusPortfolioPow.subtract(onePlusIncomeGrowthPow);

        // Handle potential division by zero if denominator is 0
        if (denominator.compareTo(BigDecimal.ZERO) == 0) {
            // If denominator is zero, handle scenario (maybe no growth differences?)
            // Return zero or some indicative value
            return new GeneralGoalCalculationResult(fvOfCurrentInvestment, BigDecimal.ZERO);
        }

        BigDecimal generalGoalAnnualSaving = newGeneralGoalValue.multiply(numerator)
                .divide(denominator, 2, RoundingMode.HALF_UP);

        return new GeneralGoalCalculationResult(fvOfCurrentInvestment, generalGoalAnnualSaving);
    }

    // A simple DTO class to hold the calculation results
    public static class GeneralGoalCalculationResult {
        private BigDecimal fvOfCurrentInvestment;
        private BigDecimal generalGoalAnnualSaving;

        public GeneralGoalCalculationResult(BigDecimal fvOfCurrentInvestment, BigDecimal generalGoalAnnualSaving) {
            this.fvOfCurrentInvestment = fvOfCurrentInvestment;
            this.generalGoalAnnualSaving = generalGoalAnnualSaving;
        }

        public BigDecimal getFvOfCurrentInvestment() {
            return fvOfCurrentInvestment;
        }

        public BigDecimal getGeneralGoalAnnualSaving() {
            return generalGoalAnnualSaving;
        }
    }
}
