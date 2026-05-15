# School Attendance Management System

**Backend:** Java 21 + Spring Boot 3  
**Frontend:** Vanilla JS + Express.js  
**Database:** MySQL 8

---

## Project Structure

```
college-attendance-management/
├── backend/                        # Spring Boot REST API
│   ├── pom.xml
│   └── src/main/java/.../
│       ├── AttendanceApplication.java   # Entry point + data seeder
│       ├── controller/
│       │   ├── AuthController.java      # Login / signup
│       │   ├── AttendanceController.java
│       │   ├── StudentController.java
│       │   ├── CourseController.java
│       │   └── DashboardController.java
│       ├── model/                       # JPA entities
│       └── repository/                  # Spring Data JPA
├── frontend/                       # Vanilla JS frontend
│   ├── server.js                   # Express server (clean URLs)
│   ├── public/                     # HTML pages
│   │   ├── dashboard.html          # Staff dashboard
│   │   ├── students.html           # Manage students
│   │   ├── courses.html            # View courses
│   │   ├── attendance.html         # Mark attendance (staff)
│   │   ├── reports.html            # Attendance reports
│   │   ├── login.html
│   │   ├── signup.html
│   │   ├── student.html            # Student attendance view
│   │   └── student-mark.html       # Student self-mark
│   └── src/
│       ├── pages/                  # Page-specific JS
│       └── services/
│           ├── api.js              # HTTP client
│           └── auth.js             # Auth + role guards
└── database/
    └── schema.sql                  # Table definitions
```

---

## Roles

| Role    | Can do                                                     |
|---------|------------------------------------------------------------|
| Staff   | Dashboard, manage students, mark attendance, view reports  |
| Student | View own attendance history, self-mark today's attendance  |

---

## Setup

### 1. Database
```sql
mysql -u root -p < database/schema.sql
```

### 2. Backend
Edit `backend/src/main/resources/application.properties` and set your MySQL password, then:
```bash
cd backend
mvn package -DskipTests
java -jar target/attendance-1.0.0.jar
```
Runs at **http://localhost:8080**  
Default admin created on first run: `admin@college.edu` / `admin123`  
5 courses are seeded automatically.

### 3. Frontend
```bash
cd frontend
npm install
npm start
```
Runs at **http://localhost:3000**

---

## API Endpoints

| Method | Endpoint                      | Role    | Description              |
|--------|-------------------------------|---------|--------------------------|
| POST   | /api/auth/signup              | Public  | Register (Staff/Student) |
| POST   | /api/auth/login               | Public  | Login                    |
| POST   | /api/auth/logout              | Any     | Logout                   |
| GET    | /api/students                 | Staff   | List students            |
| POST   | /api/students                 | Staff   | Add student              |
| DELETE | /api/students/{id}            | Staff   | Delete student           |
| GET    | /api/courses                  | Any     | List courses             |
| POST   | /api/attendance/bulk          | Staff   | Mark bulk attendance     |
| POST   | /api/attendance/self          | Student | Self-mark attendance     |
| GET    | /api/attendance/my            | Student | Own attendance history   |
| GET    | /api/attendance/report        | Staff   | Student report by date   |
| GET    | /api/dashboard/stats          | Staff   | Dashboard statistics     |
