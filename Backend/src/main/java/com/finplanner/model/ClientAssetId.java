package com.finplanner.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

@Embeddable
public class ClientAssetId implements Serializable {

    @Column(name = "client_uuid")
    @JsonProperty("clientUuid")
    private UUID clientUuid;

    @Column(name = "client_asset_name", length = 100)
    private String clientAssetName;

    // Default constructor
    public ClientAssetId() {
    }

    // Parameterized constructor
    public ClientAssetId(UUID clientUuid, String clientAssetName) {
        this.clientUuid = clientUuid;
        this.clientAssetName = clientAssetName;
    }

    // Getters and Setters
    public UUID getClientUuid() {
        return clientUuid;
    }

    public void setClientUuid(UUID clientUuid) {
        this.clientUuid = clientUuid;
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
        return Objects.equals(clientUuid, that.clientUuid) &&
                Objects.equals(clientAssetName, that.clientAssetName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(clientUuid, clientAssetName);
    }
}
