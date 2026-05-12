package lk.ijse.backend.repository;

import lk.ijse.backend.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByCompanyId(Long companyId);
    List<Job> findByTitleContainingIgnoreCase(String title);
    List<Job> findByLocationIgnoreCase(String location);
    List<Job> findByUserEmail(String email);
    List<Job> findByTitleContainingIgnoreCaseAndLocationIgnoreCase(String title, String location);
}

