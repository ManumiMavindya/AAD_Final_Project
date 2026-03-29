package lk.ijse.backend.entity;

import jakarta.persistence.*;
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
    private String title;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;
    private Double salary;
    private String jobType;
    private String location;
    private String workArrangement;
    private String experienceLevel;

    @CreationTimestamp // මේකෙන් තමයි auto date එක සෙට් වෙන්නේ
    @Column(name = "posted_date", updatable = false)
    private LocalDateTime postedDate;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
