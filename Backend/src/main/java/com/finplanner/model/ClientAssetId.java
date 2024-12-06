package com.finplanner.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ClientAssetId implements Serializable {

    @Column(name = "client_id")
    private Integer clientId;

    @Column(name = "client_asset_name", length = 100)
    private String clientAssetName;

    // Default constructor
    public ClientAssetId() {
    }

    // Parameterized constructor
    public ClientAssetId(Integer clientId, String clientAssetName) {
        this.clientId = clientId;
        this.clientAssetName = clientAssetName;
    }

    // Getters and Setters
    public Integer getClientId() {
        return clientId;
    }

    public void setClientId(Integer clientId) {
        this.clientId = clientId;
    }

    public String getClientAssetName() {
        return clientAssetName;
    }

    public void setClientAssetName(String clientAssetName) {
        this.clientAssetName = clientAssetName;
    }

    // Override equals() and hashCode()
    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        ClientAssetId that = (ClientAssetId) o;
        return Objects.equals(clientId, that.clientId) &&
                Objects.equals(clientAssetName, that.clientAssetName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(clientId, clientAssetName);
    }
}
