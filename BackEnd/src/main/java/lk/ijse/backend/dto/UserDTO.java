package lk.ijse.backend.dto;

import lombok.Data;

@Data
public class UserDTO {
    private String id;
    private String name;
    private String email;
    private String password;
    private String role;
}