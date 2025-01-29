package com.finplanner.controller;

import com.finplanner.model.CfpInfo;
import com.finplanner.repository.CfpInfoRepository;
import com.finplanner.service.CfpInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.nio.file.Files;
import java.nio.file.Path;

import org.springframework.core.io.Resource;

@RestController
@RequestMapping("/api")
public class CfpInfoController {

    // 1) Nested DTO class inside the controller
    public static class CfpInfoDTO {
        private String cfpFirstName;
        private String cfpLastName;
        private String cfpNickname;
        private String cfpPhoneNumber;
        private String cfpLinkedin;
        private String cfpContactEmail;
        private String cfpCharge;
        private String cfpQualifications;
        private String cfpServiceArea;
        private String cfpMainOccupation;
        private String cfpEducationRecord;
        private String cfpReasonBecomeCfp;
        private String cfpIntroduction;
        private String cfpExpertise;
        private String cfpLanguages;
        private String cfpImage;

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

        public String getCfpImage() {
            return cfpImage;
        }

        public void setCfpImage(String cfpImage) {
            this.cfpImage = cfpImage;
        }
    }

    private final CfpInfoService cfpInfoService;

    @Autowired
    private CfpInfoRepository cfpInfoRepository;

    // The folder where images will be stored:
    private final Path cfpImagesFolder = Paths.get("cfpimage");

    @Autowired
    public CfpInfoController(CfpInfoService cfpInfoService) {
        this.cfpInfoService = cfpInfoService;
    }

    @PostMapping(value = "/cfp/profile/uploadImage", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadCfpImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("cfpUuid") String cfpUuid,
            @RequestParam("cfpFirstName") String cfpFirstName,
            @RequestParam("cfpLastName") String cfpLastName) {
        try {
            // 1) Build a filename from firstName + lastName + extension
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null) {
                originalFilename = "unknown.jpg"; // fallback
            }
            String extension = "";
            int dotIndex = originalFilename.lastIndexOf('.');
            if (dotIndex >= 0) {
                extension = originalFilename.substring(dotIndex);
            }

            // Create the final file name: "firstname_lastname.jpg"
            String sanitizedFirstName = cfpFirstName.replaceAll("\\s+", "_");
            String sanitizedLastName = cfpLastName.replaceAll("\\s+", "_");
            String newFilename = sanitizedFirstName + "_" + sanitizedLastName + extension;

            // 2) Get the CFP info from DB
            CfpInfo cfpInfo = cfpInfoService.getByUuid(cfpUuid);
            if (cfpInfo == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("CFP not found.");
            }

            // Get the old filename (if any)
            String oldFilename = cfpInfo.getCfpImage();

            // 3) Ensure the folder exists
            if (!Files.exists(cfpImagesFolder)) {
                Files.createDirectories(cfpImagesFolder);
            }

            // 4) Save the new file to the cfpimage folder
            Path targetPath = cfpImagesFolder.resolve(newFilename).normalize();
            Files.copy(file.getInputStream(), targetPath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            // 5) Update DB with the new filename
            cfpInfo.setCfpImage(newFilename);
            cfpInfoRepository.save(cfpInfo);

            // 6) If there's an old filename, remove the old file if it's different
            if (oldFilename != null && !oldFilename.isBlank() && !oldFilename.equals(newFilename)) {
                Path oldFilePath = cfpImagesFolder.resolve(oldFilename).normalize();
                if (Files.exists(oldFilePath)) {
                    try {
                        Files.delete(oldFilePath);
                    } catch (IOException e) {
                        System.err.println("Failed to delete old file: " + oldFilePath + " - " + e.getMessage());
                    }
                }
            }

            // 7) Return success and the new filename
            return ResponseEntity.ok(newFilename);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving image: " + e.getMessage());
        }
    }

    // GET endpoint to serve image files
    @GetMapping("/cfp/profile/image/{filename}")
    public ResponseEntity<?> getCfpImage(@PathVariable String filename) {
        try {
            Path filePath = cfpImagesFolder.resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                String contentType = Files.probeContentType(filePath);
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error reading image: " + e.getMessage());
        }
    }

    @GetMapping("/cfp/profile/{cfpUuid}")
    public ResponseEntity<?> getCfpProfile(@PathVariable String cfpUuid) {
        try {
            CfpInfo cfpInfo = cfpInfoService.getByUuid(cfpUuid);
            if (cfpInfo == null) {
                return ResponseEntity.notFound().build();
            }

            // Create & fill the nested DTO
            CfpInfoDTO response = new CfpInfoDTO();
            response.setCfpFirstName(cfpInfo.getCfpFirstName());
            response.setCfpLastName(cfpInfo.getCfpLastName());
            response.setCfpNickname(cfpInfo.getCfpNickname());
            response.setCfpPhoneNumber(cfpInfo.getCfpPhoneNumber());
            response.setCfpLinkedin(cfpInfo.getCfpLinkedin());
            response.setCfpContactEmail(cfpInfo.getCfpContactEmail());
            response.setCfpCharge(cfpInfo.getCfpCharge());
            response.setCfpQualifications(cfpInfo.getCfpQualifications());
            response.setCfpServiceArea(cfpInfo.getCfpServiceArea());
            response.setCfpMainOccupation(cfpInfo.getCfpMainOccupation());
            response.setCfpEducationRecord(cfpInfo.getCfpEducationRecord());
            response.setCfpReasonBecomeCfp(cfpInfo.getCfpReasonBecomeCfp());
            response.setCfpIntroduction(cfpInfo.getCfpIntroduction());
            response.setCfpExpertise(cfpInfo.getCfpExpertise());
            response.setCfpLanguages(cfpInfo.getCfpLanguages());
            response.setCfpImage(cfpInfo.getCfpImage());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching CFP info");
        }
    }

    @PutMapping("/cfp/profile")
    public ResponseEntity<?> updateCfpProfile(@RequestBody CfpInfo payload) {
        try {
            CfpInfo updated = cfpInfoService.updateOrCreateCfpInfo(payload);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating CFP info: " + e.getMessage());
        }
    }

    @PostMapping("/cfp/login")
    public ResponseEntity<?> login(
            @RequestParam String email,
            @RequestParam String password) {

        Optional<CfpInfo> cfpInfo = cfpInfoService.authenticateCfp(email, password);
        if (cfpInfo.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("cfpUuid", cfpInfo.get().getCfpUuid());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }

    @GetMapping("/cfp/{cfpUuid}")
    public ResponseEntity<String> getCfpFirstNameById(@PathVariable String cfpUuid) {
        UUID uuid = UUID.fromString(cfpUuid);
        Optional<CfpInfo> cfpInfo = cfpInfoRepository.findByCfpUuid(uuid);
        if (cfpInfo.isPresent()) {
            return ResponseEntity.ok(cfpInfo.get().getCfpFirstName());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
