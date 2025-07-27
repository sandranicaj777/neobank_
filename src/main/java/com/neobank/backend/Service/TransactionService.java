package com.neobank.backend.Service;

import com.neobank.backend.DTO.TransactionRequestDTO;
import com.neobank.backend.DTO.TransactionResponseDTO;
import com.neobank.backend.Exceptions.UserNotFoundException;
import com.neobank.backend.Model.Transaction;
import com.neobank.backend.Model.User;
import com.neobank.backend.Repository.TransactionRepository;
import com.neobank.backend.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;


    public TransactionResponseDTO createTransaction(TransactionRequestDTO request) {
       User user= userRepository.findById(request.getUserId())
               .orElseThrow(()-> new UserNotFoundException("User not found"));

       Transaction transaction = Transaction.builder()
               .user(user)
               .amount(request.getAmount())
               .type(request.getType())
               .description(request.getDescription())
               .timestamp(LocalDateTime.now())
               .build();

       Transaction savedTransaction = transactionRepository.save(transaction);
       return mapToResponse(savedTransaction);

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
                transaction.getType(),
                transaction.getDescription(),
                transaction.getTimestamp()
        );
    }

    // ✅ Get transactions below a certain amount
    public List<TransactionResponseDTO> getTransactionsBelowAmount(Long userId, BigDecimal amount) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        return transactionRepository.findByUserAndAmountLessThan(user, amount)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


}
