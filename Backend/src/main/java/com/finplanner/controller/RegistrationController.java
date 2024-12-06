package com.finplanner.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.finplanner.model.ClientInfo;
import com.finplanner.repository.ClientInfoRepository;

import java.io.File;
import java.io.IOException;
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
            @RequestParam String title,
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam String gender,
            @RequestParam String phoneNumber,
            @RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate dateOfBirth,
            @RequestParam MultipartFile pdpaFile) {

        // Save the PDPA file with a unique name
        String filePath = savePDPAFile(pdpaFile, nationalId);

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
        clientInfo.setPdpa(filePath);
        clientInfo.setClientTitle(title); // Set a default status or adjust as necessary

        // Save the client info to the database
        clientInfoRepository.save(clientInfo);

        return ResponseEntity.ok("Registration successful");
    }

    private String savePDPAFile(MultipartFile file, String nationalId) {
        // Define the directory path
        String directoryPath = "C:/Users/ADMIN/finproject/Backend/pdpa";

        // Generate a unique file name
        String fileName = nationalId + "_" + file.getOriginalFilename();
        String filePath = directoryPath + "/" + fileName; // Create the full file path

        // Save the file to the server
        try {
            file.transferTo(new File(filePath)); // Transfer the uploaded file to the specified path
        } catch (IOException e) {
            throw new RuntimeException("Failed to save PDPA file", e);
        }

        return filePath;
    }
}
