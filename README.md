# College Attendance Management System

**Frontend:** JavaScript (Vanilla JS)  
**Backend:** Java (Spring Boot)  
**Database:** MySQL

---

## Project Structure

```
college-attendance-management/
├── frontend/          # Vanilla JS frontend
│   ├── public/        # HTML pages
│   └── src/
│       ├── pages/     # Page-specific JS
│       ├── services/  # API service layer
│       └── styles/    # CSS
├── backend/           # Spring Boot REST API
│   └── src/main/java/com/oxygenlabs/attendance/
│       ├── controller/
│       ├── model/
│       └── repository/
└── database/          # SQL scripts
    ├── schema.sql     # Table definitions
    └── seed.sql       # Sample data
```

---

## Setup Instructions

### 1. Database
```sql
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

### 2. Backend
Update `backend/src/main/resources/application.properties` with your MySQL password, then:
```bash
cd backend
mvn spring-boot:run
```
Backend runs at: http://localhost:8080

### 3. Frontend
Open `frontend/public/index.html` in your browser, or run a local server:
```bash
cd frontend
npm install
npm start
```

---

## API Endpoints

| Method | Endpoint                          | Description           |
|--------|-----------------------------------|-----------------------|
| GET    | /api/students                     | List all students     |
| POST   | /api/students                     | Add student           |
| PUT    | /api/students/{id}                | Update student        |
| DELETE | /api/students/{id}                | Delete student        |
| POST   | /api/attendance/bulk              | Submit attendance     |
| GET    | /api/attendance/report            | Get student report    |
| GET    | /api/dashboard/stats              | Dashboard statistics  |
