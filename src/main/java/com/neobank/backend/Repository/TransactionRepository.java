package com.neobank.backend.Repository;


import com.neobank.backend.Model.Transaction;
import com.neobank.backend.Model.TransactionType;
import com.neobank.backend.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUser(User user);

    List<Transaction> findByUserAndTimestampBetween(User user, LocalDateTime start, LocalDateTime end);

    List<Transaction> findByUserAndType(User user, String type);

    List<Transaction> findByUserAndAmountGreaterThan(User user, BigDecimal amount);

    List<Transaction> findByUserAndAmountLessThan(User user, BigDecimal amount);

    long countByType(TransactionType type);
}
