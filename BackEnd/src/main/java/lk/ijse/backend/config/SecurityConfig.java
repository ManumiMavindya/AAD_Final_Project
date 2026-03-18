package lk.ijse.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()

                        // Company add කරන්න අවසර දීම (මෙතන /api/company/add එක අනිවාර්යයෙන්ම දාන්න)
                        .requestMatchers("/api/company/add").hasAuthority("EMPLOYER")

                        // Job add කරන්න අවසර දීම
                        .requestMatchers("/api/jobs/add").hasAuthority("EMPLOYER")

                        .requestMatchers("/api/company/**").authenticated()
                        .anyRequest().authenticated()
                );
        // ... (Session Management & JWT Filter කොටස අමතක කරන්න එපා)
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);


        return http.build();
    }
    // 2. CORS නීති රීති (Rules) මෙතන අර්ථ දක්වන්න
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Frontend එක රන් වෙන URLs මෙතනට දෙන්න
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:63342", "http://localhost:3000"));

        // අපිට පාවිච්චි කරන්න ඕනේ HTTP methods
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

        // Headers වලට අවසර දීම (විශේෂයෙන් Authorization header එක JWT සඳහා)
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Cache-Control"));

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // හැම API එකකටම මේක අදාළ කරන්න
        return source;
    }

    // Password එක encode කරන්න මේක අනිවාර්යයෙන් ඕනේ
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // AuthController එකේදී login එක verify කරන්න මේක ඕනේ වෙනවා
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
