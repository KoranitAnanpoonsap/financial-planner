package com.finplanner.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tax_plan") // Table name in the database
public class TaxPlan {

    @Id
    private Integer clientId; // This matches ClientInfo's primary key

    @MapsId("clientId") // This tells JPA that clientId in TaxPlan maps to ClientInfo's primary key
    @OneToOne
    @JoinColumn(name = "client_id", referencedColumnName = "client_id")
    private ClientInfo clientInfo;

    @Column(name = "invest_rmf")
    private Integer investRmf;

    @Column(name = "invest_ssf")
    private Integer investSsf;

    @Column(name = "invest_gov_pension_fund")
    private Integer investGovPensionFund;

    @Column(name = "invest_pvd")
    private Integer investPvd;

    @Column(name = "invest_nation_savings_fund")
    private Integer investNationSavingsFund;

    @Column(name = "invest_pension_insurance")
    private Integer investPensionInsurance;

    // Getters and Setters

    public Integer getClientId() {
        return clientId;
    }

    public void setClientId(Integer clientId) {
        this.clientId = clientId;
    }

    public Integer getInvestRmf() {
        return investRmf;
    }

    public void setInvestRmf(Integer investRmf) {
        this.investRmf = investRmf;
    }

    public Integer getInvestSsf() {
        return investSsf;
    }

    public void setInvestSsf(Integer investSsf) {
        this.investSsf = investSsf;
    }

    public Integer getInvestGovPensionFund() {
        return investGovPensionFund;
    }

    public void setInvestGovPensionFund(Integer investGovPensionFund) {
        this.investGovPensionFund = investGovPensionFund;
    }

    public Integer getInvestPvd() {
        return investPvd;
    }

    public void setInvestPvd(Integer investPvd) {
        this.investPvd = investPvd;
    }

    public Integer getInvestNationSavingsFund() {
        return investNationSavingsFund;
    }

    public void setInvestNationSavingsFund(Integer investNationSavingsFund) {
        this.investNationSavingsFund = investNationSavingsFund;
    }

    public Integer getInvestPensionInsurance() {
        return investPensionInsurance;
    }

    public void setInvestPensionInsurance(Integer investPensionInsurance) {
        this.investPensionInsurance = investPensionInsurance;
    }
}
