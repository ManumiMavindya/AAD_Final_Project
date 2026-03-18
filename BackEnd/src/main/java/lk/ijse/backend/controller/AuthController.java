package lk.ijse.backend.controller;

import lk.ijse.backend.dto.UserDTO;
import lk.ijse.backend.entity.User;
import lk.ijse.backend.repository.UserRepository;
import lk.ijse.backend.service.UserService;
import lk.ijse.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*") // Frontend ekata access denna
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    // 1. User Registration
    @PostMapping("/register")
    public String register(@RequestBody User user) {
        // Password එක encode කරලා save කරන්න
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return "User Registered Successfully!";
    }

    // 2. User Login (Token එකක් දෙන තැන)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");

        // 1. Authentication පරීක්ෂා කිරීම
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );

        // 2. User විස්තර ටික Database එකෙන් ගන්න
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3. Token එක හදන්න
        String token = jwtUtil.generateToken(email);

        // 4. Response එක විදිහට Object එකක් යවන්න
        // මම මෙතන පහසුවට Map එකක් පාවිච්චි කළා, ඔයා හදපු AuthResponseDTO එක පාවිච්චි කරන්නත් පුළුවන්
        return ResponseEntity.ok(Map.of(
                "token", token,
                "name", user.getName(),
                "role", user.getRole().name(),
                "userId",user.getId()

        ));
    }
}
