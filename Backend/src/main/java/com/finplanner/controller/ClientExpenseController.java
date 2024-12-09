package com.finplanner.controller;

import com.finplanner.model.ClientExpense;
import com.finplanner.model.ClientExpenseId;
import com.finplanner.repository.ClientExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientexpense")
public class ClientExpenseController {

    @Autowired
    private ClientExpenseRepository clientExpenseRepository;

    // Get all expenses for a given clientId
    @GetMapping("/{clientId}")
    public List<ClientExpense> getExpensesByClientId(@PathVariable("clientId") Integer clientId) {
        return clientExpenseRepository.findById_ClientId(clientId);
    }

    // Create a new expense record
    @PostMapping
    public ResponseEntity<ClientExpense> createExpense(@RequestBody ClientExpense clientExpense) {
        ClientExpense createdExpense = clientExpenseRepository.save(clientExpense);
        return ResponseEntity.ok(createdExpense);
    }

    // Delete an expense by clientId and clientExpenseName
    @DeleteMapping("/{clientId}/{clientExpenseName}")
    public ResponseEntity<Void> deleteExpense(@PathVariable("clientId") Integer clientId,
            @PathVariable("clientExpenseName") String clientExpenseName) {
        ClientExpenseId id = new ClientExpenseId(clientId, clientExpenseName);
        clientExpenseRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Update an existing expense by clientId and clientExpenseName
    @PutMapping("/{clientId}/{clientExpenseName}")
    public ResponseEntity<ClientExpense> updateExpense(@PathVariable("clientId") Integer clientId,
            @PathVariable("clientExpenseName") String clientExpenseName,
            @RequestBody ClientExpense updatedExpense) {
        ClientExpenseId id = new ClientExpenseId(clientId, clientExpenseName);

        return clientExpenseRepository.findById(id)
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
