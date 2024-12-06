package com.finplanner.service;

import com.finplanner.model.ClientIncome;
import com.finplanner.repository.CashflowGoalRepository;
import com.finplanner.repository.ClientExpenseRepository;
import com.finplanner.repository.ClientIncomeRepository;
import com.finplanner.model.ClientExpense;
import com.finplanner.model.CashflowGoal;
import com.finplanner.model.CashflowResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CashflowCalculationService {

    @Autowired
    private ClientIncomeRepository clientIncomeRepository;

    @Autowired
    private ClientExpenseRepository clientExpenseRepository;

    @Autowired
    private CashflowGoalRepository cashflowGoalRepository;

    @Autowired
    private PortfolioService portfolioService;

    public CashflowResult calculateCashflow(Integer clientId) {
        List<ClientIncome> incomes = clientIncomeRepository.findById_ClientId(clientId);
        List<ClientExpense> expenses = clientExpenseRepository.findById_ClientId(clientId);
        List<CashflowGoal> goals = cashflowGoalRepository.findById_ClientId(clientId);

        CashflowResult result = new CashflowResult();

        for (int year = 1; year <= 5; year++) {
            List<Map<String, BigDecimal>> incomeDetails = calculateYearlyIncome(incomes, year);
            List<Map<String, BigDecimal>> expenseDetails = calculateYearlyExpense(expenses, year);

            BigDecimal portfolioReturn = portfolioService.calculatePortfolioSummary(clientId).getPortfolioReturn();

            List<Map<String, BigDecimal>> goalPayments = new ArrayList<>();
            boolean paymentMade = false;

            for (CashflowGoal goal : goals) {
                BigDecimal payment = BigDecimal.ZERO;

                BigDecimal clientGoalValue = BigDecimal.valueOf(goal.getClientGoalValue());
                BigDecimal clientSavingGrowth = BigDecimal.valueOf(goal.getClientSavingGrowth());
                int clientGoalPeriod = goal.getClientGoalPeriod();

                if (year <= goal.getClientGoalPeriod()) {
                    payment = clientGoalValue.multiply(portfolioReturn.subtract(clientSavingGrowth))
                            .divide(BigDecimal.ONE.add(portfolioReturn).pow(clientGoalPeriod)
                                    .subtract(BigDecimal.ONE.add(clientSavingGrowth).pow(clientGoalPeriod)),
                                    RoundingMode.HALF_UP);
                    paymentMade = true;
                }
                Map<String, BigDecimal> goalMap = new HashMap<>();
                goalMap.put(goal.getId().getClientGoalName(), payment.setScale(2, RoundingMode.HALF_UP));
                goalPayments.add(goalMap);
            }

            if (!paymentMade) {
                Map<String, BigDecimal> zeroPayment = new HashMap<>();
                zeroPayment.put("No Payments", BigDecimal.ZERO);
                goalPayments.add(zeroPayment);
            }

            BigDecimal totalIncome = incomeDetails.stream()
                    .map(income -> income.values().iterator().next())
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal totalExpense = expenseDetails.stream()
                    .map(expense -> expense.values().iterator().next())
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal netIncome = totalIncome.subtract(totalExpense);

            BigDecimal totalGoalPayments = goalPayments.stream()
                    .map(g -> g.values().iterator().next())
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal netIncomeAfterGoals = netIncome.subtract(totalGoalPayments);

            result.addYearlyData(year, totalIncome, totalExpense, netIncome, netIncomeAfterGoals,
                    goalPayments, incomeDetails, expenseDetails);
        }

        return result;
    }

    private List<Map<String, BigDecimal>> calculateYearlyIncome(List<ClientIncome> incomes, int year) {
        List<Map<String, BigDecimal>> incomeDetails = new ArrayList<>();
        for (ClientIncome income : incomes) {
            BigDecimal amount = BigDecimal.valueOf(income.getClientIncomeAmount());
            if (income.getClientIncomeFrequency().equals("ทุกเดือน")) {
                amount = amount.multiply(BigDecimal.valueOf(12));
            }
            for (int y = 1; y < year; y++) {
                amount = amount
                        .multiply(BigDecimal.ONE.add(BigDecimal.valueOf(income.getClientIncomeAnnualGrowthRate())));
            }
            Map<String, BigDecimal> incomeMap = new HashMap<>();
            incomeMap.put(income.getId().getClientIncomeName(), amount.setScale(2, RoundingMode.HALF_UP));
            incomeDetails.add(incomeMap);
        }
        return incomeDetails;
    }

    private List<Map<String, BigDecimal>> calculateYearlyExpense(List<ClientExpense> expenses, int year) {
        List<Map<String, BigDecimal>> expenseDetails = new ArrayList<>();
        for (ClientExpense expense : expenses) {
            BigDecimal amount = BigDecimal.valueOf(expense.getClientExpenseAmount());
            if (expense.getClientExpenseFrequency().equals("ทุกเดือน")) {
                amount = amount.multiply(BigDecimal.valueOf(12));
            }
            for (int y = 1; y < year; y++) {
                amount = amount
                        .multiply(BigDecimal.ONE.add(BigDecimal.valueOf(expense.getClientExpenseAnnualGrowthRate())));
            }
            Map<String, BigDecimal> expenseMap = new HashMap<>();
            expenseMap.put(expense.getId().getClientExpenseName(), amount.setScale(2, RoundingMode.HALF_UP));
            expenseDetails.add(expenseMap);
        }
        return expenseDetails;
    }
}
