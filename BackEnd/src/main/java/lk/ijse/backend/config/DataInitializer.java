package lk.ijse.backend.config;

import lk.ijse.backend.entity.User;
import lk.ijse.backend.entity.UserRole;
import lk.ijse.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Admin කෙනෙක් දැනටම ඉන්නවද කියලා බලනවා
        if (userRepository.findByEmail("admin@jobhub.lk").isEmpty()) {
            User admin = new User();
            admin.setName("System Admin");
            admin.setEmail("admin@jobhub.lk");
            // Password එක encode කරලා save කරන්න
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setRole(UserRole.ADMIN);

            userRepository.save(admin);
            System.out.println(">>> Default Admin User Created Successfully!");
        }
    }
}
