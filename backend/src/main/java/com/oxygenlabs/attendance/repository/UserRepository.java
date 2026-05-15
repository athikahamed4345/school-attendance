package com.oxygenlabs.attendance.repository;

import com.oxygenlabs.attendance.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByRollNumber(String rollNumber);
}
