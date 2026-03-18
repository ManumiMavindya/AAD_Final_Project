package lk.ijse.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lk.ijse.backend.service.impl.CustomUserDetailsService;
import lk.ijse.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        // 1. Header එක එනවද බලන්න (Debug)
        System.out.println("DEBUG: Auth Header found -> " + (authHeader != null));

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            username = jwtUtil.extractUsername(token);
            System.out.println("DEBUG: Extracted Username -> " + username);
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            // 2. Token එක Valid ද බලන්න
            if (jwtUtil.validateToken(token, userDetails.getUsername())) {

                // 3. මෙතන තමයි වැදගත්ම දේ: UserDetails ගේ Authorities ටික හරියට සෙට් කරනවා
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);

                // 4. ඇත්තටම Role එක මොකක්ද කියලා Console එකේ බලන්න
                System.out.println("DEBUG: User Authenticated! Authorities -> " + userDetails.getAuthorities());
            } else {
                System.out.println("DEBUG: Token Validation Failed!");
            }
        }

        filterChain.doFilter(request, response);
    }
}