package com.finplanner.service;

import com.finplanner.model.ClientIncome;
import com.finplanner.model.TaxDeduction;
import com.finplanner.repository.ClientIncomeRepository;
import com.finplanner.repository.TaxDeductionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TaxCalculationService {

    @Autowired
    private ClientIncomeRepository clientIncomeRepository;

    @Autowired
    private TaxDeductionRepository taxDeductionRepository;

    public TaxCalculationResult calculateTaxForClient(Integer clientId) {
        // 1. Get all incomes for client
        List<ClientIncome> incomes = clientIncomeRepository.findById_ClientId(clientId);

        // Adjust income amounts: if frequency == "ทุกเดือน", multiply by 12
        // We'll create a helper method to get the yearly amount:
        List<ClientIncome> adjustedIncomes = incomes.stream().map(this::adjustIncomeToYearly).toList();

        // Calculate total income
        BigDecimal totalIncome = adjustedIncomes.stream()
                .map(i -> BigDecimal.valueOf(i.getClientIncomeAmount()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Group by type
        Map<String, BigDecimal> incomeByType = adjustedIncomes.stream()
                .collect(Collectors.groupingBy(
                        ClientIncome::getClientIncomeType,
                        Collectors.mapping(i -> BigDecimal.valueOf(i.getClientIncomeAmount()),
                                Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))));

        // 2. Calculate Expense Deductions based on rules
        BigDecimal totalExpenseDeductions = BigDecimal.ZERO;
        for (Map.Entry<String, BigDecimal> entry : incomeByType.entrySet()) {
            String type = entry.getKey();
            BigDecimal sumAmount = entry.getValue();

            BigDecimal deduction;
            switch (type) {
                case "เงินเดือน":
                case "รับจ้างทำงาน":
                    // 50% capped at 100,000
                    deduction = sumAmount.multiply(BigDecimal.valueOf(0.5));
                    if (deduction.compareTo(BigDecimal.valueOf(100000)) > 0) {
                        deduction = BigDecimal.valueOf(100000);
                    }
                    break;
                case "ค่าเสียสิทธิ ลิขสิทธิ์":
                    // 50% capped at 100,000
                    deduction = sumAmount.multiply(BigDecimal.valueOf(0.5));
                    if (deduction.compareTo(BigDecimal.valueOf(100000)) > 0) {
                        deduction = BigDecimal.valueOf(100000);
                    }
                    break;
                case "ดอกเบี้ย เงินปันผล":
                    // 0%
                    deduction = BigDecimal.ZERO;
                    break;
                case "ค่าเช่าทรัพย์สิน":
                    // 20%
                    deduction = sumAmount.multiply(BigDecimal.valueOf(0.2));
                    break;
                case "วิชาชีพอิสระ":
                    // 45%
                    deduction = sumAmount.multiply(BigDecimal.valueOf(0.45));
                    break;
                case "รับเหมาก่อสร้าง":
                    // 60%
                    deduction = sumAmount.multiply(BigDecimal.valueOf(0.6));
                    break;
                case "รายได้อื่นๆ":
                    // 60%
                    deduction = sumAmount.multiply(BigDecimal.valueOf(0.6));
                    break;
                default:
                    // If any other type not mentioned, assume 0?
                    deduction = BigDecimal.ZERO;
                    break;
            }

            totalExpenseDeductions = totalExpenseDeductions.add(deduction);
        }

        // 3. Sum all tax deductions
        TaxDeduction td = taxDeductionRepository.findById(clientId).orElse(null);
        BigDecimal totalTaxDeductions = BigDecimal.ZERO;

        if (td != null) {
            // Marital status
            String ms = td.getMaritalStatus();
            if ("โสด".equals(ms) || "คู่สมรสมีเงินได้แยกยื่นแบบ".equals(ms)) {
                totalTaxDeductions = totalTaxDeductions.add(BigDecimal.valueOf(60000));
            } else if ("คู่สมรสมีเงินได้ยื่นรวม".equals(ms) || "คู่สมรสไม่มีเงินได้".equals(ms)) {
                totalTaxDeductions = totalTaxDeductions.add(BigDecimal.valueOf(120000));
            }

            // child = 30,000 each
            totalTaxDeductions = totalTaxDeductions.add(BigDecimal.valueOf(valueOrZeroInt(td.getChild()) * 30000L));

            // child2561 = 60,000 each
            totalTaxDeductions = totalTaxDeductions.add(BigDecimal.valueOf(valueOrZeroInt(td.getChild2561()) * 60000L));

            // adopted_child = 30,000 each
            totalTaxDeductions = totalTaxDeductions
                    .add(BigDecimal.valueOf(valueOrZeroInt(td.getAdoptedChild()) * 30000L));

            // parental_care = 30,000 each
            totalTaxDeductions = totalTaxDeductions
                    .add(BigDecimal.valueOf(valueOrZeroInt(td.getParentalCare()) * 30000L));

            // disabled_care = 60,000 each
            totalTaxDeductions = totalTaxDeductions
                    .add(BigDecimal.valueOf(valueOrZeroInt(td.getDisabledCare()) * 60000L));

            // Add all other fields directly
            // Just convert to BigDecimal and add:
            totalTaxDeductions = totalTaxDeductions.add(valueOrZeroBD(td.getPrenatalCare()));
            totalTaxDeductions = totalTaxDeductions.add(valueOrZeroBD(td.getParentHealthInsurance()));
            totalTaxDeductions = totalTaxDeductions.add(valueOrZeroBD(td.getLifeInsurance()));
            totalTaxDeductions = totalTaxDeductions.add(valueOrZeroBD(td.getHealthInsurance()));
            totalTaxDeductions = totalTaxDeductions.add(valueOrZeroBD(td.getPensionInsurance()));
            totalTaxDeductions = totalTaxDeductions.add(valueOrZeroBD(td.getSpouseNoIncomeLifeInsurance()));
            totalTaxDeductions = totalTaxDeductions.add(valueOrZeroBD(td.getRmf()));
            totalTaxDeductions = totalTaxDeductions.add(valueOrZeroBD(td.getSsf()));
            totalTaxDeductions = totalTaxDeductions.add(valueOrZeroBD(td.getGovPensionFund()));
            totalTaxDeductions = totalTaxDeductions.add(valueOrZeroBD(td.getPvd()));
            totalTaxDeductions = totalTaxDeductions.add(valueOrZeroBD(td.getNationSavingsFund()));
            totalTaxDeductions = totalTaxDeductions.add(valueOrZeroBD(td.getSocialSecurityPremium()));
            totalTaxDeductions = totalTaxDeductions.add(valueOrZeroBD(td.getSocialEnterprise()));
            totalTaxDeductions = totalTaxDeductions.add(valueOrZeroBD(td.getThaiEsg()));
            totalTaxDeductions = totalTaxDeductions.add(valueOrZeroBD(td.getGeneralDonation()));
            totalTaxDeductions = totalTaxDeductions.add(valueOrZeroBD(td.getEduDonation()));
            totalTaxDeductions = totalTaxDeductions.add(valueOrZeroBD(td.getPoliticalPartyDonation()));

            // Now ensure sum of pension_insurance, rmf, ssf, gov_pension_fund, pvd,
            // nation_savings_fund ≤ 500,000
            BigDecimal pensionGroupSum = valueOrZeroBD(td.getPensionInsurance())
                    .add(valueOrZeroBD(td.getRmf()))
                    .add(valueOrZeroBD(td.getSsf()))
                    .add(valueOrZeroBD(td.getGovPensionFund()))
                    .add(valueOrZeroBD(td.getPvd()))
                    .add(valueOrZeroBD(td.getNationSavingsFund()));

            if (pensionGroupSum.compareTo(BigDecimal.valueOf(500000)) > 0) {
                // If over 500,000, reduce totalTaxDeductions by (excess amount)
                BigDecimal excess = pensionGroupSum.subtract(BigDecimal.valueOf(500000));
                totalTaxDeductions = totalTaxDeductions.subtract(excess);
            }
        }

        // 4. income after deductions
        BigDecimal incomeAfterDeductions = totalIncome.subtract(totalExpenseDeductions).subtract(totalTaxDeductions);
        if (incomeAfterDeductions.compareTo(BigDecimal.ZERO) < 0) {
            incomeAfterDeductions = BigDecimal.ZERO;
        }

        // 5. Method 1 calculation (progressive tax)
        BigDecimal method1Tax = calculateMethod1Tax(incomeAfterDeductions);

        // 6. Method 2 calculation (if applicable)
        BigDecimal incomeNonSalary = totalIncome.subtract(incomeByType.getOrDefault("เงินเดือน", BigDecimal.ZERO));
        BigDecimal method2Tax = BigDecimal.ZERO;
        if (incomeNonSalary.compareTo(BigDecimal.valueOf(1000000)) > 0) {
            method2Tax = incomeNonSalary.multiply(BigDecimal.valueOf(0.005)); // 0.5%
        }

        BigDecimal finalTax = method1Tax;
        if (method2Tax.compareTo(BigDecimal.ZERO) > 0 && method2Tax.compareTo(method1Tax) > 0) {
            finalTax = method2Tax;
        }

        // Return the results in a DTO
        return new TaxCalculationResult(finalTax, totalIncome, incomeAfterDeductions);
    }

    private ClientIncome adjustIncomeToYearly(ClientIncome income) {
        // If frequency == "ทุกเดือน", multiply amount by 12
        if ("ทุกเดือน".equals(income.getClientIncomeFrequency())) {
            int yearlyAmount = income.getClientIncomeAmount() * 12;
            income.setClientIncomeAmount(yearlyAmount);
        }
        return income;
    }

    private BigDecimal calculateMethod1Tax(BigDecimal income) {
        double inc = income.doubleValue();
        double tax = 0;
        if (inc <= 150000) {
            tax = 0;
        } else if (inc <= 300000) {
            tax = (inc - 150000) * 0.05;
        } else if (inc <= 500000) {
            tax = 7500 + (inc - 300000) * 0.10;
        } else if (inc <= 750000) {
            tax = 27500 + (inc - 500000) * 0.15;
        } else if (inc <= 1000000) {
            tax = 65000 + (inc - 750000) * 0.20;
        } else if (inc <= 2000000) {
            tax = 115000 + (inc - 1000000) * 0.25;
        } else if (inc <= 5000000) {
            tax = 365000 + (inc - 2000000) * 0.30;
        } else {
            tax = 1265000 + (inc - 5000000) * 0.35;
        }

        return BigDecimal.valueOf(tax);
    }

    private BigDecimal valueOrZeroBD(Integer val) {
        if (val == null)
            return BigDecimal.ZERO;
        return BigDecimal.valueOf(val);
    }

    private int valueOrZeroInt(Integer val) {
        return val == null ? 0 : val;
    }

    // DTO class to hold the results
    public static class TaxCalculationResult {
        private final BigDecimal taxToPay;
        private final BigDecimal totalIncome;
        private final BigDecimal incomeAfterDeductions;

        public TaxCalculationResult(BigDecimal taxToPay, BigDecimal totalIncome, BigDecimal incomeAfterDeductions) {
            this.taxToPay = taxToPay;
            this.totalIncome = totalIncome;
            this.incomeAfterDeductions = incomeAfterDeductions;
        }

        public BigDecimal getTaxToPay() {
            return taxToPay;
        }

        public BigDecimal getTotalIncome() {
            return totalIncome;
        }

        public BigDecimal getIncomeAfterDeductions() {
            return incomeAfterDeductions;
        }
    }
}
