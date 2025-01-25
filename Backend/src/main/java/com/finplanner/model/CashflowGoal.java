package com.finplanner.model;

import java.util.UUID;

import jakarta.persistence.*;

@Entity
@Table(name = "cashflow_goal")
public class CashflowGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cashflow_goal_id", insertable = false, updatable = false)
    private Integer cashflowGoalId;

    @Column(name = "client_uuid", nullable = false)
    private UUID clientUuid;

    @Column(name = "client_goal_name", length = 100, nullable = false)
    private String clientGoalName;

    @Column(name = "client_goal_period", nullable = false)
    private Integer clientGoalPeriod;

    @Column(name = "client_goal_value", nullable = false)
    private Integer clientGoalValue;

    // Getters and Setters

    public Integer getCashflowGoalId() {
        return cashflowGoalId;
    }

    public void setashflowGoalId(Integer cashflowGoalId) {
        this.cashflowGoalId = cashflowGoalId;
    }

    public UUID getClientUuid() {
        return clientUuid;
    }

    public void setClientUuid(UUID clientUuid) {
        this.clientUuid = clientUuid;
    }

    public String getClientGoalName() {
        return clientGoalName;
    }

    public void setClientGoalName(String clientGoalName) {
        this.clientGoalName = clientGoalName;
    }

    public Integer getClientGoalPeriod() {
        return clientGoalPeriod;
    }

    public void setClientGoalPeriod(Integer clientGoalPeriod) {
        this.clientGoalPeriod = clientGoalPeriod;
    }

    public Integer getClientGoalValue() {
        return clientGoalValue;
    }

    public void setClientGoalValue(Integer clientGoalValue) {
        this.clientGoalValue = clientGoalValue;
    }
}
