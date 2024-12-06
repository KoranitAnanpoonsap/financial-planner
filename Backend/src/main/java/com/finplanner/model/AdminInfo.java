package com.finplanner.model;

import jakarta.persistence.*;

@Entity
@Table(name = "admin_info") // Table name in the database
public class AdminInfo {

    @Id
    @Column(name = "admin_email", nullable = false, length = 320)
    private String adminEmail; // Foreign key reference to ClientInfo

    @Column(name = "admin_password", nullable = false)
    private String adminPassword;

    // Getters and Setters

    public String getAdminEmail() {
        return adminEmail;
    }

    public void setAdminEmail(String adminEmail) {
        this.adminEmail = adminEmail;
    }

    public String getAdminPassword() {
        return adminPassword;
    }

    public void setAdminPassword(String adminPassword) {
        this.adminPassword = adminPassword;
    }

}
