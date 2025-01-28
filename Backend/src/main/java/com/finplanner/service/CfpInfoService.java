package com.finplanner.service;

import com.finplanner.model.CfpInfo;
import com.finplanner.repository.CfpInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.UUID;

@Service
public class CfpInfoService {

    private final CfpInfoRepository cfpInfoRepository;

    @Autowired
    public CfpInfoService(CfpInfoRepository cfpInfoRepository) {
        this.cfpInfoRepository = cfpInfoRepository;
    }

    public CfpInfo getByUuid(String uuidStr) {
        UUID uuid = UUID.fromString(uuidStr);
        Optional<CfpInfo> opt = cfpInfoRepository.findByCfpUuid(uuid);
        return opt.orElse(null);
    }

    public CfpInfo updateOrCreateCfpInfo(CfpInfo payload) throws Exception {
        // If we have a UUID, let's see if there's a record
        if (payload.getCfpUuid() == null) {
            // If no UUID is present, create a new entry
            // though typically you should have cfpUuid from login
            payload.setCfpUuid(UUID.randomUUID());
        }

        // Try to find existing
        Optional<CfpInfo> existingOpt = cfpInfoRepository.findByCfpUuid(payload.getCfpUuid());
        CfpInfo entity;
        if (existingOpt.isPresent()) {
            // Update existing
            entity = existingOpt.get();
        } else {
            // Create new
            entity = new CfpInfo();
            entity.setCfpUuid(payload.getCfpUuid());
            // Possibly set other defaults...
        }

        // Update fields from payload
        entity.setCfpFirstName(payload.getCfpFirstName());
        entity.setCfpLastName(payload.getCfpLastName());
        entity.setCfpNickname(payload.getCfpNickname());
        entity.setCfpContactEmail(payload.getCfpContactEmail());
        entity.setCfpPhoneNumber(payload.getCfpPhoneNumber());
        entity.setCfpLinkedin(payload.getCfpLinkedin());
        entity.setCfpImage(payload.getCfpImage());
        entity.setCfpCharge(payload.getCfpCharge());
        entity.setCfpExpertise(payload.getCfpExpertise());
        entity.setCfpServiceArea(payload.getCfpServiceArea());
        entity.setCfpQualifications(payload.getCfpQualifications());
        entity.setCfpEducationRecord(payload.getCfpEducationRecord());
        entity.setCfpLanguages(payload.getCfpLanguages());
        entity.setCfpMainOccupation(payload.getCfpMainOccupation());
        entity.setCfpReasonBecomeCfp(payload.getCfpReasonBecomeCfp());
        entity.setCfpIntroduction(payload.getCfpIntroduction());

        // Save
        return cfpInfoRepository.save(entity);
    }

    public Optional<CfpInfo> authenticateCfp(String email, String password) {
        Optional<CfpInfo> cfpInfo = cfpInfoRepository.findByCfpEmail(email);
        return cfpInfo.filter(info -> info.getCfpPassword().equals(password));
    }
}
