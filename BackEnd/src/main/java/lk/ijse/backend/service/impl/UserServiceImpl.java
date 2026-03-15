package lk.ijse.backend.service.impl;

import lk.ijse.backend.dto.UserDTO;
import lk.ijse.backend.entity.User;
import lk.ijse.backend.repository.UserRepository;
import lk.ijse.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public String registerUser(UserDTO userDTO) {
        User user = new User();
        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        user.setPassword(userDTO.getPassword()); // Real project ekaka meka encode karanna ona
        user.setRole(userDTO.getRole());

        userRepository.save(user);
        return "User registered successfully!";
    }

    @Override
    public UserDTO loginUser(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            UserDTO dto = new UserDTO();
            dto.setId(user.get().getId());
            dto.setName(user.get().getName());
            dto.setRole(user.get().getRole());
            return dto;
        }
        return null;
    }
}
