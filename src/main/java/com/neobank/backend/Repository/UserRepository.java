package com.neobank.backend.Repository;

import com.neobank.backend.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByDeletedFalse();
    long countByStatus(String status);
    long countByDeletedTrue();


}
