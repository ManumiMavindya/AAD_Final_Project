package lk.ijse.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ATSResultDTO {
    private int score;
    private boolean isCompatible;
    private String feedback;
}
