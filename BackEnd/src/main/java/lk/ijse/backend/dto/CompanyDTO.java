package lk.ijse.backend.dto;

import lombok.Data;

@Data
public class CompanyDTO {
    private Long id;
    private String companyName;
    private String location;
    private String description;
    private String logoUrl;      // Logo එකේ link එක හෝ path එක
    private String website;      // Company website එක
    private String industry;     // උදා: IT, Banking, Manufacturing
    private String contactEmail; // Company එකේ පොදු contact email එක
    private Long userId; // Frontend eken user ID eka ewanawa connect karanna
}