package com.finplanner.controller;

import com.finplanner.model.CfpInfo;
import com.finplanner.repository.CfpInfoRepository;
import com.finplanner.service.CfpInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class CfpInfoController {

    private final CfpInfoService cfpInfoService;
    @Autowired
    private CfpInfoRepository cfpInfoRepository;

    // Helper method to resolve cfpId from cfpUuid
    private Integer resolveCfpIdFromUuid(String cfpUuid) {
        UUID uuid = UUID.fromString(cfpUuid); // Convert String to UUID
        return cfpInfoRepository.findByCfpUuid(uuid)
                .map(CfpInfo::getCfpId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid cfpUuid: " + cfpUuid));
    }

    @Autowired
    public CfpInfoController(CfpInfoService cfpInfoService) {
        this.cfpInfoService = cfpInfoService;
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
        Integer cfpId = resolveCfpIdFromUuid(cfpUuid); // Resolve cfpId
        Optional<CfpInfo> cfpInfo = cfpInfoService.findById(cfpId);
        if (cfpInfo.isPresent()) {
            String firstName = cfpInfo.get().getCfpFirstName(); // Assuming getCfpFirstName() is a method in CfpInfo
            return ResponseEntity.ok(firstName);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
