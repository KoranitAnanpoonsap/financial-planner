package com.finplanner.model;

import java.time.LocalDate;

import jakarta.persistence.*;

@Entity
@Table(name = "client_debt")
public class ClientDebt {

    @EmbeddedId
    private ClientDebtId id;

    @Column(name = "client_debt_type", nullable = false, length = 20)
    private String clientDebtType;

    @Column(name = "client_debt_term", nullable = false, length = 10)
    private String clientDebtTerm;

    @Column(name = "client_debt_amount", nullable = false)
    private Integer clientDebtAmount;

    @Column(name = "client_debt_annual_interest", nullable = false)
    private Float clientDebtAnnualInterest;

    @Column(name = "client_start_date_debt", nullable = false)
    private LocalDate clientStartDateDebt;

    @Column(name = "client_debt_duration", nullable = false)
    private Integer clientDebtDuration;

    @Column(name = "client_debt_principal", nullable = false)
    private Integer clientDebtPrincipal;

    // Getters and Setters
    public ClientDebtId getId() {
        return id;
    }

    public void setId(ClientDebtId id) {
        this.id = id;
    }

    public String getClientDebtType() {
        return clientDebtType;
    }

    public void setClientDebtType(String clientDebtType) {
        this.clientDebtType = clientDebtType;
    }

    public String getClientDebtTerm() {
        return clientDebtTerm;
    }

    public void setClientDebtTerm(String clientDebtTerm) {
        this.clientDebtTerm = clientDebtTerm;
    }

    public Integer getClientDebtAmount() {
        return clientDebtAmount;
    }

    public void setClientDebtAmount(Integer clientDebtAmount) {
        this.clientDebtAmount = clientDebtAmount;
    }

    public Float getClientDebtAnnualInterest() {
        return clientDebtAnnualInterest;
    }

    public void setClientDebtAnnualInterest(Float clientDebtAnnualInterest) {
        this.clientDebtAnnualInterest = clientDebtAnnualInterest;
    }

    public LocalDate getClientStartDateDebt() {
        return clientStartDateDebt;
    }

    public void setClientStartDateDebt(LocalDate clientStartDateDebt) {
        this.clientStartDateDebt = clientStartDateDebt;
    }

    public Integer getClientDebtDuration() {
        return clientDebtDuration;
    }

    public void setClientDebtDuration(Integer clientDebtDuration) {
        this.clientDebtDuration = clientDebtDuration;
    }

    public Integer getClientDebtPrincipal() {
        return clientDebtPrincipal;
    }

    public void setClientDebtPrincipal(Integer clientDebtPrincipal) {
        this.clientDebtPrincipal = clientDebtPrincipal;
    }
}
