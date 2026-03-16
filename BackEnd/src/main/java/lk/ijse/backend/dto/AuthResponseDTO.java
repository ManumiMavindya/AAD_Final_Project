package lk.ijse.backend.dto;

import lk.ijse.backend.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponseDTO {
    private String token;
    private String name;
    private UserRole role;
}
