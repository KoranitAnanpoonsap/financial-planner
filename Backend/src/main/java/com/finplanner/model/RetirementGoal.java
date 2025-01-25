package com.finplanner.model;

import java.util.UUID;

import jakarta.persistence.*;

@Entity
@Table(name = "retirement_goal") // Table name in the database
public class RetirementGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "retirement_goal_id", insertable = false, updatable = false)
    private Integer reitrementGoalId;

    @Column(name = "client_uuid", columnDefinition = "uuid")
    private UUID clientUuid; // This matches ClientInfo's uuid

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

    public Integer getRetirementGoalId() {
        return reitrementGoalId;
    }

    public void setRetirementGoalId(Integer reitrementGoalId) {
        this.reitrementGoalId = reitrementGoalId;
    }

    public UUID getClientUuid() {
        return clientUuid;
    }

    public void setClientUuid(UUID clientUuid) {
        this.clientUuid = clientUuid;
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
