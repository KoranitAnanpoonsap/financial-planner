package com.finplanner.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

@Embeddable
public class ClientDebtId implements Serializable {

    @Column(name = "client_uuid")
    @JsonProperty("clientUuid")
    private UUID clientUuid;

    @Column(name = "client_debt_name", length = 100)
    private String clientDebtName;

    // Default constructor
    public ClientDebtId() {
    }

    // Parameterized constructor
    public ClientDebtId(UUID clientUuid, String clientDebtName) {
        this.clientUuid = clientUuid;
        this.clientDebtName = clientDebtName;
    }

    // Getters and Setters
    public UUID getClientUuid() {
        return clientUuid;
    }

    public void setClientUuid(UUID clientUuid) {
        this.clientUuid = clientUuid;
    }

    public String getClientDebtName() {
        return clientDebtName;
    }

    public void setClientDebtName(String clientDebtName) {
        this.clientDebtName = clientDebtName;
    }

    // Override equals() and hashCode()
    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        ClientDebtId that = (ClientDebtId) o;
        return Objects.equals(clientUuid, that.clientUuid) &&
                Objects.equals(clientDebtName, that.clientDebtName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(clientUuid, clientDebtName);
    }
}
