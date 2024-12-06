package com.finplanner.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ClientExpenseId implements Serializable {

    @Column(name = "client_id")
    private Integer clientId;

    @Column(name = "client_expense_name", length = 100)
    private String clientExpenseName;

    // Default constructor
    public ClientExpenseId() {
    }

    // Parameterized constructor
    public ClientExpenseId(Integer clientId, String clientExpenseName) {
        this.clientId = clientId;
        this.clientExpenseName = clientExpenseName;
    }

    // Getters and Setters
    public Integer getClientId() {
        return clientId;
    }

    public void setClientId(Integer clientId) {
        this.clientId = clientId;
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
        return Objects.equals(clientId, that.clientId) &&
                Objects.equals(clientExpenseName, that.clientExpenseName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(clientId, clientExpenseName);
    }
}
