package com.finplanner.controller;

import com.finplanner.model.ClientDebt;
import com.finplanner.model.ClientDebtId;
import com.finplanner.repository.ClientDebtRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientdebt")
public class ClientDebtController {

    @Autowired
    private ClientDebtRepository repository;

    // Get all debts for a given clientId
    @GetMapping("/{clientId}")
    public List<ClientDebt> getDebtsByClientId(@PathVariable Integer clientId) {
        return repository.findById_ClientId(clientId);
    }

    // Create a new debt record
    @PostMapping
    public ResponseEntity<ClientDebt> createDebt(@RequestBody ClientDebt clientDebt) {
        ClientDebt createdDebt = repository.save(clientDebt);
        return ResponseEntity.ok(createdDebt);
    }

    // Delete a debt by clientId and clientDebtName
    @DeleteMapping("/{clientId}/{clientDebtName}")
    public ResponseEntity<Void> deleteDebt(@PathVariable Integer clientId, @PathVariable String clientDebtName) {
        ClientDebtId id = new ClientDebtId(clientId, clientDebtName);
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
