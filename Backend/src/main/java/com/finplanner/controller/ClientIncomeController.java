package com.finplanner.controller;

import com.finplanner.model.ClientIncome;
import com.finplanner.model.ClientIncomeId;
import com.finplanner.repository.ClientIncomeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientincome")
public class ClientIncomeController {

    @Autowired
    private ClientIncomeRepository clientIncomeRepository;

    // Get all incomes for a given clientId
    @GetMapping("/{clientId}")
    public List<ClientIncome> getIncomesByClientId(@PathVariable("clientId") Integer clientId) {
        return clientIncomeRepository.findById_ClientId(clientId);
    }

    // Create a new income record
    @PostMapping
    public ResponseEntity<ClientIncome> createIncome(@RequestBody ClientIncome clientIncome) {
        ClientIncome createdIncome = clientIncomeRepository.save(clientIncome);
        return ResponseEntity.ok(createdIncome);
    }

    // Delete an income by clientId and clientIncomeName
    @DeleteMapping("/{clientId}/{clientIncomeName}")
    public ResponseEntity<Void> deleteIncome(@PathVariable("clientId") Integer clientId,
            @PathVariable("clientIncomeName") String clientIncomeName) {
        // Note that the constructor expects clientIncomeName first, then clientId
        ClientIncomeId id = new ClientIncomeId(clientIncomeName, clientId);
        clientIncomeRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Update an existing income by clientId and clientIncomeName
    @PutMapping("/{clientId}/{clientIncomeName}")
    public ResponseEntity<ClientIncome> updateIncome(
            @PathVariable("clientId") Integer clientId,
            @PathVariable("clientIncomeName") String clientIncomeName,
            @RequestBody ClientIncome updatedIncome) {
        ClientIncomeId id = new ClientIncomeId(clientIncomeName, clientId);

        return clientIncomeRepository.findById(id)
                .map(existingIncome -> {
                    existingIncome.setClientIncomeType(updatedIncome.getClientIncomeType());
                    existingIncome.setClientIncomeFrequency(updatedIncome.getClientIncomeFrequency());
                    existingIncome.setClientIncomeAmount(updatedIncome.getClientIncomeAmount());
                    existingIncome.setClientIncomeAnnualGrowthRate(updatedIncome.getClientIncomeAnnualGrowthRate());
                    existingIncome.setClientIncome405Type(updatedIncome.getClientIncome405Type());
                    existingIncome.setClientIncome406Type(updatedIncome.getClientIncome406Type());
                    existingIncome.setClientIncome408Type(updatedIncome.getClientIncome408Type());
                    existingIncome.setClientIncome408TypeOtherExpenseDeduction(
                            updatedIncome.getClientIncome408TypeOtherExpenseDeduction());

                    // Then save:
                    ClientIncome savedIncome = clientIncomeRepository.save(existingIncome);
                    return ResponseEntity.ok(savedIncome);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
