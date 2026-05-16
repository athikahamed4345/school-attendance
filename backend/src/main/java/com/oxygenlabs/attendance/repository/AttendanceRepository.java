package com.oxygenlabs.attendance.repository;

import com.oxygenlabs.attendance.model.Attendance;
import com.oxygenlabs.attendance.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByStudentAndDateBetween(Student student, LocalDate from, LocalDate to);

    @Query("SELECT COUNT(DISTINCT a.student.id) FROM Attendance a WHERE a.date = :date AND a.present = true")
    long countDistinctPresentStudents(@Param("date") LocalDate date);

    boolean existsByStudentAndDateAndSubject(Student student, LocalDate date, String subject);

    java.util.Optional<Attendance> findByStudentAndDateAndSubject(Student student, LocalDate date, String subject);
}
