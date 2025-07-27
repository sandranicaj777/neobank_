package com.neobank.backend.Service;

import com.neobank.backend.DTO.TransactionRequestDTO;
import com.neobank.backend.DTO.TransactionResponseDTO;
import com.neobank.backend.Exceptions.UserNotFoundException;
import com.neobank.backend.Model.Transaction;
import com.neobank.backend.Model.TransactionType;
import com.neobank.backend.Model.User;
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
            case DEPOSIT:
                user.setBalance(user.getBalance().add(dto.getAmount()));
                break;

            case WITHDRAWAL:
                if (user.getBalance().compareTo(dto.getAmount()) < 0) {
                    throw new RuntimeException("Insufficient balance");
                }
                user.setBalance(user.getBalance().subtract(dto.getAmount()));
                break;

            case TRANSFER:
                if (user.getBalance().compareTo(dto.getAmount()) < 0) {
                    throw new RuntimeException("Insufficient balance for transfer");
                }
                // Find recipient
                User recipient = userRepository.findById(dto.getRecipientId())
                        .orElseThrow(() -> new RuntimeException("Recipient not found"));

                // Adjust balances
                user.setBalance(user.getBalance().subtract(dto.getAmount()));
                recipient.setBalance(recipient.getBalance().add(dto.getAmount()));

                // Set recipient on transaction
                transaction.setRecipient(recipient);

                userRepository.save(recipient); // save recipient balance update
                break;
        }

        userRepository.save(user);
        return transactionRepository.save(transaction);
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
