package com.finplanner.service;

import com.finplanner.model.CfpInfo;
import com.finplanner.repository.CfpInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class CfpInfoService {

    private final CfpInfoRepository cfpInfoRepository;

    @Autowired
    public CfpInfoService(CfpInfoRepository cfpInfoRepository) {
        this.cfpInfoRepository = cfpInfoRepository;
    }

    public Optional<CfpInfo> authenticateCfp(String email, String password) {
        Optional<CfpInfo> cfpInfo = cfpInfoRepository.findByCfpEmail(email);
        return cfpInfo.filter(info -> info.getCfpPassword().equals(password));
    }

    public Optional<CfpInfo> findById(Integer cfpId) {
        return cfpInfoRepository.findByCfpId(cfpId); // Assuming findById is defined in your repository
    }

}
