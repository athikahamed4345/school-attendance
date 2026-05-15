package com.oxygenlabs.attendance.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    // "STAFF" or "STUDENT"
    @Column(nullable = false)
    private String role = "STAFF";

    // Only set for STUDENT role — links to students.roll_number
    @Column
    private String rollNumber;

    public Long getId()           { return id; }
    public void setId(Long id)    { this.id = id; }

    public String getUsername()            { return username; }
    public void setUsername(String u)      { this.username = u; }

    public String getEmail()               { return email; }
    public void setEmail(String e)         { this.email = e; }

    public String getPassword()            { return password; }
    public void setPassword(String p)      { this.password = p; }

    public String getRole()                { return role; }
    public void setRole(String r)          { this.role = r; }

    public String getRollNumber()          { return rollNumber; }
    public void setRollNumber(String rn)   { this.rollNumber = rn; }
}
