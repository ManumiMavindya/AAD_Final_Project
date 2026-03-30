package lk.ijse.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobApplicationDTO {
    private Long id;
    private Long jobId;
    private Long userId;
    private LocalDate applicationDate;
    private String status;
    private String contactNo;
    private String cvPath; // add CV

    private String jobTitle;
    private String companyName;

}