package com.finplanner.service;

import com.finplanner.model.ClientInfo;
import com.finplanner.repository.ClientInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ClientInfoService {

        @Autowired
        private ClientInfoRepository clientInfoRepository;

        public List<Map<String, Object>> getClientsByCfpId(Integer cfpId, int page, int size, String search) {
                Page<ClientInfo> clientsPage;

                if (search == null || search.trim().isEmpty()) {
                        clientsPage = clientInfoRepository.findByCfpOfThisClient_CfpId(cfpId,
                                        PageRequest.of(page, size));
                } else {
                        clientsPage = clientInfoRepository
                                        .findByCfpOfThisClient_CfpIdAndClientFirstNameContainingOrCfpOfThisClient_CfpIdAndClientLastNameContaining(
                                                        cfpId, search, cfpId, search, PageRequest.of(page, size));
                }

                return clientsPage.stream()
                                .map(client -> {
                                        Map<String, Object> clientMap = new HashMap<>();
                                        clientMap.put("clientId",
                                                        client.getClientId() != null ? client.getClientId() : "N/A");
                                        clientMap.put("clientFormatId",
                                                        client.getClientFormatId() != null ? client.getClientFormatId()
                                                                        : "N/A");
                                        clientMap.put("clientFirstName",
                                                        client.getClientFirstName() != null
                                                                        ? client.getClientFirstName()
                                                                        : "N/A");
                                        clientMap.put("clientLastName",
                                                        client.getClientLastName() != null ? client.getClientLastName()
                                                                        : "N/A");
                                        clientMap.put("clientStatus",
                                                        client.getClientStatus() != null ? client.getClientStatus()
                                                                        : "N/A");
                                        clientMap.put("clientCompletionDate",
                                                        client.getClientCompletionDate() != null
                                                                        ? client.getClientCompletionDate()
                                                                        : "N/A");
                                        return clientMap;
                                })
                                .collect(Collectors.toList());
        }

        public Optional<ClientInfo> authenticateClient(String email, String password) {
                return clientInfoRepository.findByClientEmailAndClientPassword(email, password);
        }
}
