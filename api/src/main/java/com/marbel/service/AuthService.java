package com.marbel.service;

import com.marbel.dto.LoginRequest;
import com.marbel.dto.LoginResponse;
import com.marbel.entity.User;
import com.marbel.repository.UserRepository;
import com.marbel.security.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Login user and generate JWT token
     */
    public LoginResponse login(LoginRequest loginRequest) {
        // Validate input
        if (!StringUtils.hasText(loginRequest.getEmail()) || 
            !StringUtils.hasText(loginRequest.getPassword())) {
            throw new RuntimeException("Email and password are required");
        }

        // Find user by email
        User user = userRepository.findByEmail(loginRequest.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Verify password
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            log.warn("Invalid password for user: {}", loginRequest.getEmail());
            throw new RuntimeException("Invalid credentials");
        }

        // Check if user is active
        if (!user.getIsActive()) {
            throw new RuntimeException("User account is inactive");
        }

        // Generate JWT token
        String token = jwtTokenProvider.generateToken(
            user.getId(), 
            user.getEmail(), 
            user.getRole().toString()
        );

        log.info("User logged in successfully: {}", user.getEmail());

        // Build response
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setUserId(user.getId());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setRole(user.getRole().toString());
        response.setExpiresIn(jwtTokenProvider.getExpirationTime());

        return response;
    }

    /**
     * Verify JWT token validity
     */
    public boolean verifyToken(String bearerToken) {
        if (!StringUtils.hasText(bearerToken) || !bearerToken.startsWith("Bearer ")) {
            return false;
        }

        String token = bearerToken.substring(7);
        return jwtTokenProvider.validateToken(token);
    }
}
