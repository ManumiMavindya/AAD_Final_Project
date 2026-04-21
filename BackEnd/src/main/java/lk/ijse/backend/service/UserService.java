package lk.ijse.backend.service;

import lk.ijse.backend.dto.UserDTO;

import java.util.List;

public interface UserService {
    String registerUser(UserDTO userDTO);
    UserDTO loginUser(String email, String password);
    List<UserDTO> getAllUsers();
    String deleteUser(Long id);
    UserDTO getUserById(Long id);
}
