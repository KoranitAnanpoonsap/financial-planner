package com.finplanner.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

@Embeddable
public class ClientExpenseId implements Serializable {

    @Column(name = "client_uuid")
    @JsonProperty("clientUuid")
    private UUID clientUuid;

    @Column(name = "client_expense_name", length = 100)
    private String clientExpenseName;

    // Default constructor
    public ClientExpenseId() {
    }

    // Parameterized constructor
    public ClientExpenseId(UUID clientUuid, String clientExpenseName) {
        this.clientUuid = clientUuid;
        this.clientExpenseName = clientExpenseName;
    }

    // Getters and Setters
    public UUID getClientUuid() {
        return clientUuid;
    }

    public void setClientUuid(UUID clientUuid) {
        this.clientUuid = clientUuid;
    }

    public String getClientExpenseName() {
        return clientExpenseName;
    }

    public void setClientExpenseName(String clientExpenseName) {
        this.clientExpenseName = clientExpenseName;
    }

    // Override equals() and hashCode()
    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        ClientExpenseId that = (ClientExpenseId) o;
        return Objects.equals(clientUuid, that.clientUuid) &&
                Objects.equals(clientExpenseName, that.clientExpenseName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(clientUuid, clientExpenseName);
    }
}
