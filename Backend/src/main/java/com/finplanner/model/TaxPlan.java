package com.finplanner.model;

import java.util.UUID;

import jakarta.persistence.*;

@Entity
@Table(name = "tax_plan") // Table name in the database
public class TaxPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tax_plan_id", insertable = false, updatable = false)
    private Integer taxPlanId;

    @Column(name = "client_uuid", columnDefinition = "uuid")
    private UUID clientUuid; // This matches ClientInfo's uuid

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

    public Integer getTaxPlanId() {
        return taxPlanId;
    }

    public void setTaxPlanId(Integer taxPlanId) {
        this.taxPlanId = taxPlanId;
    }

    public UUID getClientUuid() {
        return clientUuid;
    }

    public void setClientUuid(UUID clientUuid) {
        this.clientUuid = clientUuid;
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
