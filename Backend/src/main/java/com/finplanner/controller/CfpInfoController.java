package com.finplanner.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.finplanner.model.CfpInfo;
import com.finplanner.repository.CfpInfoRepository;
import com.finplanner.service.CfpInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

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
        private Integer cfpGender;

        // Getters and setters...
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

        public Integer getCfpGender() {
            return cfpGender;
        }

        public void setCfpGender(Integer cfpGender) {
            this.cfpGender = cfpGender;
        }
    }

    private final CfpInfoService cfpInfoService;

    @Autowired
    private CfpInfoRepository cfpInfoRepository;

    // Cloudinary instance for image uploads/deletions
    private final Cloudinary cloudinary;

    @Autowired
    public CfpInfoController(CfpInfoService cfpInfoService) {
        this.cfpInfoService = cfpInfoService;
        // Initialize Cloudinary with your credentials
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dyhyjpoel",
                "api_key", "192676298677891",
                "api_secret", "pdAI8TSp3E-BCIlPAVuUdhw_BFY"));
    }

    /**
     * Uploads the image to Cloudinary and returns the secure URL.
     * Notice: This endpoint does NOT update the CFP record.
     * The returned URL is temporary and will be saved only if the user clicks
     * "Save".
     */
    @PostMapping(value = "/cfp/profile/uploadImage", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadCfpImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("cfpUuid") String cfpUuid,
            @RequestParam("cfpFirstName") String cfpFirstName,
            @RequestParam("cfpLastName") String cfpLastName) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("No file selected.");
            }

            // Create a public ID for the image using first and last name
            String publicId = cfpFirstName.replaceAll("\\s+", "_") + "_" + cfpLastName.replaceAll("\\s+", "_");

            // Upload the image to Cloudinary
            @SuppressWarnings("unchecked")
            Map<String, Object> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap("public_id", publicId));

            // Get the secure URL of the uploaded image
            String secureUrl = uploadResult.get("secure_url").toString();

            // Do NOT update the DB here.
            // Return the secure URL so the front-end can update its state temporarily.
            return ResponseEntity.ok(secureUrl);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error uploading image: " + e.getMessage());
        }
    }

    // GET endpoint to serve images is not needed with Cloudinary.
    @GetMapping("/cfp/profile/image/{filename}")
    public ResponseEntity<?> getCfpImage(@PathVariable String filename) {
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED)
                .body("Serving images from local storage is disabled.");
    }

    @GetMapping("/cfp/all")
    public ResponseEntity<List<CfpInfo>> getAllCfps() {
        return ResponseEntity.ok(cfpInfoRepository.findAll());
    }

    @GetMapping("/cfp/profile/{cfpUuid}")
    public ResponseEntity<?> getCfpProfile(@PathVariable String cfpUuid) {
        try {
            CfpInfo cfpInfo = cfpInfoService.getByUuid(cfpUuid);
            if (cfpInfo == null) {
                return ResponseEntity.notFound().build();
            }

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
            response.setCfpGender(cfpInfo.getCfpGender());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching CFP info");
        }
    }

    /**
     * Updates the CFP profile. If the cfpImage field in the payload is different
     * from the stored value,
     * delete the old image from Cloudinary.
     */
    @PutMapping("/cfp/profile")
    public ResponseEntity<?> updateCfpProfile(@RequestBody CfpInfo payload) {
        try {
            // Retrieve the current CFP record.
            CfpInfo current = cfpInfoService.getByUuid(payload.getCfpUuid().toString());

            // If there is an existing image and it differs from the new one, delete the old
            // image.
            if (current != null && current.getCfpImage() != null
                    && payload.getCfpImage() != null
                    && !current.getCfpImage().equals(payload.getCfpImage())) {

                String oldImageUrl = current.getCfpImage();
                // Extract the public ID from the URL.
                // Cloudinary URLs are typically of the form:
                // https://res.cloudinary.com/<cloud_name>/image/upload/v<version>/<public_id>.<ext>
                int lastSlash = oldImageUrl.lastIndexOf('/');
                int dotIndex = oldImageUrl.lastIndexOf('.');
                if (lastSlash != -1 && dotIndex != -1 && dotIndex > lastSlash) {
                    String oldPublicId = oldImageUrl.substring(lastSlash + 1, dotIndex);
                    try {
                        cloudinary.uploader().destroy(oldPublicId, ObjectUtils.emptyMap());
                    } catch (Exception e) {
                        System.err.println("Error deleting old image: " + e.getMessage());
                    }
                }
            }

            // Update the CFP record (including the new image URL, if provided).
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
