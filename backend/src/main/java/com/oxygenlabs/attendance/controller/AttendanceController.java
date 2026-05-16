package com.oxygenlabs.attendance.controller;

import com.oxygenlabs.attendance.model.Attendance;
import com.oxygenlabs.attendance.model.Student;
import com.oxygenlabs.attendance.repository.AttendanceRepository;
import com.oxygenlabs.attendance.repository.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    private final AttendanceRepository attendanceRepo;
    private final StudentRepository studentRepo;

    public AttendanceController(AttendanceRepository attendanceRepo, StudentRepository studentRepo) {
        this.attendanceRepo = attendanceRepo;
        this.studentRepo = studentRepo;
    }

    @PostMapping("/bulk")
    public ResponseEntity<?> saveBulk(@RequestBody List<Map<String, Object>> records) {
        int saved = 0;
        for (Map<String, Object> record : records) {
            Long studentId = Long.valueOf(record.get("studentId").toString());
            Student student = studentRepo.findById(studentId).orElse(null);
            if (student == null) continue;

            LocalDate date  = LocalDate.parse(record.get("date").toString());
            String subject  = record.get("subject").toString();
            boolean present = Boolean.parseBoolean(record.get("present").toString());

            // Update existing record if already marked, otherwise create new
            Attendance a = attendanceRepo
                    .findByStudentAndDateAndSubject(student, date, subject)
                    .orElse(new Attendance());
            a.setStudent(student);
            a.setDate(date);
            a.setSubject(subject);
            a.setPresent(present);
            attendanceRepo.save(a);
            saved++;
        }
        return ResponseEntity.ok(Map.of("message", "Attendance saved", "saved", saved));
    }

    // Student marks their own attendance for today
    @PostMapping("/self")
    public ResponseEntity<?> markSelf(@RequestBody SelfMarkRequest req) {
        if (req.rollNumber() == null || req.subject() == null)
            return ResponseEntity.badRequest().body(Map.of("error", "rollNumber and subject are required"));

        Student student = studentRepo.findByRollNumber(req.rollNumber().toUpperCase()).orElse(null);
        if (student == null) return ResponseEntity.badRequest().body(Map.of("error", "Student not found"));

        LocalDate today = LocalDate.now();
        if (attendanceRepo.existsByStudentAndDateAndSubject(student, today, req.subject()))
            return ResponseEntity.badRequest().body(Map.of("error", "Attendance already marked for this subject today"));

        Attendance a = new Attendance();
        a.setStudent(student);
        a.setDate(today);
        a.setSubject(req.subject());
        a.setPresent(true);
        attendanceRepo.save(a);
        return ResponseEntity.ok(Map.of("message", "Attendance marked successfully"));
    }

    // Student views their own attendance (last 90 days)
    @GetMapping("/my")
    public ResponseEntity<?> getMyAttendance(@RequestParam String rollNumber) {
        Student student = studentRepo.findByRollNumber(rollNumber.toUpperCase()).orElse(null);
        if (student == null) return ResponseEntity.notFound().build();

        LocalDate from = LocalDate.now().minusDays(90);
        LocalDate to   = LocalDate.now();
        List<Attendance> records = attendanceRepo.findByStudentAndDateBetween(student, from, to);

        long present = records.stream().filter(Attendance::isPresent).count();
        long total   = records.size();
        double pct   = total == 0 ? 0 : Math.round((present * 100.0 / total) * 10.0) / 10.0;

        List<Map<String, Object>> list = records.stream().map(r -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("date",    r.getDate().toString());
            m.put("subject", r.getSubject());
            m.put("present", r.isPresent());
            return m;
        }).toList();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("studentName", student.getName());
        response.put("rollNumber",  student.getRollNumber());
        response.put("department",  student.getDepartment());
        response.put("total",       total);
        response.put("present",     present);
        response.put("absent",      total - present);
        response.put("percentage",  pct);
        response.put("records",     list);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/report")
    public ResponseEntity<?> getReport(
            @RequestParam String roll,
            @RequestParam String from,
            @RequestParam String to) {

        Student student = studentRepo.findByRollNumber(roll).orElse(null);
        if (student == null) return ResponseEntity.notFound().build();

        List<Attendance> records = attendanceRepo.findByStudentAndDateBetween(
                student, LocalDate.parse(from), LocalDate.parse(to));

        long present = records.stream().filter(Attendance::isPresent).count();
        long total = records.size();
        double percentage = total == 0 ? 0 : Math.round((present * 100.0 / total) * 10.0) / 10.0;

        List<Map<String, Object>> recordList = records.stream().map(r -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("date", r.getDate().toString());
            m.put("subject", r.getSubject());
            m.put("present", r.isPresent());
            return m;
        }).toList();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("studentName", student.getName());
        response.put("total", total);
        response.put("present", present);
        response.put("absent", total - present);
        response.put("percentage", percentage);
        response.put("records", recordList);

        return ResponseEntity.ok(response);
    }

    record SelfMarkRequest(String rollNumber, String subject) {}
}
