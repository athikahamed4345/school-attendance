package com.oxygenlabs.attendance.repository;

import com.oxygenlabs.attendance.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {}
