package lk.ijse.backend.repository;

import lk.ijse.backend.entity.Company;
import lk.ijse.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByUser(User user);
    Optional<Company> findByUserId(Long userId);
}
