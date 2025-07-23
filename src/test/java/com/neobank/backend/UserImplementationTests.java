package com.neobank.backend;

import com.neobank.backend.Exceptions.UserNotFoundException;
import com.neobank.backend.Model.User;
import com.neobank.backend.Repository.UserRepository;
import com.neobank.backend.Service.UserServiceImplementation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UserImplementationTests {

    private UserRepository userRepository;
    private UserServiceImplementation userService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        userService = new UserServiceImplementation(userRepository);

    }

    @Test
    void testGetUserById_whenUserExists(){
        User mockUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .firstName("Alex")
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));


        User result = userService.getUserById(1L);

        assertNotNull(result);
        assertEquals("Alex", result.getFirstName());
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    void testGetUserById_whenUserDoesNotExist(){
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> userService.getUserById(1L));
        verify(userRepository).findById(1L);
    }
    @Test
    void testCreateUser_shouldReturnSavedUser() {
        User newUser = User.builder()
                .email("new@example.com")
                .firstName("New")
                .build();

        when(userRepository.save(newUser)).thenReturn(newUser);

        User savedUser = userService.createUser(newUser);

        assertEquals("New", savedUser.getFirstName());
        verify(userRepository, times(1)).save(newUser);
    }

    @Test
    void testGetAllUsers_shouldReturnList() {
        List<User> users = List.of(
                User.builder().id(1L).email("a@example.com").build(),
                User.builder().id(2L).email("b@example.com").build()
        );

        when(userRepository.findAll()).thenReturn(users);

        List<User> result = userService.getAllUsers();

        assertEquals(2, result.size());
        verify(userRepository).findAll();
    }

    @Test
    void testUpdateUser_whenUserExists() {
        User existingUser = User.builder().id(1L).email("old@example.com").firstName("Old").build();
        User updatedUser = User.builder().email("new@example.com").firstName("New").build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User result = userService.updateUser(1L, updatedUser);

        assertEquals("New", result.getFirstName());
        assertEquals("new@example.com", result.getEmail());
        verify(userRepository).save(existingUser);
    }

    @Test
    void testDeleteUser_whenExists() {
        when(userRepository.existsById(1L)).thenReturn(true);

        userService.deleteUser(1L);

        verify(userRepository).deleteById(1L);
    }

    @Test
    void testDeleteUser_whenNotExists_shouldThrow() {
        when(userRepository.existsById(1L)).thenReturn(false);

        assertThrows(UserNotFoundException.class, () -> userService.deleteUser(1L));
    }

}
