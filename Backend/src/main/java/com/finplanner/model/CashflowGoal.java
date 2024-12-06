package com.finplanner.model;

import jakarta.persistence.*;

@Entity
@Table(name = "cashflow_goal")
public class CashflowGoal {

    @EmbeddedId
    private CashflowGoalId id;

    @Column(name = "client_goal_period", nullable = false)
    private Integer clientGoalPeriod;

    @Column(name = "client_saving_growth", nullable = false)
    private Float clientSavingGrowth;

    @Column(name = "client_goal_value", nullable = false)
    private Integer clientGoalValue;

    // Getters and Setters

    public CashflowGoalId getId() {
        return id;
    }

    public void setId(CashflowGoalId id) {
        this.id = id;
    }

    public Integer getClientGoalPeriod() {
        return clientGoalPeriod;
    }

    public void setClientGoalPeriod(Integer clientGoalPeriod) {
        this.clientGoalPeriod = clientGoalPeriod;
    }

    public Float getClientSavingGrowth() {
        return clientSavingGrowth;
    }

    public void setClientSavingGrowth(Float clientSavingGrowth) {
        this.clientSavingGrowth = clientSavingGrowth;
    }

    public Integer getClientGoalValue() {
        return clientGoalValue;
    }

    public void setClientGoalValue(Integer clientGoalValue) {
        this.clientGoalValue = clientGoalValue;
    }
}
