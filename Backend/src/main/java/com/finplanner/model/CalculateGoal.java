package com.finplanner.model;

import java.util.UUID;

import jakarta.persistence.*;

@Entity
@Table(name = "calculate_goal") // Table name in the database
public class CalculateGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "calculate_goal_id", insertable = false, updatable = false)
    private Integer calculateGoalId;

    @Column(name = "client_uuid", columnDefinition = "uuid")
    private UUID clientUuid; // This matches ClientInfo's uuid

    @Column(name = "goal_name", length = 100)
    private String goalName;

    @Column(name = "goal_value")
    private Integer goalValue;

    @Column(name = "goal_period")
    private Integer goalPeriod;

    @Column(name = "net_income")
    private Integer netIncome;

    @Column(name = "net_income_growth")
    private Float netIncomeGrowth;

    @Column(name = "port_return")
    private Float portReturn;

    @Column(name = "total_investment")
    private Integer totalInvestment;

    // Getters and Setters

    public Integer getCalculateGoalId() {
        return calculateGoalId;
    }

    public void setCalculateGoalId(Integer calculateGoalId) {
        this.calculateGoalId = calculateGoalId;
    }

    public UUID getClientUuid() {
        return clientUuid;
    }

    public void setClientUuid(UUID clientUuid) {
        this.clientUuid = clientUuid;
    }

    public String getGoalName() {
        return goalName;
    }

    public void setGoalName(String goalName) {
        this.goalName = goalName;
    }

    public Integer getGoalValue() {
        return goalValue;
    }

    public void setGoalValue(Integer goalValue) {
        this.goalValue = goalValue;
    }

    public Integer getGoalPeriod() {
        return goalPeriod;
    }

    public void setGoalPeriod(Integer goalPeriod) {
        this.goalPeriod = goalPeriod;
    }

    public Integer getNetIncome() {
        return netIncome;
    }

    public void setNetIncome(Integer netIncome) {
        this.netIncome = netIncome;
    }

    public Float getNetIncomeGrowth() {
        return netIncomeGrowth;
    }

    public void setNetIncomeGrowth(Float netIncomeGrowth) {
        this.netIncomeGrowth = netIncomeGrowth;
    }

    public Float getPortReturn() {
        return portReturn;
    }

    public void setPortReturn(Float portReturn) {
        this.portReturn = portReturn;
    }

    public Integer getTotalInvestment() {
        return totalInvestment;
    }

    public void setTotalInvestment(Integer totalInvestment) {
        this.totalInvestment = totalInvestment;
    }
}
