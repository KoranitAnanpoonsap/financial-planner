package com.finplanner.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.finplanner.model.ClientInfo;
import com.finplanner.repository.ClientInfoRepository;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/register")
public class RegistrationController {

    @Autowired
    private ClientInfoRepository clientInfoRepository;

    @PostMapping
    public ResponseEntity<String> registerClient(
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String nationalId,
            @RequestParam Integer title,
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam Integer gender,
            @RequestParam String phoneNumber,
            @RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate dateOfBirth) {

        // Create a new ClientInfo object
        ClientInfo clientInfo = new ClientInfo();
        clientInfo.setClientEmail(email);
        clientInfo.setClientPassword(password); // Store the hashed password
        clientInfo.setClientNationalId(nationalId);
        clientInfo.setClientFirstName(firstName);
        clientInfo.setClientLastName(lastName);
        clientInfo.setClientGender(gender);
        clientInfo.setClientPhoneNumber(phoneNumber);
        clientInfo.setClientDateOfBirth(dateOfBirth);
        clientInfo.setClientTitle(title); // Set a default status or adjust as necessary

        // Save the client info to the database
        clientInfoRepository.save(clientInfo);

        return ResponseEntity.ok("Registration successful");
    }
}
