package com.finplanner.model;

import jakarta.persistence.*;

@Entity
@Table(name = "client_income")
public class ClientIncome {

    @EmbeddedId
    private ClientIncomeId id;

    @Column(name = "client_income_type", length = 50, nullable = false)
    private String clientIncomeType;

    @Column(name = "client_income_frequency", length = 20, nullable = false)
    private String clientIncomeFrequency;

    @Column(name = "client_income_amount", nullable = false)
    private Integer clientIncomeAmount;

    @Column(name = "client_income_annual_growth_rate", nullable = false)
    private Float clientIncomeAnnualGrowthRate;

    @Column(name = "client_income_405_type", length = 100, nullable = true)
    private String clientIncome405Type;

    @Column(name = "client_income_406_type", length = 100, nullable = true)
    private String clientIncome406Type;

    @Column(name = "client_income_408_type", length = 100, nullable = true)
    private String clientIncome408Type;

    @Column(name = "client_income_408_type_other_expense_deduction", nullable = true)
    private Integer clientIncome408TypeOtherExpenseDeduction;

    // Getters and Setters for all fields

    public ClientIncomeId getId() {
        return id;
    }

    public void setId(ClientIncomeId id) {
        this.id = id;
    }

    public String getClientIncomeType() {
        return clientIncomeType;
    }

    public void setClientIncomeType(String clientIncomeType) {
        this.clientIncomeType = clientIncomeType;
    }

    public String getClientIncomeFrequency() {
        return clientIncomeFrequency;
    }

    public void setClientIncomeFrequency(String clientIncomeFrequency) {
        this.clientIncomeFrequency = clientIncomeFrequency;
    }

    public Integer getClientIncomeAmount() {
        return clientIncomeAmount;
    }

    public void setClientIncomeAmount(Integer clientIncomeAmount) {
        this.clientIncomeAmount = clientIncomeAmount;
    }

    public Float getClientIncomeAnnualGrowthRate() {
        return clientIncomeAnnualGrowthRate;
    }

    public void setClientIncomeAnnualGrowthRate(Float clientIncomeAnnualGrowthRate) {
        this.clientIncomeAnnualGrowthRate = clientIncomeAnnualGrowthRate;
    }

    public String getClientIncome405Type() {
        return clientIncome405Type;
    }

    public void setClientIncome405Type(String clientIncome405Type) {
        this.clientIncome405Type = clientIncome405Type;
    }

    public String getClientIncome406Type() {
        return clientIncome406Type;
    }

    public void setClientIncome406Type(String clientIncome406Type) {
        this.clientIncome406Type = clientIncome406Type;
    }

    public String getClientIncome408Type() {
        return clientIncome408Type;
    }

    public void setClientIncome408Type(String clientIncome408Type) {
        this.clientIncome408Type = clientIncome408Type;
    }

    public Integer getClientIncome408TypeOtherExpenseDeduction() {
        return clientIncome408TypeOtherExpenseDeduction;
    }

    public void setClientIncome408TypeOtherExpenseDeduction(Integer clientIncome408TypeOtherExpenseDeduction) {
        this.clientIncome408TypeOtherExpenseDeduction = clientIncome408TypeOtherExpenseDeduction;
    }
}
