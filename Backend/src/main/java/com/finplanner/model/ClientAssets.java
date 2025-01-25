package com.finplanner.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "client_assets")
public class ClientAssets {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "client_assets_id", insertable = false, updatable = false)
    private Integer clientAssetsId;

    @Column(name = "client_uuid", nullable = false)
    private UUID clientUuid;

    @Column(name = "client_asset_type", nullable = false)
    private Integer clientAssetType;

    @Column(name = "client_asset_name", length = 100, nullable = false)
    private String clientAssetName;

    @Column(name = "client_asset_amount", nullable = false)
    private Integer clientAssetAmount;

    @Column(name = "client_asset_buy_date")
    private LocalDate clientAssetBuyDate;

    @Column(name = "client_asset_invest_type")
    private Integer clientAssetInvestType;

    @Column(name = "client_asset_invest_risk")
    private Integer clientAssetInvestRisk;

    // Getters and Setters
    public Integer getClientAssetsId() {
        return clientAssetsId;
    }

    public void setClienAssetsId(Integer clientAssetsId) {
        this.clientAssetsId = clientAssetsId;
    }

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

    public Integer getClientAssetType() {
        return clientAssetType;
    }

    public void setClientAssetType(Integer clientAssetType) {
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

    public Integer getClientAssetInvestType() {
        return clientAssetInvestType;
    }

    public void setClientAssetInvestType(Integer clientAssetInvestType) {
        this.clientAssetInvestType = clientAssetInvestType;
    }

    public Integer getClientAssetInvestRisk() {
        return clientAssetInvestRisk;
    }

    public void setClientAssetInvestRisk(Integer clientAssetInvestRisk) {
        this.clientAssetInvestRisk = clientAssetInvestRisk;
    }
}
