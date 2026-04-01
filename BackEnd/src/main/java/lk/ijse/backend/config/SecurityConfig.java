package lk.ijse.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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
                        // 1. මේ ටික ඕනෑම කෙනෙක්ට (Public) බලන්න පුළුවන්
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/jobs/all").permitAll() // 👈 Jobs බලන්න හැමෝටම පුළුවන්
                        .requestMatchers(HttpMethod.GET, "/api/jobs/{id}").permitAll() // 👈 Job එකක details බලන්නත් පුළුවන්

                        // 2. හැබැයි Job එකක් POST (Add) කරන්න නම් EMPLOYER වෙන්නම ඕනේ
                        .requestMatchers(HttpMethod.POST, "/api/jobs/**").hasAuthority("EMPLOYER")

                        .requestMatchers("/uploads/**").permitAll()
                        // 3. අනිත් දේවල්
                        .requestMatchers("/api/company/add").hasAuthority("EMPLOYER")
                        .requestMatchers("/api/company/**").authenticated()
                        .requestMatchers("/api/apply/**").authenticated()

                        .anyRequest().authenticated()
                );

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
