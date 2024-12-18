package com.finplanner.service;

import com.finplanner.model.AdminInfo;
import com.finplanner.repository.AdminInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdminInfoService {

    private final AdminInfoRepository adminInfoRepository;

    @Autowired
    public AdminInfoService(AdminInfoRepository adminInfoRepository) {
        this.adminInfoRepository = adminInfoRepository;
    }

    public Optional<AdminInfo> authenticateAdmin(String email, String password) {
        return adminInfoRepository.findByAdminEmailAndAdminPassword(email, password);
    }

    public Optional<AdminInfo> findByEmail(String email) {
        return adminInfoRepository.findById(email);
    }
}
