package com.finplanner.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class CfpClientPortfolioAssetsId implements Serializable {

    @Column(name = "client_id")
    private Integer clientId;

    @Column(name = "invest_name", length = 100)
    private String investName;

    // Default constructor
    public CfpClientPortfolioAssetsId() {
    }

    // Parameterized constructor
    public CfpClientPortfolioAssetsId(Integer clientId, String investName) {
        this.clientId = clientId;
        this.investName = investName;
    }

    // Getters and Setters
    public Integer getClientId() {
        return clientId;
    }

    public void setClientId(Integer clientId) {
        this.clientId = clientId;
    }

    public String getInvestName() {
        return investName;
    }

    public void setInvestName(String investName) {
        this.investName = investName;
    }

    // Override equals() and hashCode()
    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        CfpClientPortfolioAssetsId that = (CfpClientPortfolioAssetsId) o;
        return Objects.equals(clientId, that.clientId) &&
                Objects.equals(investName, that.investName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(clientId, investName);
    }
}
