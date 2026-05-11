package lk.ijse.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Job title is required")
    @Size(min = 3, max = 150, message = "Job title must be between 3 and 150 characters")
    private String title;

    @Lob
    @NotBlank(message = "Job description is required")
    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "Salary is required")
    @Positive(message = "Salary must be a positive value")
    private Double salary;

    @NotBlank(message = "Job type is required (e.g., FULL_TIME, PART_TIME)")
    private String jobType;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Work arrangement is required (e.g., REMOTE, ONSITE)")
    private String workArrangement;

    @NotBlank(message = "Experience level is required")
    private String experienceLevel;

    @CreationTimestamp
    @Column(name = "posted_date", updatable = false)
    private LocalDateTime postedDate;

    @ManyToOne
    @JoinColumn(name = "company_id")
    @NotNull(message = "Company association is required")
    private Company company;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @NotNull(message = "User association is required")
    private User user;
}