package com.oxygenlabs.attendance.controller;

import com.oxygenlabs.attendance.model.Course;
import com.oxygenlabs.attendance.repository.CourseRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    private final CourseRepository courseRepo;

    public CourseController(CourseRepository courseRepo) {
        this.courseRepo = courseRepo;
    }

    @GetMapping
    public List<Course> getAll() {
        return courseRepo.findAll();
    }
}
