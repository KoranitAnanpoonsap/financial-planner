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

    // Update a debt record by clientId and clientDebtName
    @PutMapping("/{clientId}/{clientDebtName}")
    public ResponseEntity<ClientDebt> updateDebt(@PathVariable Integer clientId,
            @PathVariable String clientDebtName,
            @RequestBody ClientDebt updatedDebt) {

        ClientDebtId id = new ClientDebtId(clientId, clientDebtName);

        return repository.findById(id)
                .map(existingDebt -> {
                    // Update fields as needed. Assuming the PUT request provides all fields:
                    existingDebt.setClientDebtType(updatedDebt.getClientDebtType());
                    existingDebt.setClientDebtTerm(updatedDebt.getClientDebtTerm());
                    existingDebt.setClientDebtAmount(updatedDebt.getClientDebtAmount());
                    existingDebt.setClientDebtAnnualInterest(updatedDebt.getClientDebtAnnualInterest());
                    existingDebt.setClientStartDateDebt(updatedDebt.getClientStartDateDebt());
                    existingDebt.setClientDebtDuration(updatedDebt.getClientDebtDuration());
                    existingDebt.setClientDebtPrincipal(updatedDebt.getClientDebtPrincipal());

                    ClientDebt savedDebt = repository.save(existingDebt);
                    return ResponseEntity.ok(savedDebt);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
