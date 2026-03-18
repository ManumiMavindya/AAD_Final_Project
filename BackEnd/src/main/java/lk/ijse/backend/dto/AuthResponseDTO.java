package lk.ijse.backend.dto;

import lk.ijse.backend.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponseDTO {
    private String token;
    private String name;
    private UserRole role;
    private Long userId;
}
