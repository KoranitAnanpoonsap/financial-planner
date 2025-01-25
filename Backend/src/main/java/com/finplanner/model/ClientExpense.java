package com.finplanner.model;

import java.util.UUID;

import jakarta.persistence.*;

@Entity
@Table(name = "client_expense")
public class ClientExpense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "client_expense_id", insertable = false, updatable = false)
    private Integer clientExpenseId;

    @Column(name = "client_uuid", nullable = false)
    private UUID clientUuid;

    @Column(name = "client_expense_name", length = 100, nullable = false)
    private String clientExpenseName;

    @Column(name = "client_expense_type", nullable = false)
    private Integer clientExpenseType;

    @Column(name = "client_expense_frequency", nullable = false)
    private Integer clientExpenseFrequency;

    @Column(name = "client_expense_amount", nullable = false)
    private Integer clientExpenseAmount;

    @Column(name = "client_expense_annual_growth_rate", nullable = false)
    private Float clientExpenseAnnualGrowthRate;

    @Column(name = "client_debt_expense", nullable = false)
    private Boolean clientDebtExpense;

    @Column(name = "client_nonmortgage_debt_expense", nullable = false)
    private Boolean clientNonMortgageDebtExpense;

    @Column(name = "client_saving_expense", nullable = false)
    private Boolean clientSavingExpense;

    // Getters and Setters
    public Integer getClientExpenseId() {
        return clientExpenseId;
    }

    public void setClienExpenseId(Integer clientExpenseId) {
        this.clientExpenseId = clientExpenseId;
    }

    public UUID getClientUuid() {
        return clientUuid;
    }

    public void setClientUuid(UUID clientUuid) {
        this.clientUuid = clientUuid;
    }

    public String getClientExpenseName() {
        return clientExpenseName;
    }

    public void setClientExpenseName(String clientExpenseName) {
        this.clientExpenseName = clientExpenseName;
    }

    public Integer getClientExpenseType() {
        return clientExpenseType;
    }

    public void setClientExpenseType(Integer clientExpenseType) {
        this.clientExpenseType = clientExpenseType;
    }

    public Integer getClientExpenseFrequency() {
        return clientExpenseFrequency;
    }

    public void setClientExpenseFrequency(Integer clientExpenseFrequency) {
        this.clientExpenseFrequency = clientExpenseFrequency;
    }

    public Integer getClientExpenseAmount() {
        return clientExpenseAmount;
    }

    public void setClientExpenseAmount(Integer clientExpenseAmount) {
        this.clientExpenseAmount = clientExpenseAmount;
    }

    public Float getClientExpenseAnnualGrowthRate() {
        return clientExpenseAnnualGrowthRate;
    }

    public void setClientExpenseAnnualGrowthRate(Float clientExpenseAnnualGrowthRate) {
        this.clientExpenseAnnualGrowthRate = clientExpenseAnnualGrowthRate;
    }

    public Boolean getClientDebtExpense() {
        return clientDebtExpense;
    }

    public void setClientDebtExpense(Boolean clientDebtExpense) {
        this.clientDebtExpense = clientDebtExpense;
    }

    public Boolean getClientNonMortgageDebtExpense() {
        return clientNonMortgageDebtExpense;
    }

    public void setClientNonMortgageDebtExpense(Boolean clientNonMortgageDebtExpense) {
        this.clientNonMortgageDebtExpense = clientNonMortgageDebtExpense;
    }

    public Boolean getClientSavingExpense() {
        return clientSavingExpense;
    }

    public void setClientSavingExpense(Boolean clientSavingExpense) {
        this.clientSavingExpense = clientSavingExpense;
    }
}
