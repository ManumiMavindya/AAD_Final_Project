package lk.ijse.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class JobApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreationTimestamp
    @Column(name = "application_date", updatable = false)
    private LocalDate applicationDate;

    @NotBlank(message = "Status is required")
    private String status; // e.g., PENDING, ACCEPTED, REJECTED

    @NotBlank(message = "Contact number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Contact number must be exactly 10 digits")
    private String contactNo;

    @NotBlank(message = "CV file path is required")
    private String cvPath;

    // JobApplication.java ඇතුළත

    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false)
    @JsonBackReference(value = "job-applications")
    private Job job;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference(value = "user-applications")
    private User user;
}