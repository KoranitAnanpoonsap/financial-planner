package com.finplanner.model;

import java.time.LocalDate;
import java.util.UUID;

import jakarta.persistence.*;

@Entity
@Table(name = "client_debt")
public class ClientDebt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "client_debt_id", insertable = false, updatable = false)
    private Integer clientDebtId;

    @Column(name = "client_uuid", nullable = false)
    private UUID clientUuid;

    @Column(name = "client_debt_name", length = 100, nullable = false)
    private String clientDebtName;

    @Column(name = "client_debt_type", nullable = false)
    private Integer clientDebtType;

    @Column(name = "client_debt_term", nullable = false)
    private Integer clientDebtTerm;

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
    public Integer getClientDebtId() {
        return clientDebtId;
    }

    public void setClienDebtId(Integer clientDebtId) {
        this.clientDebtId = clientDebtId;
    }

    public UUID getClientUuid() {
        return clientUuid;
    }

    public void setClientUuid(UUID clientUuid) {
        this.clientUuid = clientUuid;
    }

    public String getClientDebtName() {
        return clientDebtName;
    }

    public void setClientDebtName(String clientDebtName) {
        this.clientDebtName = clientDebtName;
    }

    public Integer getClientDebtType() {
        return clientDebtType;
    }

    public void setClientDebtType(Integer clientDebtType) {
        this.clientDebtType = clientDebtType;
    }

    public Integer getClientDebtTerm() {
        return clientDebtTerm;
    }

    public void setClientDebtTerm(Integer clientDebtTerm) {
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
