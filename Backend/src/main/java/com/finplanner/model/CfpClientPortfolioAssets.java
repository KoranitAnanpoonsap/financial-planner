package com.finplanner.model;

import java.util.UUID;

import jakarta.persistence.*;

@Entity
@Table(name = "cfp_client_portfolio_assets")
public class CfpClientPortfolioAssets {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cfp_client_portfolio_assets_id", insertable = false, updatable = false)
    private Integer cfpClientPortfolioAssetsId;

    @Column(name = "client_uuid", nullable = false)
    private UUID clientUuid;

    @Column(name = "invest_name", length = 100, nullable = false)
    private String investName;

    @Column(name = "invest_type", nullable = false)
    private Integer investType;

    @Column(name = "invest_amount", nullable = false)
    private Integer investAmount;

    @Column(name = "yearly_return")
    private Float yearlyReturn;

    // Getters and Setters
    public Integer getCfpClientPortfolioAssetsId() {
        return cfpClientPortfolioAssetsId;
    }

    public void setCfpClientPortfolioAssetsId(Integer cfpClientPortfolioAssetsId) {
        this.cfpClientPortfolioAssetsId = cfpClientPortfolioAssetsId;
    }

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

    public Integer getInvestType() {
        return investType;
    }

    public void setInvestType(Integer investType) {
        this.investType = investType;
    }

    public Integer getInvestAmount() {
        return investAmount;
    }

    public void setInvestAmount(Integer investAmount) {
        this.investAmount = investAmount;
    }

    public Float getYearlyReturn() {
        return yearlyReturn;
    }

    public void setYearlyReturn(Float yearlyReturn) {
        this.yearlyReturn = yearlyReturn;
    }
}
