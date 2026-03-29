package lk.ijse.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor // must needed
@NoArgsConstructor
public class JobDTO {
    private Long id;
    private String title;
    private String description;
    private Double salary;
    private String jobType;
    private String location;
    private String workArrangement;
    private String experienceLevel;
    private Long companyId; // Me job eka aithi company eke ID eka
    private LocalDateTime postedDate;


}