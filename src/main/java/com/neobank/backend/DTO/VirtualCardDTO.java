package com.neobank.backend.DTO;

public record VirtualCardDTO(
        Long id,
        String cardNumber,
        String status
) {}
