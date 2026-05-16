package com.oxygenlabs.attendance.controller;

import com.oxygenlabs.attendance.repository.AttendanceRepository;
import com.oxygenlabs.attendance.repository.CourseRepository;
import com.oxygenlabs.attendance.repository.StudentRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final StudentRepository studentRepo;
    private final AttendanceRepository attendanceRepo;
    private final CourseRepository courseRepo;

    public DashboardController(StudentRepository studentRepo,
                               AttendanceRepository attendanceRepo,
                               CourseRepository courseRepo) {
        this.studentRepo = studentRepo;
        this.attendanceRepo = attendanceRepo;
        this.courseRepo = courseRepo;
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        long totalStudents = studentRepo.count();
        long totalCourses  = courseRepo.count();
        long todayPresent  = attendanceRepo.countDistinctPresentStudents(LocalDate.now());
        long todayAbsent   = Math.max(0, totalStudents - todayPresent);

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalStudents", totalStudents);
        stats.put("totalSubjects", totalCourses);
        stats.put("todayPresent",  todayPresent);
        stats.put("todayAbsent",   todayAbsent);
        return stats;
    }
}
