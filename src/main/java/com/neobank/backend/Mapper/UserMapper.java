package com.neobank.backend.Mapper;

import com.neobank.backend.Auth.AuthRequest;
import com.neobank.backend.DTO.UserRequestDTO;
import com.neobank.backend.DTO.UserResponseDTO;
import com.neobank.backend.Model.Role;
import com.neobank.backend.Model.User;

public class UserMapper {

    public static User toEntity(UserRequestDTO dto){
        return User.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .password(dto.getPassword())
                .phoneNumber(dto.getPhoneNumber())
                .address(dto.getAddress())
                .city(dto.getCity())
                .postalCode(dto.getPostalCode())
                .country(dto.getCountry())
                .isVerified(false)
                .role(Role.USER)
                .build();

    }

    public static UserResponseDTO toDTO(User user){
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setAddress(user.getAddress());
        dto.setCity(user.getCity());
        dto.setPostalCode(user.getPostalCode());
        dto.setCountry(user.getCountry());
        dto.setRole(user.getRole().name());
        dto.setIsVerified(user.getIsVerified());
        return dto;
    }
    public static User toEntity(AuthRequest request) {
        return User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(request.getPassword())
                .role(Role.USER)
                .isVerified(false)
                .build();
    }


}
