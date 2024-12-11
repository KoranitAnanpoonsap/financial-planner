package com.finplanner.service;

import com.finplanner.model.RetirementGoal;
import com.finplanner.repository.RetirementGoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Optional;

@Service
public class RetirementGoalCalculationService {

    @Autowired
    private RetirementGoalRepository retirementGoalRepository;

    public RetirementGoalCalculationResult calculateForClient(Integer clientId) {
        Optional<RetirementGoal> goalOpt = retirementGoalRepository.findById(clientId);
        if (goalOpt.isEmpty()) {
            return null; // Or throw an exception if not found
        }

        RetirementGoal goal = goalOpt.get();

        // Extract values
        int currentAge = goal.getClientCurrentAge();
        int retirementAge = goal.getClientRetirementAge();
        int lifeExpectancy = goal.getClientLifeExpectancy();
        int currentYearlyExpense = goal.getClientCurrentYearlyExpense();
        float expectedRetPortReturn = goal.getClientExpectedRetiredPortReturn();
        float inflationRate = goal.getInflationRate();
        float retiredExpensePortion = goal.getClientRetiredExpensePortion();

        int yearsToRetirement = retirementAge - currentAge;

        // Convert to BigDecimal for precision
        BigDecimal bdCurrentExpense = BigDecimal.valueOf(currentYearlyExpense);
        BigDecimal bdInflationRate = BigDecimal.valueOf(inflationRate);
        BigDecimal bdExpectedRetPortReturn = BigDecimal.valueOf(expectedRetPortReturn);
        BigDecimal bdProportion = BigDecimal.valueOf(retiredExpensePortion);

        // Step 1: FV of current expense
        BigDecimal onePlusInflation = BigDecimal.ONE.add(bdInflationRate);
        BigDecimal fvCurrentExpense = bdCurrentExpense.multiply(onePlusInflation.pow(yearsToRetirement)).setScale(2,
                RoundingMode.HALF_UP);

        // Step 2: Calculate discount rate
        // discount_rate = ((1 + expectedRetPortReturn)/(1 + inflationRate)) - 1
        BigDecimal numerator = BigDecimal.ONE.add(bdExpectedRetPortReturn);
        BigDecimal denominator = BigDecimal.ONE.add(bdInflationRate);
        BigDecimal discountRate = numerator.divide(denominator, 8, RoundingMode.HALF_UP).subtract(BigDecimal.ONE)
                .setScale(4, RoundingMode.HALF_UP);

        // Step 3: new FV current expense
        BigDecimal newFvCurrentExpense = fvCurrentExpense.multiply(bdProportion).setScale(2, RoundingMode.HALF_UP);

        // Step 4: retirement goal
        // retirement_goal = newFvCurrentExpense * [1 -
        // 1/(1+discount_rate)^(lifeExpectancy - retirementAge)] / discount_rate * (1 +
        // discount_rate)

        int retirementDuration = lifeExpectancy - retirementAge;
        BigDecimal onePlusDiscount = BigDecimal.ONE.add(discountRate);

        // Handle no-growth scenario if discountRate == 0
        if (discountRate.compareTo(BigDecimal.ZERO) == 0) {
            // If discount rate is zero, the formula changes. The present value of an
            // annuity would be simpler:
            // retirement_goal = newFvCurrentExpense * (retirementDuration)
            // (Because at zero discount rate, just sum them up)
            BigDecimal retirementGoalZeroRate = newFvCurrentExpense.multiply(BigDecimal.valueOf(retirementDuration));
            return new RetirementGoalCalculationResult(discountRate, fvCurrentExpense, newFvCurrentExpense,
                    retirementGoalZeroRate);
        }

        BigDecimal denominatorDiscount = onePlusDiscount.pow(retirementDuration);
        BigDecimal factor = BigDecimal.ONE
                .subtract(BigDecimal.ONE.divide(denominatorDiscount, 8, RoundingMode.HALF_UP));

        // retirement_goal = newFvCurrentExpense * (factor / discountRate) * (1 +
        // discountRate)
        BigDecimal retirementGoal = newFvCurrentExpense.multiply(factor)
                .divide(discountRate, 8, RoundingMode.HALF_UP)
                .multiply(onePlusDiscount)
                .setScale(2, RoundingMode.HALF_UP);

        return new RetirementGoalCalculationResult(discountRate, fvCurrentExpense, newFvCurrentExpense, retirementGoal);
    }

    public static class RetirementGoalCalculationResult {
        private final BigDecimal discountRate;
        private final BigDecimal fvCurrentExpense;
        private final BigDecimal newFvCurrentExpense;
        private final BigDecimal retirementGoal;

        public RetirementGoalCalculationResult(BigDecimal discountRate, BigDecimal fvCurrentExpense,
                BigDecimal newFvCurrentExpense, BigDecimal retirementGoal) {
            this.discountRate = discountRate;
            this.fvCurrentExpense = fvCurrentExpense;
            this.newFvCurrentExpense = newFvCurrentExpense;
            this.retirementGoal = retirementGoal;
        }

        public BigDecimal getDiscountRate() {
            return discountRate;
        }

        public BigDecimal getFvCurrentExpense() {
            return fvCurrentExpense;
        }

        public BigDecimal getNewFvCurrentExpense() {
            return newFvCurrentExpense;
        }

        public BigDecimal getRetirementGoal() {
            return retirementGoal;
        }
    }
}
