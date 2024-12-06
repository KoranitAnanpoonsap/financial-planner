package com.finplanner.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class CashflowResult {
    private List<YearlyData> yearlyData;

    public CashflowResult() {
        this.yearlyData = new ArrayList<>();
    }

    public void addYearlyData(int year, BigDecimal totalIncome, BigDecimal totalExpense, BigDecimal netIncome,
            BigDecimal netIncomeAfterGoals,
            List<Map<String, BigDecimal>> goalPayments, List<Map<String, BigDecimal>> incomeDetails,
            List<Map<String, BigDecimal>> expenseDetails) {
        yearlyData.add(new YearlyData(year, totalIncome, totalExpense, netIncome, netIncomeAfterGoals, goalPayments,
                incomeDetails, expenseDetails));
    }

    public List<YearlyData> getYearlyData() {
        return yearlyData;
    }

    public static class YearlyData {
        private int year;
        private BigDecimal totalIncome;
        private BigDecimal totalExpense;
        private BigDecimal netIncome;
        private BigDecimal netIncomeAfterGoals;
        private List<Map<String, BigDecimal>> goalPayments;
        private List<Map<String, BigDecimal>> incomeDetails;
        private List<Map<String, BigDecimal>> expenseDetails;

        public YearlyData(int year, BigDecimal totalIncome, BigDecimal totalExpense, BigDecimal netIncome,
                BigDecimal netIncomeAfterGoals, List<Map<String, BigDecimal>> goalPayments,
                List<Map<String, BigDecimal>> incomeDetails, List<Map<String, BigDecimal>> expenseDetails) {
            this.year = year;
            this.totalIncome = totalIncome;
            this.totalExpense = totalExpense;
            this.netIncome = netIncome;
            this.netIncomeAfterGoals = netIncomeAfterGoals;
            this.goalPayments = goalPayments;
            this.incomeDetails = incomeDetails;
            this.expenseDetails = expenseDetails;
        }

        public int getYear() {
            return year;
        }

        public BigDecimal getTotalIncome() {
            return totalIncome;
        }

        public BigDecimal getTotalExpense() {
            return totalExpense;
        }

        public BigDecimal getNetIncome() {
            return netIncome;
        }

        public BigDecimal getNetIncomeAfterGoals() {
            return netIncomeAfterGoals;
        }

        public List<Map<String, BigDecimal>> getGoalPayments() {
            return goalPayments;
        }

        public List<Map<String, BigDecimal>> getIncomeDetails() {
            return incomeDetails;
        }

        public List<Map<String, BigDecimal>> getExpenseDetails() {
            return expenseDetails;
        }
    }
}
