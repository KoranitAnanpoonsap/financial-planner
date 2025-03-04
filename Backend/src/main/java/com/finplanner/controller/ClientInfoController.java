package com.finplanner.controller;

import com.finplanner.model.CfpClientInfoSidePanel;
import com.finplanner.model.CfpInfo;
import com.finplanner.model.ClientInfo;
import com.finplanner.model.ClientInfoDTO;
import com.finplanner.repository.CfpInfoRepository;
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

    @Autowired
    private CfpInfoRepository cfpInfoRepository;

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
            response.put("clientUuid", clientInfo.get().getClientUuid());
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
            dto.setClientTitle(client.getClientTitle());
            dto.setClientFirstName(client.getClientFirstName());
            dto.setClientLastName(client.getClientLastName());
            dto.setClientGender(client.getClientGender());
            dto.setClientPhoneNumber(client.getClientPhoneNumber());
            dto.setClientDateOfBirth(client.getClientDateOfBirth());
            dto.setCfpOfThisClient(client.getCfpOfThisClient());

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

    @PutMapping("/status/{clientUuid}")
    public ResponseEntity<?> updateClientStatusAndCfp(@PathVariable String clientUuid,
            @RequestBody Map<String, Object> updates) {
        try {
            UUID uuid = UUID.fromString(clientUuid);
            Optional<ClientInfo> clientOpt = clientInfoRepository.findByClientUuid(uuid);
            if (!clientOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Client not found");
            }
            ClientInfo client = clientOpt.get();

            // Update CFP association if provided.
            if (updates.containsKey("cfpOfThisClient")) {
                String newCfpUuid = updates.get("cfpOfThisClient").toString();
                Optional<CfpInfo> cfpOpt = cfpInfoRepository.findByCfpUuid(UUID.fromString(newCfpUuid));
                if (!cfpOpt.isPresent()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No CFP found with provided UUID");
                }
                client.setCfpOfThisClient(cfpOpt.get());
            }

            // Update client status if provided.
            if (updates.containsKey("clientStatus")) {
                Integer newStatus = (Integer) updates.get("clientStatus");
                client.setClientStatus(newStatus);
            }

            ClientInfo updated = clientInfoRepository.save(client);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid UUID format");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating client");
        }
    }

    @PutMapping("/cfp/{clientUuid}")
    public ResponseEntity<?> updateClientCfp(
            @PathVariable String clientUuid,
            @RequestBody Map<String, String> updates) {

        Optional<ClientInfo> clientOpt = clientInfoRepository.findByClientUuid(UUID.fromString(clientUuid));
        if (!clientOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Client not found");
        }
        ClientInfo client = clientOpt.get();

        // If request body has "cfpOfThisClient"
        if (updates.containsKey("cfpOfThisClient")) {
            String newCfpUuidStr = updates.get("cfpOfThisClient");
            // 1) Convert to UUID
            UUID cfpUuid = UUID.fromString(newCfpUuidStr);

            // 2) Fetch the CfpInfo entity from DB
            Optional<CfpInfo> cfpOpt = cfpInfoRepository.findByCfpUuid(cfpUuid);
            if (!cfpOpt.isPresent()) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("No CFP found with UUID: " + newCfpUuidStr);
            }

            // 3) Set the CfpInfo object on the client
            client.setCfpOfThisClient(cfpOpt.get());
        }

        clientInfoRepository.save(client);
        return ResponseEntity.ok(client);
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
                Integer newStatus = (Integer) updates.get("clientStatus");
                client.setClientStatus(newStatus);
            }

            // Update start date if status is "กำลังดำเนินการ" or "ดำเนินการเรียบร้อย"
            if (updates.containsKey("clientStartDate")) {
                Object startDateObj = updates.get("clientStartDate");
                if (startDateObj != null && !startDateObj.toString().trim().isEmpty()) {
                    // Only update the start date if the client status allows it
                    if (Arrays.asList(2, 3).contains(client.getClientStatus())) {
                        String startDateStr = startDateObj.toString();
                        LocalDate startDate = LocalDate.parse(startDateStr); // Ensure correct format
                        client.setClientStartDate(startDate);
                    } else {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body("Start date can only be set if status is กำลังดำเนินการ or ดำเนินการเรียบร้อย");
                    }
                } else {
                    // If the value is null or empty, clear the start date
                    client.setClientStartDate(null);
                }
            }

            // Update completion date if status is "ดำเนินการเรียบร้อย"
            if (updates.containsKey("clientCompletionDate")) {
                Object completionDateObj = updates.get("clientCompletionDate");
                if (completionDateObj != null && !completionDateObj.toString().trim().isEmpty()) {
                    // Only update the completion date if the client status is ดำเนินการเรียบร้อย
                    // (3)
                    if (client.getClientStatus() == 3) {
                        String completionDateStr = completionDateObj.toString();
                        LocalDate completionDate = LocalDate.parse(completionDateStr); // Ensure correct format
                        client.setClientCompletionDate(completionDate);
                    } else {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body("Completion date can only be set if status is ดำเนินการเรียบร้อย");
                    }
                } else {
                    // If the value is null or empty, clear the completion date
                    client.setClientCompletionDate(null);
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
