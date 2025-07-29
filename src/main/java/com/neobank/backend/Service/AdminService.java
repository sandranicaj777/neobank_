package com.neobank.backend.Service;


import com.neobank.backend.Model.Transaction;
import com.neobank.backend.Repository.TransactionRepository;
import com.neobank.backend.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;


    public BigDecimal getTotalBalance() {
        return userRepository.findAll()
                .stream()
                .map(user -> user.getBalance() != null ? user.getBalance() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }


    public Map<String, Long> getUserStats() {
        long active = userRepository.countByStatus("ACTIVE");
        long frozen = userRepository.countByStatus("FROZEN");
        long deleted = userRepository.countByDeletedTrue(); // soft-deleted users

        Map<String, Long> stats = new HashMap<>();
        stats.put("active", active);
        stats.put("frozen", frozen);
        stats.put("deleted", deleted);
        return stats;
    }


    public List<Transaction> getRecentTransactions(int limit) {
        return transactionRepository.findTopNTransactions(limit);
    }
}
