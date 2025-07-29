package com.neobank.backend.Service;

import com.neobank.backend.Model.User;
import com.neobank.backend.Model.VirtualCard;
import com.neobank.backend.Repository.UserRepository;
import com.neobank.backend.Repository.VirtualCardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class VirtualCardService {

    private final VirtualCardRepository virtualCardRepository;
    private final UserRepository userRepository;

    public VirtualCard createCard(User user) {
        VirtualCard card = VirtualCard.builder()
                .user(user)
                .cardNumber(generateCardNumber())
                .cvv(generateCVV())
                .expiryDate(LocalDate.now().plusYears(3)) // valid for 3 years
                .status(VirtualCard.CardStatus.ACTIVE)
                .build();
        return virtualCardRepository.save(card);
    }

    public List<VirtualCard> getUserCards(User user) {
        return virtualCardRepository.findByUser(user);
    }

    public VirtualCard freezeCard(Long cardId) {
        VirtualCard card = virtualCardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card not found"));
        card.setStatus(VirtualCard.CardStatus.FROZEN);
        return virtualCardRepository.save(card);
    }

    public VirtualCard unfreezeCard(Long cardId) {
        VirtualCard card = virtualCardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card not found"));
        card.setStatus(VirtualCard.CardStatus.ACTIVE);
        return virtualCardRepository.save(card);
    }

    public void deleteCard(Long cardId) {
        VirtualCard card = virtualCardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card not found"));
        card.setStatus(VirtualCard.CardStatus.DELETED);
        virtualCardRepository.save(card);
    }


    private String generateCardNumber() {
        Random random = new Random();
        StringBuilder cardNumber = new StringBuilder("4567"); // BIN prefix
        for (int i = 0; i < 12; i++) {
            cardNumber.append(random.nextInt(10));
        }
        return cardNumber.toString();
    }


    private String generateCVV() {
        Random random = new Random();
        int cvv = 100 + random.nextInt(900);
        return String.valueOf(cvv);
    }


}
