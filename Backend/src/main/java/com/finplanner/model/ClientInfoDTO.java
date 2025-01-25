package com.finplanner.model;

import java.time.LocalDate;

public class ClientInfoDTO {

    private Integer clientId;
    private String clientFormatId;
    private String clientStatus;
    private LocalDate clientStartDate;
    private LocalDate clientCompletionDate;
    private String clientEmail;
    private String clientNationalId;
    private String clientTitle;
    private String clientFirstName;
    private String clientLastName;
    private String clientGender;
    private String clientPhoneNumber;
    private LocalDate clientDateOfBirth;

    public Integer getClientId() {
        return clientId;
    }

    public void setClientId(Integer clientId) {
        this.clientId = clientId;
    }

    public String getClientFormatId() {
        return clientFormatId;
    }

    public void setClientFormatId(String clientFormatId) {
        this.clientFormatId = clientFormatId;
    }

    public String getClientStatus() {
        return clientStatus;
    }

    public void setClientStatus(String clientStatus) {
        this.clientStatus = clientStatus;
    }

    public LocalDate getClientStartDate() {
        return clientStartDate;
    }

    public void setClientStartDate(LocalDate clientStartDate) {
        this.clientStartDate = clientStartDate;
    }

    public LocalDate getClientCompletionDate() {
        return clientCompletionDate;
    }

    public void setClientCompletionDate(LocalDate clientCompletionDate) {
        this.clientCompletionDate = clientCompletionDate;
    }

    public String getClientEmail() {
        return clientEmail;
    }

    public void setClientEmail(String clientEmail) {
        this.clientEmail = clientEmail;
    }

    public String getClientNationalId() {
        return clientNationalId;
    }

    public void setClientNationalId(String clientNationalId) {
        this.clientNationalId = clientNationalId;
    }

    public String getClientTitle() {
        return clientTitle;
    }

    public void setClientTitle(String clientTitle) {
        this.clientTitle = clientTitle;
    }

    public String getClientFirstName() {
        return clientFirstName;
    }

    public void setClientFirstName(String clientFirstName) {
        this.clientFirstName = clientFirstName;
    }

    public String getClientLastName() {
        return clientLastName;
    }

    public void setClientLastName(String clientLastName) {
        this.clientLastName = clientLastName;
    }

    public String getClientGender() {
        return clientGender;
    }

    public void setClientGender(String clientGender) {
        this.clientGender = clientGender;
    }

    public String getClientPhoneNumber() {
        return clientPhoneNumber;
    }

    public void setClientPhoneNumber(String clientPhoneNumber) {
        this.clientPhoneNumber = clientPhoneNumber;
    }

    public LocalDate getClientDateOfBirth() {
        return clientDateOfBirth;
    }

    public void setClientDateOfBirth(LocalDate clientDateOfBirth) {
        this.clientDateOfBirth = clientDateOfBirth;
    }
}
