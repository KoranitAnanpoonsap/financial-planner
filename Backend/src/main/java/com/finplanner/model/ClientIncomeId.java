package com.finplanner.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

@Embeddable
public class ClientIncomeId implements Serializable {

    @Column(name = "client_uuid")
    @JsonProperty("clientUuid")
    private UUID clientUuid;

    @Column(name = "client_income_name", length = 100)
    private String clientIncomeName;

    // Constructors
    public ClientIncomeId() {
    }

    public ClientIncomeId(String clientIncomeName, UUID clientUuid) {
        this.clientIncomeName = clientIncomeName;
        this.clientUuid = clientUuid;
    }

    // Getters and Setters
    public String getClientIncomeName() {
        return clientIncomeName;
    }

    public void setClientIncomeName(String clientIncomeName) {
        this.clientIncomeName = clientIncomeName;
    }

    public UUID getClientUuid() {
        return clientUuid;
    }

    public void setClientUuid(UUID clientUuid) {
        this.clientUuid = clientUuid;
    }

    // Override equals() and hashCode()
    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        ClientIncomeId that = (ClientIncomeId) o;
        return Objects.equals(clientIncomeName, that.clientIncomeName) &&
                Objects.equals(clientUuid, that.clientUuid);
    }

    @Override
    public int hashCode() {
        return Objects.hash(clientIncomeName, clientUuid);
    }
}
