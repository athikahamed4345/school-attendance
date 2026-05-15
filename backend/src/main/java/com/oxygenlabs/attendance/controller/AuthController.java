package com.oxygenlabs.attendance.controller;

import com.oxygenlabs.attendance.model.User;
import com.oxygenlabs.attendance.repository.StudentRepository;
import com.oxygenlabs.attendance.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepo;
    private final StudentRepository studentRepo;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private final ConcurrentHashMap<String, Long> sessions = new ConcurrentHashMap<>();

    public AuthController(UserRepository userRepo, StudentRepository studentRepo) {
        this.userRepo    = userRepo;
        this.studentRepo = studentRepo;
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signup(@RequestBody SignupRequest req) {
        String role = (req.role() != null && req.role().equalsIgnoreCase("STUDENT")) ? "STUDENT" : "STAFF";

        if (req.username() == null || req.email() == null || req.password() == null
                || req.username().isBlank() || req.email().isBlank() || req.password().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "All fields are required"));
        }
        if (req.password().length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 6 characters"));
        }
        if (userRepo.existsByEmail(req.email().trim().toLowerCase())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already registered"));
        }

        String rollNumber = null;
        if (role.equals("STUDENT")) {
            if (req.rollNumber() == null || req.rollNumber().isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Roll number is required for student registration"));
            }
            rollNumber = req.rollNumber().trim().toUpperCase();
            if (studentRepo.findByRollNumber(rollNumber).isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Roll number not found. Contact your administrator."));
            }
            // Check if this roll number already has an account
            if (userRepo.existsByRollNumber(rollNumber)) {
                return ResponseEntity.badRequest().body(Map.of("error", "An account already exists for this roll number"));
            }
        }

        User user = new User();
        user.setUsername(req.username().trim());
        user.setEmail(req.email().trim().toLowerCase());
        user.setPassword(encoder.encode(req.password()));
        user.setRole(role);
        user.setRollNumber(rollNumber);
        userRepo.save(user);

        return ResponseEntity.ok(Map.of("message", "Account created successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest req) {
        if (req.email() == null || req.password() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
        }
        Optional<User> userOpt = userRepo.findByEmail(req.email().trim().toLowerCase());
        if (userOpt.isEmpty() || !encoder.matches(req.password(), userOpt.get().getPassword())) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
        }
        User user = userOpt.get();
        String token = UUID.randomUUID().toString();
        sessions.put(token, user.getId());

        Map<String, String> resp = new java.util.LinkedHashMap<>();
        resp.put("token",    token);
        resp.put("username", user.getUsername());
        resp.put("role",     user.getRole());
        if (user.getRollNumber() != null) resp.put("rollNumber", user.getRollNumber());
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(
            @RequestHeader(value = "Authorization", required = false) String auth) {
        if (auth != null && auth.startsWith("Bearer ")) sessions.remove(auth.substring(7));
        return ResponseEntity.ok(Map.of("message", "Logged out"));
    }

    @GetMapping("/verify")
    public ResponseEntity<Map<String, Boolean>> verify(
            @RequestHeader(value = "Authorization", required = false) String auth) {
        if (auth != null && auth.startsWith("Bearer ") && sessions.containsKey(auth.substring(7)))
            return ResponseEntity.ok(Map.of("valid", true));
        return ResponseEntity.status(401).body(Map.of("valid", false));
    }

    record SignupRequest(String username, String email, String password, String role, String rollNumber) {}
    record LoginRequest(String email, String password) {}
}
