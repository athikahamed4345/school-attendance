-- College Attendance Management System - Database Schema
-- Run this script in MySQL to set up the database

CREATE DATABASE IF NOT EXISTS attendance_db;
USE attendance_db;

CREATE TABLE IF NOT EXISTS students (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    roll_number VARCHAR(20)  NOT NULL UNIQUE,
    department  VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS attendance (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT       NOT NULL,
    date       DATE         NOT NULL,
    subject    VARCHAR(100) NOT NULL,
    present    BOOLEAN      NOT NULL DEFAULT TRUE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE INDEX idx_attendance_student_date ON attendance(student_id, date);
