package com.finplanner.model;

import jakarta.persistence.*;

@Entity
@Table(name = "client_expense")
public class ClientExpense {

    @EmbeddedId
    private ClientExpenseId id;

    @Column(name = "client_expense_type", nullable = false, length = 20)
    private String clientExpenseType;

    @Column(name = "client_expense_frequency", nullable = false, length = 20)
    private String clientExpenseFrequency;

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
    public ClientExpenseId getId() {
        return id;
    }

    public void setId(ClientExpenseId id) {
        this.id = id;
    }

    public String getClientExpenseType() {
        return clientExpenseType;
    }

    public void setClientExpenseType(String clientExpenseType) {
        this.clientExpenseType = clientExpenseType;
    }

    public String getClientExpenseFrequency() {
        return clientExpenseFrequency;
    }

    public void setClientExpenseFrequency(String clientExpenseFrequency) {
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
