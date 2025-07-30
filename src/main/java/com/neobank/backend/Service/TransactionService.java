package com.neobank.backend.Service;

import com.neobank.backend.DTO.TransactionRequestDTO;
import com.neobank.backend.DTO.TransactionResponseDTO;
import com.neobank.backend.Exceptions.UserNotFoundException;
import com.neobank.backend.Model.AuditLog;
import com.neobank.backend.Model.Transaction;
import com.neobank.backend.Model.TransactionType;
import com.neobank.backend.Model.User;
import com.neobank.backend.Repository.AuditLogRepository;
import com.neobank.backend.Repository.TransactionRepository;
import com.neobank.backend.Repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.reactive.TransactionalOperator;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;

    @Transactional
    public Transaction createTransaction(TransactionRequestDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setAmount(dto.getAmount());
        transaction.setType(dto.getType());
        transaction.setDescription(dto.getDescription());
        transaction.setTimestamp(LocalDateTime.now());

        switch (dto.getType()) {
            case DEPOSIT -> {
                user.setBalance(user.getBalance().add(dto.getAmount()));
                logAction("DEPOSIT", user.getEmail(),
                        "Deposited " + dto.getAmount() + " into account");
            }
            case WITHDRAWAL -> {
                if (user.getBalance().compareTo(dto.getAmount()) < 0) {
                    throw new RuntimeException("Insufficient balance");
                }
                user.setBalance(user.getBalance().subtract(dto.getAmount()));
                logAction("WITHDRAWAL", user.getEmail(),
                        "Withdrew " + dto.getAmount() + " from account");
            }
            case TRANSFER -> {
                if (user.getBalance().compareTo(dto.getAmount()) < 0) {
                    throw new RuntimeException("Insufficient balance for transfer");
                }

                User recipient = userRepository.findById(dto.getRecipientId())
                        .orElseThrow(() -> new RuntimeException("Recipient not found"));

                user.setBalance(user.getBalance().subtract(dto.getAmount()));
                recipient.setBalance(recipient.getBalance().add(dto.getAmount()));

                transaction.setRecipient(recipient);
                userRepository.save(recipient);

                logAction("TRANSFER", user.getEmail(),
                        "Transferred " + dto.getAmount() + " to " + recipient.getEmail());
            }
        }

        userRepository.save(user);
        return transactionRepository.save(transaction);
    }

    private void logAction(String action, String performedBy, String description) {
        AuditLog log = AuditLog.builder()
                .action(action)
                .performedBy(performedBy)
                .description(description)
                .build();
        auditLogRepository.save(log);
    }



    public List<TransactionResponseDTO> getTransactionsByUser(Long userId) {
        User user= userRepository.findById(userId).orElseThrow(()-> new UserNotFoundException("User not found"));

        return transactionRepository.findByUser(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

    }

    public List<TransactionResponseDTO> getTransactionsByDate(Long userId, LocalDateTime start, LocalDateTime end) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        return transactionRepository.findByUserAndTimestampBetween(user, start, end)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<TransactionResponseDTO> getTransactionsAboveAmount(Long userId, BigDecimal amount) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        return transactionRepository.findByUserAndAmountGreaterThan(user, amount)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private TransactionResponseDTO mapToResponse(Transaction transaction) {
        return new TransactionResponseDTO(
                transaction.getId(),
                transaction.getUser().getEmail(),
                transaction.getAmount(),
                transaction.getRecipient() != null ? transaction.getRecipient().getEmail() : null,
                transaction.getType(),
                transaction.getDescription(),
                transaction.getTimestamp()
        );
    }





    public List<TransactionResponseDTO> getTransactionsBelowAmount(Long userId, BigDecimal amount) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        return transactionRepository.findByUserAndAmountLessThan(user, amount)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


}
