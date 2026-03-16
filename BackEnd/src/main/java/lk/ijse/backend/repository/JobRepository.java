package lk.ijse.backend.repository;

import lk.ijse.backend.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByCompanyId(Long companyId); // Company ekakata aithi jobs tika ganna
}
