package com.finplanner.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "client_assets")
public class ClientAssets {

    @EmbeddedId
    private ClientAssetId id;

    @Column(name = "client_asset_type", nullable = false, length = 25)
    private String clientAssetType;

    @Column(name = "client_asset_amount", nullable = false)
    private Integer clientAssetAmount;

    @Column(name = "client_asset_buy_date")
    private LocalDate clientAssetBuyDate;

    @Column(name = "client_asset_invest_type", length = 20)
    private String clientAssetInvestType;

    @Column(name = "client_asset_invest_risk", length = 20)
    private String clientAssetInvestRisk;

    // Getters and Setters
    public ClientAssetId getId() {
        return id;
    }

    public void setId(ClientAssetId id) {
        this.id = id;
    }

    public String getClientAssetType() {
        return clientAssetType;
    }

    public void setClientAssetType(String clientAssetType) {
        this.clientAssetType = clientAssetType;
    }

    public Integer getClientAssetAmount() {
        return clientAssetAmount;
    }

    public void setClientAssetAmount(Integer clientAssetAmount) {
        this.clientAssetAmount = clientAssetAmount;
    }

    public LocalDate getClientAssetBuyDate() {
        return clientAssetBuyDate;
    }

    public void setClientAssetBuyDate(LocalDate clientAssetBuyDate) {
        this.clientAssetBuyDate = clientAssetBuyDate;
    }

    public String getClientAssetInvestType() {
        return clientAssetInvestType;
    }

    public void setClientAssetInvestType(String clientAssetInvestType) {
        this.clientAssetInvestType = clientAssetInvestType;
    }

    public String getClientAssetInvestRisk() {
        return clientAssetInvestRisk;
    }

    public void setClientAssetInvestRisk(String clientAssetInvestRisk) {
        this.clientAssetInvestRisk = clientAssetInvestRisk;
    }
}
