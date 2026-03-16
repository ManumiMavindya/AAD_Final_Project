package lk.ijse.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lk.ijse.backend.entity.User;

@Entity
@Getter
@Setter
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String companyName;
    private String location;
    private String description;

    @OneToOne // User kenekuta ekama eka company ekai thiyenna puluwan kiyala hithuwoth
    @JoinColumn(name = "user_id")
    private User user;
}
