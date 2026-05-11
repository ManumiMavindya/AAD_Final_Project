package lk.ijse.backend.config;

import lk.ijse.backend.entity.User;
import lk.ijse.backend.entity.UserRole;
import lk.ijse.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
@Component
public class DataInitializer implements CommandLineRunner {

    @Value("${jobhub.admin.password}")
    private String adminPassword;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByEmail("admin@jobhub.lk").isEmpty()) {
            User admin = new User();
            admin.setName("System Admin");
            admin.setEmail("admin@jobhub.lk");
            // Property file එකෙන් එන password එක මෙතනදී encode වෙනවා
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole(UserRole.ADMIN);

            userRepository.save(admin);
        }
    }
}