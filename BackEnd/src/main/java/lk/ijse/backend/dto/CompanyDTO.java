package lk.ijse.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CompanyDTO {
    private Long id;
    private String companyName;
    private String location;
    private String description;
    private String logoUrl;
    private String website;
    private String industry;
    @JsonProperty("contactEmail")
    private String contactEmail;
    private Long userId;
}