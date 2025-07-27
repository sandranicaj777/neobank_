package com.neobank.backend.Config;

import com.neobank.backend.Model.Role;
import com.neobank.backend.Model.User;
import com.neobank.backend.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initAdmin(UserRepository userRepository) {
        return args -> {
            if (userRepository.findByEmail("admin@bank.com").isEmpty()) {
                User admin = User.builder()
                        .firstName("Admin")
                        .lastName("User")
                        .email("admin@bank.com")
                        .password(passwordEncoder.encode("admin123"))
                        .role(Role.ADMIN)
                        .balance(BigDecimal.ZERO)
                        .isVerified(true)
                        .build();

                userRepository.save(admin);
                System.out.println("✅ Admin user created: admin@bank.com / admin123");
            }
        };
    }
}
