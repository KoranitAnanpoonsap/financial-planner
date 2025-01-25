package com.finplanner.controller;

import com.finplanner.model.CfpClientInfoSidePanel;
import com.finplanner.model.ClientInfo;
import com.finplanner.model.ClientInfoDTO;
import com.finplanner.repository.ClientInfoRepository;
import com.finplanner.service.ClientInfoService;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.time.LocalDate;
import java.util.Arrays;
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

    // Get paginated, sorted, filtered clients by cfpUuid
    @GetMapping("/cfp-uuid/{cfpUuid}")
    public ResponseEntity<Map<String, Object>> getClientsByCfpUuid(
            @PathVariable String cfpUuid,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String filterStatus,
            @RequestParam(defaultValue = "clientStartDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        try {
            UUID uuid = UUID.fromString(cfpUuid); // Convert String to UUID
            Map<String, Object> response = clientInfoService.getFilteredClients(uuid, search, filterStatus, page, size,
                    sortBy, sortDir);

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    // Login
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

    // cfp client side panel
    @GetMapping("/{clientUuid}")
    public ResponseEntity<CfpClientInfoSidePanel> getClientInfo(@PathVariable String clientUuid) {
        UUID uuid = UUID.fromString(clientUuid);
        Optional<CfpClientInfoSidePanel> clientInfo = clientInfoRepository.findByClientSideUuid(uuid);
        return clientInfo.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // cfp client info
    @GetMapping("/info/{clientUuid}")
    public ResponseEntity<ClientInfoDTO> getClientInfoNoPassword(@PathVariable String clientUuid) {
        UUID uuid = UUID.fromString(clientUuid);
        Optional<ClientInfo> clientOpt = clientInfoRepository.findByClientUuid(uuid);
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

    // register
    @PostMapping
    public ResponseEntity<ClientInfo> createClient(@RequestBody ClientInfo newClient) {
        ClientInfo saved = clientInfoRepository.save(newClient);
        return ResponseEntity.ok(saved);
    }

    // update client info
    @PutMapping("/{clientUuid}")
    public ResponseEntity<ClientInfo> updateClient(@PathVariable String clientUuid,
            @RequestBody ClientInfo updatedClient) {
        UUID uuid = UUID.fromString(clientUuid);
        return clientInfoRepository.findByClientUuid(uuid)
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

    // Update Client Status and Dates by clientUuid
    @PutMapping("/update/{clientUuid}")
    public ResponseEntity<?> updateClient(@PathVariable String clientUuid,
            @RequestBody Map<String, Object> updates) {
        try {
            UUID uuid = UUID.fromString(clientUuid);
            Optional<ClientInfo> clientOpt = clientInfoRepository.findByClientUuid(uuid);
            if (!clientOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Client not found");
            }

            ClientInfo client = clientOpt.get();

            // Update status if provided
            if (updates.containsKey("clientStatus")) {
                String newStatus = updates.get("clientStatus").toString();
                if (Arrays.asList("ส่งคำร้อง", "กำลังดำเนินการ", "ดำเนินการเรียบร้อย").contains(newStatus)) {
                    client.setClientStatus(newStatus);
                } else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid status value");
                }
            }

            // Update start date if status is "กำลังดำเนินการ" or "ดำเนินการเรียบร้อย"
            if (updates.containsKey("clientStartDate")) {
                if (Arrays.asList("กำลังดำเนินการ", "ดำเนินการเรียบร้อย").contains(client.getClientStatus())) {
                    String startDateStr = updates.get("clientStartDate").toString();
                    LocalDate startDate = LocalDate.parse(startDateStr); // Ensure correct format
                    client.setClientStartDate(startDate);
                } else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("Start date can only be set if status is กำลังดำเนินการ or ดำเนินการเรียบร้อย");
                }
            }

            // Update completion date if status is "ดำเนินการเรียบร้อย"
            if (updates.containsKey("clientCompletionDate")) {
                if ("ดำเนินการเรียบร้อย".equals(client.getClientStatus())) {
                    String completionDateStr = updates.get("clientCompletionDate").toString();
                    LocalDate completionDate = LocalDate.parse(completionDateStr); // Ensure correct format
                    client.setClientCompletionDate(completionDate);
                } else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("Completion date can only be set if status is ดำเนินการเรียบร้อย");
                }
            }

            // Save the updated client
            ClientInfo updatedClient = clientInfoService.updateClient(client);
            return ResponseEntity.ok(updatedClient);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid UUID format");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while updating the client");
        }
    }

    // Dissociate Client from CFP (Delete button functionality)
    @PutMapping("/dissociate/{clientUuid}")
    public ResponseEntity<?> dissociateClient(@PathVariable String clientUuid) {
        try {
            UUID uuid = UUID.fromString(clientUuid);
            Optional<ClientInfo> clientOpt = clientInfoRepository.findByClientUuid(uuid);
            if (!clientOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Client not found");
            }

            ClientInfo client = clientOpt.get();
            client.setCfpOfThisClient(null);
            client.setClientStatus(null); // Reset status
            client.setClientStartDate(null); // Reset start date
            client.setClientCompletionDate(null); // Reset completion date
            clientInfoRepository.save(client);

            return ResponseEntity.ok("Client dissociated from CFP and fields reset successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid UUID format");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while dissociating the client");
        }
    }
}
