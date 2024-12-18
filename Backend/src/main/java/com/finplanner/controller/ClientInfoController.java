package com.finplanner.controller;

import com.finplanner.model.ClientInfo;
import com.finplanner.model.ClientInfoBluePanel;
import com.finplanner.model.ClientInfoDTO;
import com.finplanner.repository.ClientInfoRepository;
import com.finplanner.service.ClientInfoService;

import java.util.Map;
import java.util.Optional;
import java.util.List;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String email, @RequestParam String password) {
        Optional<ClientInfo> clientInfo = clientInfoService.authenticateClient(email, password);
        if (clientInfo.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("clientId", clientInfo.get().getClientId());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }

    @GetMapping("/cfp/{cfpId}")
    public ResponseEntity<List<Map<String, Object>>> getClientsByCfpId(
            @PathVariable Integer cfpId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        List<Map<String, Object>> clients = clientInfoService.getClientsByCfpId(cfpId, page, size, search);
        return ResponseEntity.ok(clients);
    }

    @GetMapping("/{clientId}")
    public ResponseEntity<ClientInfoBluePanel> getClientInfo(@PathVariable Integer clientId) {
        Optional<ClientInfoBluePanel> clientInfo = clientInfoRepository.findByClientId(clientId);
        return clientInfo.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/info/{clientId}")
    public ResponseEntity<ClientInfoDTO> getClientInfoNoPassword(@PathVariable Integer clientId) {
        Optional<ClientInfo> clientOpt = clientInfoRepository.findById(clientId);
        if (clientOpt.isPresent()) {
            ClientInfo client = clientOpt.get();
            ClientInfoDTO dto = new ClientInfoDTO();
            dto.setClientId(client.getClientId());
            dto.setClientFormatId(client.getClientFormatId());
            dto.setClientStatus(client.getClientStatus());
            dto.setClientStartDate(client.getClientStartDate());
            dto.setClientCompletionDate(client.getClientCompletionDate());
            dto.setClientEmail(client.getClientEmail());
            dto.setClientNationalId(client.getClientNationalId());
            dto.setClientTitle(client.getClientTitle());
            dto.setClientFirstName(client.getClientFirstName());
            dto.setClientLastName(client.getClientLastName());
            dto.setClientGender(client.getClientGender());
            dto.setClientPhoneNumber(client.getClientPhoneNumber());
            dto.setClientDateOfBirth(client.getClientDateOfBirth());

            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<ClientInfo> createClient(@RequestBody ClientInfo newClient) {
        ClientInfo saved = clientInfoRepository.save(newClient);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{clientId}")
    public ResponseEntity<ClientInfo> updateClient(@PathVariable Integer clientId,
            @RequestBody ClientInfo updatedClient) {
        return clientInfoRepository.findById(clientId)
                .map(existing -> {
                    existing.setClientTitle(updatedClient.getClientTitle());
                    existing.setClientFirstName(updatedClient.getClientFirstName());
                    existing.setClientLastName(updatedClient.getClientLastName());
                    existing.setClientGender(updatedClient.getClientGender());
                    existing.setClientDateOfBirth(updatedClient.getClientDateOfBirth());
                    existing.setClientPhoneNumber(updatedClient.getClientPhoneNumber());
                    existing.setClientEmail(updatedClient.getClientEmail());
                    ClientInfo saved = clientInfoRepository.save(existing);
                    return ResponseEntity.ok(saved);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{clientId}")
    public ResponseEntity<Void> deleteClient(@PathVariable Integer clientId) {
        if (clientInfoRepository.existsById(clientId)) {
            clientInfoRepository.deleteById(clientId);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
