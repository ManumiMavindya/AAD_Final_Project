package lk.ijse.backend.repository;

import lk.ijse.backend.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByCompanyId(Long companyId); // Company ekakata aithi jobs tika ganna
    // Title eka anuwa search kirima (e.g., "Java" kiyala gahuwama "Java Developer" jobs enawa)
    List<Job> findByTitleContainingIgnoreCase(String title);

    // Location eka anuwa filter kirima
    List<Job> findByLocationIgnoreCase(String location);

    List<Job> findByUserEmail(String email);

    // Title saha Location dekama anuwa search kirima
    List<Job> findByTitleContainingIgnoreCaseAndLocationIgnoreCase(String title, String location);
}

