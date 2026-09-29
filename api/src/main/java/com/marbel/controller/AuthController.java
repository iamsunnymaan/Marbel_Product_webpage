package com.marbel.controller;

import com.marbel.dto.LoginRequest;
import com.marbel.dto.LoginResponse;
import com.marbel.service.AuthService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.Data;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * Admin Login
     * POST /api/auth/login
     * Request: {email, password}
     * Response: {token, userId, email, role, expiresIn}
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        log.info("Login attempt for email: {}", loginRequest.getEmail());
        
        try {
            LoginResponse response = authService.login(loginRequest);
            log.info("Login successful for: {}", loginRequest.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Login failed: {}", e.getMessage());
            return ResponseEntity.status(401)
                .body(new ErrorResponse("Invalid credentials", 401));
        }
    }

    /**
     * Verify Token
     * GET /api/auth/verify
     * Headers: Authorization: Bearer {token}
     */
    @GetMapping("/verify")
    @PostMapping("/verify")
    public ResponseEntity<?> verifyToken(@RequestHeader("Authorization") String token) {
        try {
            boolean isValid = authService.verifyToken(token);
            if (isValid) {
                return ResponseEntity.ok(new StatusResponse("Token is valid", 200));
            }
            return ResponseEntity.status(401)
                .body(new ErrorResponse("Invalid token", 401));
        } catch (Exception e) {
            return ResponseEntity.status(401)
                .body(new ErrorResponse("Token verification failed", 401));
        }
    }

    @Data
    @AllArgsConstructor
    public static class ErrorResponse {
        private String message;
        private int code;
    }

    @Data
    @AllArgsConstructor
    public static class StatusResponse {
        private String message;
        private int code;
    }
}
