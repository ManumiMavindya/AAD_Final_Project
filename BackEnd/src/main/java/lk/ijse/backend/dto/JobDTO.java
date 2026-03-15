package lk.ijse.backend.dto;

import lombok.Data;

@Data
public class JobDTO {
    private Long id;
    private String title;
    private String description;
    private Double salary;
    private String location;
    private Long companyId; // Me job eka aithi company eke ID eka
}