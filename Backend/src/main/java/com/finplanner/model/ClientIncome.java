package com.finplanner.model;

import java.util.UUID;

import jakarta.persistence.*;

@Entity
@Table(name = "client_income")
public class ClientIncome {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "client_income_id", insertable = false, updatable = false)
    private Integer clientIncomeId;

    @Column(name = "client_uuid", nullable = false)
    private UUID clientUuid;

    @Column(name = "client_income_name", length = 100, nullable = false)
    private String clientIncomeName;

    @Column(name = "client_income_type", nullable = false)
    private Integer clientIncomeType;

    @Column(name = "client_income_frequency", nullable = false)
    private Integer clientIncomeFrequency;

    @Column(name = "client_income_amount", nullable = false)
    private Integer clientIncomeAmount;

    @Column(name = "client_income_annual_growth_rate", nullable = false)
    private Float clientIncomeAnnualGrowthRate;

    @Column(name = "client_income_405_type", nullable = true)
    private Integer clientIncome405Type;

    @Column(name = "client_income_406_type", nullable = true)
    private Integer clientIncome406Type;

    @Column(name = "client_income_408_type", nullable = true)
    private Integer clientIncome408Type;

    @Column(name = "client_income_408_type_other_expense_deduction", nullable = true)
    private Integer clientIncome408TypeOtherExpenseDeduction;

    // Getters and Setters for all fields

    public Integer getClientIncomeId() {
        return clientIncomeId;
    }

    public void setClientIncomeId(Integer clientIncomeId) {
        this.clientIncomeId = clientIncomeId;
    }

    public UUID getClientUuid() {
        return clientUuid;
    }

    public void setClientUuid(UUID clientUuid) {
        this.clientUuid = clientUuid;
    }

    public String getClientIncomeName() {
        return clientIncomeName;
    }

    public void setClientIncomeName(String clientIncomeName) {
        this.clientIncomeName = clientIncomeName;
    }

    public Integer getClientIncomeType() {
        return clientIncomeType;
    }

    public void setClientIncomeType(Integer clientIncomeType) {
        this.clientIncomeType = clientIncomeType;
    }

    public Integer getClientIncomeFrequency() {
        return clientIncomeFrequency;
    }

    public void setClientIncomeFrequency(Integer clientIncomeFrequency) {
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

    public Integer getClientIncome405Type() {
        return clientIncome405Type;
    }

    public void setClientIncome405Type(Integer clientIncome405Type) {
        this.clientIncome405Type = clientIncome405Type;
    }

    public Integer getClientIncome406Type() {
        return clientIncome406Type;
    }

    public void setClientIncome406Type(Integer clientIncome406Type) {
        this.clientIncome406Type = clientIncome406Type;
    }

    public Integer getClientIncome408Type() {
        return clientIncome408Type;
    }

    public void setClientIncome408Type(Integer clientIncome408Type) {
        this.clientIncome408Type = clientIncome408Type;
    }

    public Integer getClientIncome408TypeOtherExpenseDeduction() {
        return clientIncome408TypeOtherExpenseDeduction;
    }

    public void setClientIncome408TypeOtherExpenseDeduction(Integer clientIncome408TypeOtherExpenseDeduction) {
        this.clientIncome408TypeOtherExpenseDeduction = clientIncome408TypeOtherExpenseDeduction;
    }
}
