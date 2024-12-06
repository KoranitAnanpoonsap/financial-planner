package com.finplanner.controller;

import com.finplanner.model.ClientInfoBluePanel;
import com.finplanner.repository.ClientInfoRepository;
import com.finplanner.service.ClientInfoService;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientInfoController {

    @Autowired
    private ClientInfoService clientInfoService;

    private final ClientInfoRepository clientInfoRepository;

    @Autowired
    public ClientInfoController(ClientInfoRepository clientInfoRepository) {
        this.clientInfoRepository = clientInfoRepository;
    }

    @GetMapping("/cfp/{cfpId}")
    public ResponseEntity<List<Map<String, Object>>> getClientsByCfpId(
            @PathVariable Integer cfpId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) { // Add search parameter
        List<Map<String, Object>> clients = clientInfoService.getClientsByCfpId(cfpId, page, size, search);
        return ResponseEntity.ok(clients);
    }

    @GetMapping("/{clientId}")
    public ResponseEntity<ClientInfoBluePanel> getClientInfo(@PathVariable Integer clientId) {
        // Now this method directly returns the projection type
        Optional<ClientInfoBluePanel> clientInfo = clientInfoRepository.findByClientId(clientId);

        return clientInfo
                .map(ResponseEntity::ok) // If present, return 200 with the client info
                .orElseGet(() -> ResponseEntity.notFound().build()); // If not found, return 404
    }
}
