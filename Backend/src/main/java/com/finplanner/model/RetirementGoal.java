package com.finplanner.model;

import jakarta.persistence.*;

@Entity
@Table(name = "retirement_goal") // Table name in the database
public class RetirementGoal {

    @Id
    private Integer clientId; // This matches ClientInfo's primary key

    @MapsId("clientId") // This tells JPA that clientId in TaxPlan maps to ClientInfo's primary key
    @OneToOne
    @JoinColumn(name = "client_id", referencedColumnName = "client_id")
    private ClientInfo clientInfo;

    @Column(name = "client_current_age", nullable = false)
    private Integer clientCurrentAge;

    @Column(name = "client_retirement_age", nullable = false)
    private Integer clientRetirementAge;

    @Column(name = "client_life_expectancy", nullable = false)
    private Integer clientLifeExpectancy;

    @Column(name = "client_current_yearly_expense", nullable = false)
    private Integer clientCurrentYearlyExpense;

    @Column(name = "client_expected_retired_port_return", nullable = false)
    private Float clientExpectedRetiredPortReturn;

    @Column(name = "inflation_rate", nullable = false)
    private Float inflationRate;

    @Column(name = "client_retired_expense_portion", nullable = false)
    private Float clientRetiredExpensePortion;

    // Getters and Setters

    public Integer getClientId() {
        return clientId;
    }

    public void setClientId(Integer clientId) {
        this.clientId = clientId;
    }

    public Integer getClientCurrentAge() {
        return clientCurrentAge;
    }

    public void setClientCurrentAge(Integer clientCurrentAge) {
        this.clientCurrentAge = clientCurrentAge;
    }

    public Integer getClientRetirementAge() {
        return clientRetirementAge;
    }

    public void setClientRetirementAge(Integer clientRetirementAge) {
        this.clientRetirementAge = clientRetirementAge;
    }

    public Integer getClientLifeExpectancy() {
        return clientLifeExpectancy;
    }

    public void setClientLifeExpectancy(Integer clientLifeExpectancy) {
        this.clientLifeExpectancy = clientLifeExpectancy;
    }

    public Integer getClientCurrentYearlyExpense() {
        return clientCurrentYearlyExpense;
    }

    public void setClientCurrentYearlyExpense(Integer clientCurrentYearlyExpense) {
        this.clientCurrentYearlyExpense = clientCurrentYearlyExpense;
    }

    public Float getClientExpectedRetiredPortReturn() {
        return clientExpectedRetiredPortReturn;
    }

    public void setClientExpectedRetiredPortReturn(Float clientExpectedRetiredPortReturn) {
        this.clientExpectedRetiredPortReturn = clientExpectedRetiredPortReturn;
    }

    public Float getInflationRate() {
        return inflationRate;
    }

    public void setInflationRate(Float inflationRate) {
        this.inflationRate = inflationRate;
    }

    public Float getClientRetiredExpensePortion() {
        return clientRetiredExpensePortion;
    }

    public void setClientRetiredExpensePortion(Float clientRetiredExpensePortion) {
        this.clientRetiredExpensePortion = clientRetiredExpensePortion;
    }
}
