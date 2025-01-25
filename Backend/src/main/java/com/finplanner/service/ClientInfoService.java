package com.finplanner.service;

import com.finplanner.model.ClientInfo;
import com.finplanner.repository.ClientInfoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class ClientInfoService {

        @Autowired
        private ClientInfoRepository clientInfoRepository;

        /**
         * Retrieves clients associated with a specific CFP ID, applying optional search
         * and status filters.
         * Implements filtering, sorting, and pagination in-memory using Java Streams.
         *
         * @param cfpUuid      The CFP ID to filter clients.
         * @param search       Optional search term to filter by clientFormatId,
         *                     clientFirstName, or clientLastName.
         * @param filterStatus Optional status to filter clients.
         * @param page         The page number (0-based index).
         * @param size         The number of clients per page.
         * @param sortBy       The field to sort by.
         * @param sortDir      The sort direction ("asc" or "desc").
         * @return A map containing the paginated list of clients and pagination
         *         metadata.
         */
        public Map<String, Object> getFilteredClients(
                        UUID cfpUuid,
                        String search,
                        String filterStatus,
                        int page,
                        int size,
                        String sortBy,
                        String sortDir) {

                List<ClientInfo> clients = clientInfoRepository.findByCfpOfThisClient_CfpUuid(cfpUuid);

                // 1. Optional filtering by search
                if (search != null && !search.trim().isEmpty()) {
                        String searchLower = search.toLowerCase();
                        clients = clients.stream()
                                        .filter(client -> client.getClientFormatId().toLowerCase().contains(searchLower)
                                                        || client.getClientFirstName().toLowerCase()
                                                                        .contains(searchLower)
                                                        || client.getClientLastName().toLowerCase()
                                                                        .contains(searchLower))
                                        .collect(Collectors.toList());
                }

                // 2. Optional filtering by status
                if (filterStatus != null && !filterStatus.trim().isEmpty()) {
                        clients = clients.stream()
                                        .filter(client -> client.getClientStatus().equals(filterStatus))
                                        .collect(Collectors.toList());
                }

                // 3. Separate lists: those with date vs. those without date
                List<ClientInfo> clientsWithStartDate = clients.stream()
                                .filter(client -> client.getClientStartDate() != null)
                                .collect(Collectors.toList());

                List<ClientInfo> clientsWithoutStartDate = clients.stream()
                                .filter(client -> client.getClientStartDate() == null)
                                .collect(Collectors.toList());

                // 4. Sort clients with date
                // Default to sorting by date ascending unless sortBy/sortDir indicate otherwise
                Comparator<ClientInfo> comparatorWithDate = Comparator.comparing(
                                ClientInfo::getClientStartDate,
                                Comparator.nullsLast(Comparator.naturalOrder()));
                if ("clientStartDate".equalsIgnoreCase(sortBy)) {
                        if ("desc".equalsIgnoreCase(sortDir)) {
                                comparatorWithDate = Comparator.comparing(
                                                ClientInfo::getClientStartDate,
                                                Comparator.nullsLast(Comparator.reverseOrder()));
                        } else {
                                comparatorWithDate = Comparator.comparing(
                                                ClientInfo::getClientStartDate,
                                                Comparator.nullsLast(Comparator.naturalOrder()));
                        }
                }

                // Apply the comparator to the with-date list
                clientsWithStartDate = clientsWithStartDate.stream()
                                .sorted(comparatorWithDate)
                                .collect(Collectors.toList());

                // 5. Sort clients without date by clientFormatId (ascending by default)
                Comparator<ClientInfo> comparatorWithoutDate = Comparator.comparing(ClientInfo::getClientFormatId);

                clientsWithoutStartDate = clientsWithoutStartDate.stream()
                                .sorted(comparatorWithoutDate)
                                .collect(Collectors.toList());

                // 6. Combine both lists (with-date first, then no-date)
                List<ClientInfo> sortedClients = Stream.concat(
                                clientsWithStartDate.stream(),
                                clientsWithoutStartDate.stream()).collect(Collectors.toList());

                // 7. Handle pagination
                int totalItems = sortedClients.size();
                int totalPages = (int) Math.ceil((double) totalItems / size);

                int fromIndex = page * size;
                int toIndex = Math.min(fromIndex + size, totalItems);
                if (fromIndex > toIndex) {
                        fromIndex = toIndex;
                }

                List<ClientInfo> paginatedClients = sortedClients.subList(fromIndex, toIndex);

                // 8. Build response map
                Map<String, Object> response = new HashMap<>();
                response.put("clients", paginatedClients.stream()
                                .map(client -> {
                                        Map<String, Object> clientMap = new HashMap<>();
                                        clientMap.put("clientFormatId", client.getClientFormatId());
                                        clientMap.put("clientFullName",
                                                        client.getClientFirstName() + " " + client.getClientLastName());
                                        clientMap.put("clientStatus", client.getClientStatus());
                                        clientMap.put("clientStartDate", client.getClientStartDate());
                                        clientMap.put("clientCompletionDate", client.getClientCompletionDate());
                                        clientMap.put("clientUuid", client.getClientUuid());
                                        clientMap.put("clientId", client.getClientId());
                                        return clientMap;
                                })
                                .collect(Collectors.toList()));
                response.put("currentPage", page);
                response.put("totalItems", totalItems);
                response.put("totalPages", totalPages);

                return response;
        }

        public Optional<ClientInfo> authenticateClient(String email, String password) {
                return clientInfoRepository.findByClientEmailAndClientPassword(email, password);
        }

        public ClientInfo saveClient(ClientInfo client) {
                return clientInfoRepository.save(client);
        }

        public Optional<ClientInfo> findByClientUuid(UUID clientUuid) {
                return clientInfoRepository.findByClientUuid(clientUuid);
        }

        public ClientInfo updateClient(ClientInfo client) {
                return clientInfoRepository.save(client);
        }

        public void dissociateCfpFromClient(UUID clientUuid) {
                Optional<ClientInfo> clientOpt = clientInfoRepository.findByClientUuid(clientUuid);
                if (clientOpt.isPresent()) {
                        ClientInfo client = clientOpt.get();
                        client.setCfpOfThisClient(null);
                        clientInfoRepository.save(client);
                }
        }

        public void deleteClientByClientUuid(UUID clientUuid) {
                Optional<ClientInfo> clientOpt = clientInfoRepository.findByClientUuid(clientUuid);
                clientOpt.ifPresent(clientInfoRepository::delete);
        }
}
