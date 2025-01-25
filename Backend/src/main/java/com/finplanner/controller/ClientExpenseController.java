package com.finplanner.controller;

import com.finplanner.model.ClientExpense;
import com.finplanner.repository.ClientExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/clientexpense")
public class ClientExpenseController {

    @Autowired
    private ClientExpenseRepository clientExpenseRepository;

    // Get all expenses for a given clientUuid
    @GetMapping("/{clientUuid}")
    public List<ClientExpense> getExpensesByClientUuid(@PathVariable String clientUuid) {
        UUID uuid = UUID.fromString(clientUuid); // Convert String to UUID
        return clientExpenseRepository.findByClientUuid(uuid);
    }

    // Create a new expense record
    @PostMapping
    public ResponseEntity<ClientExpense> createExpense(@RequestBody ClientExpense clientExpense) {
        ClientExpense createdExpense = clientExpenseRepository.save(clientExpense);
        return ResponseEntity.ok(createdExpense);
    }

    // Delete an expense by clientUuid and clientExpenseName
    @DeleteMapping("/{clientUuid}/{clientExpenseName}")
    public ResponseEntity<Object> deleteExpense(
            @PathVariable String clientUuid,
            @PathVariable String clientExpenseName) {
        UUID uuid = UUID.fromString(clientUuid); // Convert String to UUID
        return clientExpenseRepository.findByClientUuidAndClientExpenseName(uuid, clientExpenseName)
                .map(existing -> {
                    clientExpenseRepository.delete(existing);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Update an existing expense by clientUuid and clientExpenseName
    @PutMapping("/{clientUuid}/{clientExpenseName}")
    public ResponseEntity<ClientExpense> updateExpense(
            @PathVariable String clientUuid,
            @PathVariable String clientExpenseName,
            @RequestBody ClientExpense updatedExpense) {

        UUID uuid = UUID.fromString(clientUuid);
        return clientExpenseRepository.findByClientUuidAndClientExpenseName(uuid, clientExpenseName)
                .map(existingExpense -> {
                    // Update fields as needed. Assuming PUT provides all fields:
                    existingExpense.setClientExpenseType(updatedExpense.getClientExpenseType());
                    existingExpense.setClientExpenseFrequency(updatedExpense.getClientExpenseFrequency());
                    existingExpense.setClientExpenseAmount(updatedExpense.getClientExpenseAmount());
                    existingExpense.setClientExpenseAnnualGrowthRate(updatedExpense.getClientExpenseAnnualGrowthRate());
                    existingExpense.setClientDebtExpense(updatedExpense.getClientDebtExpense());
                    existingExpense.setClientNonMortgageDebtExpense(updatedExpense.getClientNonMortgageDebtExpense());
                    existingExpense.setClientSavingExpense(updatedExpense.getClientSavingExpense());

                    ClientExpense savedExpense = clientExpenseRepository.save(existingExpense);
                    return ResponseEntity.ok(savedExpense);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
