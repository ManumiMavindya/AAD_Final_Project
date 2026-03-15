package lk.ijse.backend.service;

import lk.ijse.backend.dto.UserDTO;

public interface UserService {
    String registerUser(UserDTO userDTO);
    UserDTO loginUser(String email, String password);
}
