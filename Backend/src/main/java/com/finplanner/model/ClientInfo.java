package com.finplanner.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "client_info") // Table name in the database
public class ClientInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "client_id", insertable = false, updatable = false)
    private Integer clientId;

    @Column(name = "client_uuid", columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID clientUuid;

    @Column(name = "client_format_id", length = 6, updatable = false, insertable = false)
    private String clientFormatId;

    @ManyToOne
    @JoinColumn(name = "cfp_of_this_client", referencedColumnName = "cfp_uuid")
    private CfpInfo cfpOfThisClient;

    @Column(name = "client_status")
    private Integer clientStatus;

    @Column(name = "client_start_date")
    private LocalDate clientStartDate;

    @Column(name = "client_completion_date")
    private LocalDate clientCompletionDate;

    @Column(name = "client_email", nullable = false, length = 320)
    private String clientEmail;

    @Column(name = "client_password", nullable = false)
    private String clientPassword;

    @Column(name = "client_title", nullable = false)
    private Integer clientTitle;

    @Column(name = "client_firstname", nullable = false, length = 50)
    private String clientFirstName;

    @Column(name = "client_lastname", nullable = false, length = 50)
    private String clientLastName;

    @Column(name = "client_gender", nullable = false)
    private Integer clientGender;

    @Column(name = "client_phone_number", nullable = false, length = 12)
    private String clientPhoneNumber;

    @Column(name = "client_date_of_birth", nullable = false)
    private LocalDate clientDateOfBirth;

    // Getters and Setters for all fields

    // Automatically set clientUuid before persisting
    @PrePersist
    public void prePersist() {
        if (clientUuid == null) {
            clientUuid = UUID.randomUUID();
        }
    }

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

    public Integer getClientStatus() {
        return clientStatus;
    }

    public void setClientStatus(Integer clientStatus) {
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

    public Integer getClientTitle() {
        return clientTitle;
    }

    public void setClientTitle(Integer clientTitle) {
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

    public Integer getClientGender() {
        return clientGender;
    }

    public void setClientGender(Integer clientGender) {
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

    public UUID getClientUuid() {
        return clientUuid;
    }

    public void setClientUuid(UUID clientUuid) {
        this.clientUuid = clientUuid;
    }
}
