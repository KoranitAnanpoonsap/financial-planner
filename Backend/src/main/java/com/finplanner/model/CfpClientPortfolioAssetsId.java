package com.finplanner.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

@Embeddable
public class CfpClientPortfolioAssetsId implements Serializable {

    @Column(name = "client_uuid")
    @JsonProperty("clientUuid")
    private UUID clientUuid;

    @Column(name = "invest_name", length = 100)
    private String investName;

    // Default constructor
    public CfpClientPortfolioAssetsId() {
    }

    // Parameterized constructor
    public CfpClientPortfolioAssetsId(UUID clientUuid, String investName) {
        this.clientUuid = clientUuid;
        this.investName = investName;
    }

    // Getters and Setters
    public UUID getClientUuid() {
        return clientUuid;
    }

    public void setClientUuid(UUID clientUuid) {
        this.clientUuid = clientUuid;
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
        return Objects.equals(clientUuid, that.clientUuid) &&
                Objects.equals(investName, that.investName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(clientUuid, investName);
    }
}
