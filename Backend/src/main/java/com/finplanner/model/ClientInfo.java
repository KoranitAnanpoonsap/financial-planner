package com.finplanner.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "client_info") // Table name in the database
public class ClientInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "client_id")
    private Integer clientId;

    @Column(name = "client_format_id", length = 6, insertable = false)
    private String clientFormatId;

    @ManyToOne
    @JoinColumn(name = "cfp_of_this_client", referencedColumnName = "cfp_id")
    private CfpInfo cfpOfThisClient; // Foreign key reference to CfpInfo

    @Column(name = "client_status", length = 20)
    private String clientStatus;

    @Column(name = "client_start_date")
    private LocalDate clientStartDate;

    @Column(name = "client_completion_date")
    private LocalDate clientCompletionDate;

    @Column(name = "client_email", nullable = false, length = 320)
    private String clientEmail;

    @Column(name = "client_password", nullable = false)
    private String clientPassword;

    @Column(name = "client_national_id", nullable = false, length = 20)
    private String clientNationalId;

    @Column(name = "client_title", nullable = false, length = 6)
    private String clientTitle;

    @Column(name = "client_firstname", nullable = false, length = 50)
    private String clientFirstName;

    @Column(name = "client_lastname", nullable = false, length = 50)
    private String clientLastName;

    @Column(name = "client_gender", nullable = false, length = 4)
    private String clientGender;

    @Column(name = "client_phone_number", nullable = false, length = 12)
    private String clientPhoneNumber;

    @Column(name = "client_date_of_birth", nullable = false)
    private LocalDate clientDateOfBirth;

    @Column(name = "pdpa", nullable = false, length = 100)
    private String pdpa;

    // Getters and Setters for all fields

    public Integer getClientId() {
        return clientId;
    }

    public void setClientId(Integer clientId) {
        this.clientId = clientId;
    }

    public String getClientFormatId() {
        return clientFormatId;
    }

    public CfpInfo getCfpOfThisClient() {
        return cfpOfThisClient;
    }

    public void setCfpOfThisClient(CfpInfo cfpOfThisClient) {
        this.cfpOfThisClient = cfpOfThisClient;
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

    public String getClientPassword() {
        return clientPassword;
    }

    public void setClientPassword(String clientPassword) {
        this.clientPassword = clientPassword;
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

    public String getPdpa() {
        return pdpa;
    }

    public void setPdpa(String pdpa) {
        this.pdpa = pdpa;
    }
}
