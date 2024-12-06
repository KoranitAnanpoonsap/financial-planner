package com.finplanner.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class CashflowGoalId implements Serializable {

    @Column(name = "client_id")
    private Integer clientId;

    @Column(name = "client_goal_name", length = 100)
    private String clientGoalName;

    // Default constructor
    public CashflowGoalId() {
    }

    // Parameterized constructor
    public CashflowGoalId(Integer clientId, String clientGoalName) {
        this.clientId = clientId;
        this.clientGoalName = clientGoalName;
    }

    // Getters and Setters

    public Integer getClientId() {
        return clientId;
    }

    public void setClientId(Integer clientId) {
        this.clientId = clientId;
    }

    public String getClientGoalName() {
        return clientGoalName;
    }

    public void setClientGoalName(String clientGoalName) {
        this.clientGoalName = clientGoalName;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof CashflowGoalId))
            return false;
        CashflowGoalId that = (CashflowGoalId) o;
        return Objects.equals(clientId, that.clientId) &&
                Objects.equals(clientGoalName, that.clientGoalName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(clientId, clientGoalName);
    }
}
