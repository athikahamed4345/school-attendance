-- Sample seed data
USE attendance_db;

INSERT INTO students (name, roll_number, department) VALUES
  ('Athik Ahamed',   'CS001', 'Computer Science'),
  ('Priya Sharma',   'CS002', 'Computer Science'),
  ('Ravi Kumar',     'EC001', 'Electronics'),
  ('Anjali Nair',    'ME001', 'Mechanical'),
  ('Mohammed Arif',  'CS003', 'Computer Science');

INSERT INTO attendance (student_id, date, subject, present) VALUES
  (1, CURDATE(), 'Data Structures', TRUE),
  (2, CURDATE(), 'Data Structures', TRUE),
  (3, CURDATE(), 'Data Structures', FALSE),
  (4, CURDATE(), 'Data Structures', TRUE),
  (5, CURDATE(), 'Data Structures', TRUE);
