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
    private final NotificationService notificationService;


    public VirtualCard createCard(User user) {
        VirtualCard card = VirtualCard.builder()
                .user(user)
                .cardNumber(generateCardNumber())
                .cvv(generateCVV())
                .expiryDate(LocalDate.now().plusYears(3))
                .status(VirtualCard.CardStatus.ACTIVE)
                .build();

        VirtualCard savedCard = virtualCardRepository.save(card);


        notificationService.createNotification(user, "New virtual card created ending in " +
                savedCard.getCardNumber().substring(savedCard.getCardNumber().length() - 4));

        return savedCard;
    }

    public List<VirtualCard> getUserCards(User user) {
        return virtualCardRepository.findByUser(user);
    }

    public VirtualCard freezeCard(Long cardId) {
        VirtualCard card = virtualCardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card not found"));
        card.setStatus(VirtualCard.CardStatus.FROZEN);

        VirtualCard savedCard = virtualCardRepository.save(card);


        notificationService.createNotification(card.getUser(), "Your card ending in " +
                card.getCardNumber().substring(card.getCardNumber().length() - 4) + " has been frozen.");

        return savedCard;
    }

    public VirtualCard unfreezeCard(Long cardId) {
        VirtualCard card = virtualCardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card not found"));
        card.setStatus(VirtualCard.CardStatus.ACTIVE);

        VirtualCard savedCard = virtualCardRepository.save(card);


        notificationService.createNotification(card.getUser(), "Your card ending in " +
                card.getCardNumber().substring(card.getCardNumber().length() - 4) + " is active again.");

        return savedCard;
    }

    public void deleteCard(Long cardId) {
        VirtualCard card = virtualCardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card not found"));
        card.setStatus(VirtualCard.CardStatus.DELETED);
        virtualCardRepository.save(card);


        notificationService.createNotification(card.getUser(), "Your card ending in " +
                card.getCardNumber().substring(card.getCardNumber().length() - 4) + " has been deleted.");
    }


    private String generateCardNumber() {
        Random random = new Random();
        StringBuilder cardNumber = new StringBuilder("4567");
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
