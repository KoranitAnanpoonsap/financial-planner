package com.finplanner.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tax_deduction") // Table name in the database
public class TaxDeduction {

    @Id
    private Integer clientId; // This matches ClientInfo's primary key

    @MapsId("clientId") // This tells JPA that clientId in TaxPlan maps to ClientInfo's primary key
    @OneToOne
    @JoinColumn(name = "client_id", referencedColumnName = "client_id")
    private ClientInfo clientInfo;

    @Column(name = "marital_status", length = 50)
    private String maritalStatus;

    @Column(name = "child")
    private Integer child;

    @Column(name = "child2561")
    private Integer child2561;

    @Column(name = "adopted_child")
    private Integer adoptedChild;

    @Column(name = "parental_care")
    private Integer parentalCare;

    @Column(name = "disabled_care")
    private Integer disabledCare;

    @Column(name = "prenatal_care")
    private Integer prenatalCare;

    @Column(name = "parent_health_insurance")
    private Integer parentHealthInsurance;

    @Column(name = "life_insurance")
    private Integer lifeInsurance;

    @Column(name = "health_insurance")
    private Integer healthInsurance;

    @Column(name = "pension_insurance")
    private Integer pensionInsurance;

    @Column(name = "spouse_no_income_life_insurance")
    private Integer spouseNoIncomeLifeInsurance;

    @Column(name = "rmf")
    private Integer rmf;

    @Column(name = "ssf")
    private Integer ssf;

    @Column(name = "gov_pension_fund")
    private Integer govPensionFund;

    @Column(name = "pvd")
    private Integer pvd;

    @Column(name = "nation_savings_fund")
    private Integer nationSavingsFund;

    @Column(name = "social_security_premium")
    private Integer socialSecurityPremium;

    @Column(name = "social_enterprise")
    private Integer socialEnterprise;

    @Column(name = "thai_esg")
    private Integer thaiEsg;

    @Column(name = "general_donation")
    private Integer generalDonation;

    @Column(name = "edu_donation")
    private Integer eduDonation;

    @Column(name = "political_party_donation")
    private Integer politicalPartyDonation;

    // Getters and Setters

    public Integer getClientId() {
        return clientId;
    }

    public void setClientId(Integer clientId) {
        this.clientId = clientId;
    }

    public String getMaritalStatus() {
        return maritalStatus;
    }

    public void setMaritalStatus(String maritalStatus) {
        this.maritalStatus = maritalStatus;
    }

    public Integer getChild() {
        return child;
    }

    public void setChild(Integer child) {
        this.child = child;
    }

    public Integer getChild2561() {
        return child2561;
    }

    public void setChild2561(Integer child2561) {
        this.child2561 = child2561;
    }

    public Integer getAdoptedChild() {
        return adoptedChild;
    }

    public void setAdoptedChild(Integer adoptedChild) {
        this.adoptedChild = adoptedChild;
    }

    public Integer getParentalCare() {
        return parentalCare;
    }

    public void setParentalCare(Integer parentalCare) {
        this.parentalCare = parentalCare;
    }

    public Integer getDisabledCare() {
        return disabledCare;
    }

    public void setDisabledCare(Integer disabledCare) {
        this.disabledCare = disabledCare;
    }

    public Integer getPrenatalCare() {
        return prenatalCare;
    }

    public void setPrenatalCare(Integer prenatalCare) {
        this.prenatalCare = prenatalCare;
    }

    public Integer getParentHealthInsurance() {
        return parentHealthInsurance;
    }

    public void setParentHealthInsurance(Integer parentHealthInsurance) {
        this.parentHealthInsurance = parentHealthInsurance;
    }

    public Integer getLifeInsurance() {
        return lifeInsurance;
    }

    public void setLifeInsurance(Integer lifeInsurance) {
        this.lifeInsurance = lifeInsurance;
    }

    public Integer getHealthInsurance() {
        return healthInsurance;
    }

    public void setHealthInsurance(Integer healthInsurance) {
        this.healthInsurance = healthInsurance;
    }

    public Integer getPensionInsurance() {
        return pensionInsurance;
    }

    public void setPensionInsurance(Integer pensionInsurance) {
        this.pensionInsurance = pensionInsurance;
    }

    public Integer getSpouseNoIncomeLifeInsurance() {
        return spouseNoIncomeLifeInsurance;
    }

    public void setSpouseNoIncomeLifeInsurance(Integer spouseNoIncomeLifeInsurance) {
        this.spouseNoIncomeLifeInsurance = spouseNoIncomeLifeInsurance;
    }

    public Integer getRmf() {
        return rmf;
    }

    public void setRmf(Integer rmf) {
        this.rmf = rmf;
    }

    public Integer getSsf() {
        return ssf;
    }

    public void setSsf(Integer ssf) {
        this.ssf = ssf;
    }

    public Integer getGovPensionFund() {
        return govPensionFund;
    }

    public void setGovPensionFund(Integer govPensionFund) {
        this.govPensionFund = govPensionFund;
    }

    public Integer getPvd() {
        return pvd;
    }

    public void setPvd(Integer pvd) {
        this.pvd = pvd;
    }

    public Integer getNationSavingsFund() {
        return nationSavingsFund;
    }

    public void setNationSavingsFund(Integer nationSavingsFund) {
        this.nationSavingsFund = nationSavingsFund;
    }

    public Integer getSocialSecurityPremium() {
        return socialSecurityPremium;
    }

    public void setSocialSecurityPremium(Integer socialSecurityPremium) {
        this.socialSecurityPremium = socialSecurityPremium;
    }

    public Integer getSocialEnterprise() {
        return socialEnterprise;
    }

    public void setSocialEnterprise(Integer socialEnterprise) {
        this.socialEnterprise = socialEnterprise;
    }

    public Integer getThaiEsg() {
        return thaiEsg;
    }

    public void setThaiEsg(Integer thaiEsg) {
        this.thaiEsg = thaiEsg;
    }

    public Integer getGeneralDonation() {
        return generalDonation;
    }

    public void setGeneralDonation(Integer generalDonation) {
        this.generalDonation = generalDonation;
    }

    public Integer getEduDonation() {
        return eduDonation;
    }

    public void setEduDonation(Integer eduDonation) {
        this.eduDonation = eduDonation;
    }

    public Integer getPoliticalPartyDonation() {
        return politicalPartyDonation;
    }

    public void setPoliticalPartyDonation(Integer politicalPartyDonation) {
        this.politicalPartyDonation = politicalPartyDonation;
    }
}
