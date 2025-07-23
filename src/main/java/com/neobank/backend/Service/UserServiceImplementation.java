package com.neobank.backend.Service;

import com.neobank.backend.Exceptions.UserNotFoundException;
import com.neobank.backend.Model.User;
import com.neobank.backend.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class UserServiceImplementation implements UserService {

    private final UserRepository userRepository;

    public UserServiceImplementation(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User createUser(User user) {
       return userRepository.save(user);
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User with ID " + id + " not found"));
    }


    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User with email " + email + " not found"));
    }


    @Override
    public List<User> getAllUsers() {
       return userRepository.findAll();
    }

    @Override
    public User updateUser(Long id, User updateUser) {
       return userRepository.findById(id).map(existingUser -> {
           existingUser.setFirstName(updateUser.getFirstName());
           existingUser.setLastName(updateUser.getLastName());
           existingUser.setEmail(updateUser.getEmail());
           existingUser.setPassword(updateUser.getPassword());
           existingUser.setPhoneNumber(updateUser.getPhoneNumber());
           existingUser.setBirthDate(updateUser.getBirthDate());
           existingUser.setAddress(updateUser.getAddress());
           existingUser.setCity(updateUser.getCity());
           existingUser.setPostalCode(updateUser.getPostalCode());
           existingUser.setCountry(updateUser.getCountry());
           existingUser.setProfilePictureUrl(updateUser.getProfilePictureUrl());
           existingUser.setRole(updateUser.getRole());
           existingUser.setStatus(updateUser.getStatus());
           return userRepository.save(existingUser);
       }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException("User with ID" + id+" is not found.");
        }
        userRepository.deleteById(id);
}
}
