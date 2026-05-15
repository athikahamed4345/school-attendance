package com.oxygenlabs.attendance;

import com.oxygenlabs.attendance.model.Course;
import com.oxygenlabs.attendance.model.User;
import com.oxygenlabs.attendance.repository.CourseRepository;
import com.oxygenlabs.attendance.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;

@SpringBootApplication
public class AttendanceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AttendanceApplication.class, args);
    }

    @Bean
    CommandLineRunner seedData(UserRepository userRepo, CourseRepository courseRepo) {
        return args -> {
            if (userRepo.count() == 0) {
                BCryptPasswordEncoder enc = new BCryptPasswordEncoder();
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@college.edu");
                admin.setPassword(enc.encode("admin123"));
                userRepo.save(admin);
                System.out.println("Default admin → admin@college.edu / admin123");
            }

            if (courseRepo.count() == 0) {
                courseRepo.saveAll(List.of(
                    new Course("CS101", "Data Structures & Algorithms", "Computer Science", 4),
                    new Course("CS201", "Database Management Systems", "Computer Science", 4),
                    new Course("CS301", "Computer Networks",           "Computer Science", 3),
                    new Course("CS401", "Operating Systems",           "Computer Science", 4),
                    new Course("CS501", "Software Engineering",        "Computer Science", 3)
                ));
                System.out.println("5 courses seeded.");
            }
        };
    }
}
