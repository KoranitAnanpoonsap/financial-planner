package com.finplanner.model;

import jakarta.persistence.*;

@Entity
@Table(name = "general_goal") // Table name in the database
public class GeneralGoal {

    @Id
    private Integer clientId; // This matches ClientInfo's primary key

    @MapsId("clientId") // This tells JPA that clientId in TaxPlan maps to ClientInfo's primary key
    @OneToOne
    @JoinColumn(name = "client_id", referencedColumnName = "client_id")
    private ClientInfo clientInfo;

    @Column(name = "client_general_goal_name", length = 100)
    private String clientGeneralGoalName;

    @Column(name = "client_general_goal_value")
    private Integer clientGeneralGoalValue;

    @Column(name = "client_general_goal_period")
    private Integer clientGeneralGoalPeriod;

    @Column(name = "client_net_income")
    private Integer clientNetIncome;

    @Column(name = "client_net_income_growth")
    private Float clientNetIncomeGrowth;

    // Getters and Setters for all fields

    public Integer getClientId() {
        return clientId;
    }

    public void setClientId(Integer clientId) {
        this.clientId = clientId;
    }

    public String getClientGeneralGoalName() {
        return clientGeneralGoalName;
    }

    public void setClientGeneralGoalName(String clientGeneralGoalName) {
        this.clientGeneralGoalName = clientGeneralGoalName;
    }

    public Integer getClientGeneralGoalValue() {
        return clientGeneralGoalValue;
    }

    public void setClientGeneralGoalValue(Integer clientGeneralGoalValue) {
        this.clientGeneralGoalValue = clientGeneralGoalValue;
    }

    public Integer getClientGeneralGoalPeriod() {
        return clientGeneralGoalPeriod;
    }

    public void setClientGeneralGoalPeriod(Integer clientGeneralGoalPeriod) {
        this.clientGeneralGoalPeriod = clientGeneralGoalPeriod;
    }

    public Integer getClientNetIncome() {
        return clientNetIncome;
    }

    public void setClientNetIncome(Integer clientNetIncome) {
        this.clientNetIncome = clientNetIncome;
    }

    public Float getClientNetIncomeGrowth() {
        return clientNetIncomeGrowth;
    }

    public void setClientNetIncomeGrowth(Float clientNetIncomeGrowth) {
        this.clientNetIncomeGrowth = clientNetIncomeGrowth;
    }
}
