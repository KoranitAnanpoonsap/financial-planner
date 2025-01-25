package com.finplanner.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

@Embeddable
public class CashflowGoalId implements Serializable {

    @Column(name = "client_uuid")
    @JsonProperty("clientUuid")
    private UUID clientUuid;

    @Column(name = "client_goal_name", length = 100)
    private String clientGoalName;

    // Default constructor
    public CashflowGoalId() {
    }

    // Parameterized constructor
    public CashflowGoalId(UUID clientUuid, String clientGoalName) {
        this.clientUuid = clientUuid;
        this.clientGoalName = clientGoalName;
    }

    // Getters and Setters

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

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof CashflowGoalId))
            return false;
        CashflowGoalId that = (CashflowGoalId) o;
        return Objects.equals(clientUuid, that.clientUuid) &&
                Objects.equals(clientGoalName, that.clientGoalName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(clientUuid, clientGoalName);
    }
}
