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
import java.util.stream.Collectors;

@Service
public class ClientInfoService {

        @Autowired
        private ClientInfoRepository clientInfoRepository;

        // Add a parameter for search query
        public List<Map<String, Object>> getClientsByCfpId(Integer cfpId, int page, int size, String search) {
                Page<ClientInfo> clientsPage;

                // Check if the search query is empty or null
                if (search == null || search.trim().isEmpty()) {
                        clientsPage = clientInfoRepository.findByCfpOfThisClient_CfpId(cfpId,
                                        PageRequest.of(page, size));
                } else {
                        // Search by first name or last name
                        clientsPage = clientInfoRepository
                                        .findByCfpOfThisClient_CfpIdAndClientFirstNameContainingOrCfpOfThisClient_CfpIdAndClientLastNameContaining(
                                                        cfpId, search, cfpId, search, PageRequest.of(page, size));
                }

                // Convert each ClientInfo object to a map with the specific fields
                return clientsPage.stream()
                                .map(client -> {
                                        Map<String, Object> clientMap = new HashMap<>();
                                        clientMap.put("clientId",
                                                        client.getClientId() != null ? client.getClientId()
                                                                        : "N/A");
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
}
