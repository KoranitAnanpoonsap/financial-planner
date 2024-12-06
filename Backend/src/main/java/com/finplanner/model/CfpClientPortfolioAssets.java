package com.finplanner.model;

import jakarta.persistence.*;

@Entity
@Table(name = "cfp_client_portfolio_assets")
public class CfpClientPortfolioAssets {

    @EmbeddedId
    private CfpClientPortfolioAssetsId id;

    @Column(name = "invest_type", nullable = false, length = 25)
    private String investType;

    @Column(name = "invest_amount", nullable = false)
    private Integer investAmount;

    @Column(name = "yearly_return")
    private Float yearlyReturn;

    // Getters and Setters
    public CfpClientPortfolioAssetsId getId() {
        return id;
    }

    public void setId(CfpClientPortfolioAssetsId id) {
        this.id = id;
    }

    public String getInvestType() {
        return investType;
    }

    public void setInvestType(String investType) {
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
