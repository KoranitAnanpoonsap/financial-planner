package com.finplanner.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ClientIncomeId implements Serializable {

    @Column(name = "client_id")
    private Integer clientId;

    @Column(name = "client_income_name", length = 100)
    private String clientIncomeName;

    // Constructors
    public ClientIncomeId() {
    }

    public ClientIncomeId(String clientIncomeName, Integer clientId) {
        this.clientIncomeName = clientIncomeName;
        this.clientId = clientId;
    }

    // Getters and Setters
    public String getClientIncomeName() {
        return clientIncomeName;
    }

    public void setClientIncomeName(String clientIncomeName) {
        this.clientIncomeName = clientIncomeName;
    }

    public Integer getClientId() {
        return clientId;
    }

    public void setClientId(Integer clientId) {
        this.clientId = clientId;
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
                Objects.equals(clientId, that.clientId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(clientIncomeName, clientId);
    }
}
