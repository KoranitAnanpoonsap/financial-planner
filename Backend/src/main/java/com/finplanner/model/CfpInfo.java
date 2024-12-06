package com.finplanner.model;

import jakarta.persistence.*;

@Entity
@Table(name = "cfp_info")
public class CfpInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cfp_id")
    private Integer cfpId;

    @Column(name = "cfp_firstname", nullable = false, length = 50)
    private String cfpFirstName;

    @Column(name = "cfp_lastname", nullable = false, length = 50)
    private String cfpLastName;

    @Column(name = "cfp_nickname", nullable = false, length = 50)
    private String cfpNickname;

    @Column(name = "cfp_format_id", nullable = false, length = 20)
    private String cfpFormatId;

    @Column(name = "cfp_email", nullable = false)
    private String cfpEmail;

    @Column(name = "cfp_password", nullable = false)
    private String cfpPassword;

    @Column(name = "cfp_image", length = 100)
    private String cfpImage;

    @Column(name = "cfp_phone_number", nullable = false, length = 20)
    private String cfpPhoneNumber;

    @Column(name = "cfp_linkedin", length = 100)
    private String cfpLinkedin;

    @Column(name = "cfp_contact_email", length = 100)
    private String cfpContactEmail;

    @Column(name = "cfp_charge")
    private String cfpCharge;

    @Column(name = "cfp_qualifications")
    private String cfpQualifications;

    @Column(name = "cfp_service_area")
    private String cfpServiceArea;

    @Column(name = "cfp_main_occupation")
    private String cfpMainOccupation;

    @Column(name = "cfp_education_record")
    private String cfpEducationRecord;

    @Column(name = "cfp_reason_become_cfp")
    private String cfpReasonBecomeCfp;

    @Column(name = "cfp_introduction")
    private String cfpIntroduction;

    @Column(name = "cfp_expertise")
    private String cfpExpertise;

    @Column(name = "cfp_languages")
    private String cfpLanguages;

    // Getters and Setters for all fields

    public Integer getCfpId() {
        return cfpId;
    }

    public void setCfpId(Integer cfpId) {
        this.cfpId = cfpId;
    }

    public String getCfpFirstName() {
        return cfpFirstName;
    }

    public void setCfpFirstName(String cfpFirstName) {
        this.cfpFirstName = cfpFirstName;
    }

    public String getCfpLastName() {
        return cfpLastName;
    }

    public void setCfpLastName(String cfpLastName) {
        this.cfpLastName = cfpLastName;
    }

    public String getCfpNickname() {
        return cfpNickname;
    }

    public void setCfpNickname(String cfpNickname) {
        this.cfpNickname = cfpNickname;
    }

    public String getCfpFormatId() {
        return cfpFormatId;
    }

    public void setCfpFormatId(String cfpFormatId) {
        this.cfpFormatId = cfpFormatId;
    }

    public String getCfpEmail() {
        return cfpEmail;
    }

    public void setCfpEmail(String cfpEmail) {
        this.cfpEmail = cfpEmail;
    }

    public String getCfpPassword() {
        return cfpPassword;
    }

    public void setCfpPassword(String cfpPassword) {
        this.cfpPassword = cfpPassword;
    }

    public String getCfpImage() {
        return cfpImage;
    }

    public void setCfpImage(String cfpImage) {
        this.cfpImage = cfpImage;
    }

    public String getCfpPhoneNumber() {
        return cfpPhoneNumber;
    }

    public void setCfpPhoneNumber(String cfpPhoneNumber) {
        this.cfpPhoneNumber = cfpPhoneNumber;
    }

    public String getCfpLinkedin() {
        return cfpLinkedin;
    }

    public void setCfpLinkedin(String cfpLinkedin) {
        this.cfpLinkedin = cfpLinkedin;
    }

    public String getCfpContactEmail() {
        return cfpContactEmail;
    }

    public void setCfpContactEmail(String cfpContactEmail) {
        this.cfpContactEmail = cfpContactEmail;
    }

    public String getCfpCharge() {
        return cfpCharge;
    }

    public void setCfpCharge(String cfpCharge) {
        this.cfpCharge = cfpCharge;
    }

    public String getCfpQualifications() {
        return cfpQualifications;
    }

    public void setCfpQualifications(String cfpQualifications) {
        this.cfpQualifications = cfpQualifications;
    }

    public String getCfpServiceArea() {
        return cfpServiceArea;
    }

    public void setCfpServiceArea(String cfpServiceArea) {
        this.cfpServiceArea = cfpServiceArea;
    }

    public String getCfpMainOccupation() {
        return cfpMainOccupation;
    }

    public void setCfpMainOccupation(String cfpMainOccupation) {
        this.cfpMainOccupation = cfpMainOccupation;
    }

    public String getCfpEducationRecord() {
        return cfpEducationRecord;
    }

    public void setCfpEducationRecord(String cfpEducationRecord) {
        this.cfpEducationRecord = cfpEducationRecord;
    }

    public String getCfpReasonBecomeCfp() {
        return cfpReasonBecomeCfp;
    }

    public void setCfpReasonBecomeCfp(String cfpReasonBecomeCfp) {
        this.cfpReasonBecomeCfp = cfpReasonBecomeCfp;
    }

    public String getCfpIntroduction() {
        return cfpIntroduction;
    }

    public void setCfpIntroduction(String cfpIntroduction) {
        this.cfpIntroduction = cfpIntroduction;
    }

    public String getCfpExpertise() {
        return cfpExpertise;
    }

    public void setCfpExpertise(String cfpExpertise) {
        this.cfpExpertise = cfpExpertise;
    }

    public String getCfpLanguages() {
        return cfpLanguages;
    }

    public void setCfpLanguages(String cfpLanguages) {
        this.cfpLanguages = cfpLanguages;
    }
}
