package com.finplanner.controller;

import com.finplanner.model.AdminInfo;
import com.finplanner.service.AdminInfoService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admins")
public class AdminInfoController {

    private final AdminInfoService adminInfoService;

    @Autowired
    public AdminInfoController(AdminInfoService adminInfoService) {
        this.adminInfoService = adminInfoService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String email, @RequestParam String password) {
        Optional<AdminInfo> adminInfo = adminInfoService.authenticateAdmin(email, password);
        if (adminInfo.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("adminEmail", adminInfo.get().getAdminEmail());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }

    @GetMapping("/{adminEmail}")
    public ResponseEntity<String> getAdminDetailsByEmail(@PathVariable String adminEmail) {
        Optional<AdminInfo> adminInfo = adminInfoService.findByEmail(adminEmail);
        if (adminInfo.isPresent()) {
            return ResponseEntity.ok(adminInfo.get().getAdminEmail());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
