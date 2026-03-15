package lk.ijse.backend.dto;

import lombok.Data;

@Data
public class CompanyDTO {
    private Long id;
    private String companyName;
    private String location;
    private String description;
    private String userId; // Frontend eken user ID eka ewanawa connect karanna
}