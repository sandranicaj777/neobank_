package com.neobank.backend.Controller;

import com.neobank.backend.DTO.VirtualCardDTO;
import com.neobank.backend.Model.User;
import com.neobank.backend.Model.VirtualCard;
import com.neobank.backend.Service.UserService;
import com.neobank.backend.Service.VirtualCardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/cards")
@RequiredArgsConstructor
public class VirtualCardController {

    private final VirtualCardService virtualCardService;
    private final UserService userService;

    @PreAuthorize("hasRole('USER')")
    @PostMapping
    public ResponseEntity<VirtualCard> createCard(Principal principal) {
        User user = userService.getUserEntityByEmail(principal.getName());
        return ResponseEntity.ok(virtualCardService.createCard(user));
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping
    public ResponseEntity<List<VirtualCard>> getMyCards(Principal principal) {
        User user = userService.getUserEntityByEmail(principal.getName());
        return ResponseEntity.ok(virtualCardService.getUserCards(user));
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/virtual-cards/{id}/freeze")
    public ResponseEntity<VirtualCardDTO> freezeCard(@PathVariable Long id) {
        VirtualCard card = virtualCardService.freezeCard(id);

        VirtualCardDTO dto = new VirtualCardDTO(
                card.getId(),
                maskCardNumber(card.getCardNumber()),
                card.getStatus().name()
        );


        return ResponseEntity.ok(dto);
    }



    @PreAuthorize("hasRole('USER')")
    @PatchMapping("/{id}/unfreeze")
    public ResponseEntity<VirtualCardDTO> unfreezeCard(@PathVariable Long id) {
        VirtualCard card = virtualCardService.unfreezeCard(id);

        VirtualCardDTO dto = new VirtualCardDTO(
                card.getId(),
                maskCardNumber(card.getCardNumber()),
                card.getStatus().name()
        );

        return ResponseEntity.ok(dto);
    }


    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCard(@PathVariable Long id) {
        virtualCardService.deleteCard(id);
        return ResponseEntity.ok("Card deleted successfully");
    }


    private String maskCardNumber(String cardNumber) {
        if (cardNumber == null || cardNumber.length() < 4) return "****";
        return "**** **** **** " + cardNumber.substring(cardNumber.length() - 4);
    }

}
