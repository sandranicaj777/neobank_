package com.neobank.backend.Service;

import com.neobank.backend.Model.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


public interface UserService {
    User createUser(User user);
    User getUserById(Long id);
    User getUserByEmail(String email);
    List<User> getAllUsers();
    User updateUser(Long id, User updateUser);
    void deleteUser(Long id);


}
