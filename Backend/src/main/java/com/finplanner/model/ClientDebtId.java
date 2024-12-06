package com.finplanner.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ClientDebtId implements Serializable {

    @Column(name = "client_id")
    private Integer clientId;

    @Column(name = "client_debt_name", length = 100)
    private String clientDebtName;

    // Default constructor
    public ClientDebtId() {
    }

    // Parameterized constructor
    public ClientDebtId(Integer clientId, String clientDebtName) {
        this.clientId = clientId;
        this.clientDebtName = clientDebtName;
    }

    // Getters and Setters
    public Integer getClientId() {
        return clientId;
    }

    public void setClientId(Integer clientId) {
        this.clientId = clientId;
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
        return Objects.equals(clientId, that.clientId) &&
                Objects.equals(clientDebtName, that.clientDebtName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(clientId, clientDebtName);
    }
}
