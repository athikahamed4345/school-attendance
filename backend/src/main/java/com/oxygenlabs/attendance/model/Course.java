package com.oxygenlabs.attendance.model;

import jakarta.persistence.*;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String department;

    @Column(nullable = false)
    private int credits;

    public Course() {}
    public Course(String code, String name, String department, int credits) {
        this.code = code;
        this.name = name;
        this.department = department;
        this.credits = credits;
    }

    public Long getId()           { return id; }
    public String getCode()       { return code; }
    public String getName()       { return name; }
    public String getDepartment() { return department; }
    public int getCredits()       { return credits; }
}
