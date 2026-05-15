-- College Attendance Management System — Database Schema
-- Tables are also auto-created by Spring Boot (ddl-auto=update)

CREATE DATABASE IF NOT EXISTS attendance_db;
USE attendance_db;

CREATE TABLE IF NOT EXISTS users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    username    VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(20)  NOT NULL DEFAULT 'STAFF',
    roll_number VARCHAR(20)  DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS students (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    roll_number VARCHAR(20)  NOT NULL UNIQUE,
    department  VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS courses (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    code       VARCHAR(20)  NOT NULL UNIQUE,
    name       VARCHAR(150) NOT NULL,
    department VARCHAR(100) NOT NULL,
    credits    INT          NOT NULL
);

CREATE TABLE IF NOT EXISTS attendance (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT       NOT NULL,
    date       DATE         NOT NULL,
    subject    VARCHAR(150) NOT NULL,
    present    BOOLEAN      NOT NULL DEFAULT TRUE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON attendance(student_id, date);
