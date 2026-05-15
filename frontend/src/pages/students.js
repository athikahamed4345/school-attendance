async function loadStudents() {
  const tbody = document.getElementById('students-body');
  try {
    const students = await api.get('/students');
    document.getElementById('student-count').textContent = `${students.length} student${students.length !== 1 ? 's' : ''}`;
    if (students.length === 0) {
      tbody.innerHTML = '<tr><td class="empty-td" colspan="4">No students found. Add one to get started.</td></tr>';
      return;
    }
    tbody.innerHTML = students.map(s => `
      <tr>
        <td><strong>${s.rollNumber}</strong></td>
        <td>${s.name}</td>
        <td>${s.department}</td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="deleteStudent(${s.id})">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = '<tr><td class="empty-td" colspan="4">Failed to load students. Is the backend running?</td></tr>';
  }
}

async function deleteStudent(id) {
  if (!confirm('Delete this student?')) return;
  await api.delete(`/students/${id}`);
  loadStudents();
}

document.getElementById('btn-add-student').addEventListener('click', () => {
  const name       = prompt('Student Name:');
  if (!name) return;
  const rollNumber = prompt('Roll Number:');
  if (!rollNumber) return;
  const department = prompt('Department:');
  if (!department) return;
  api.post('/students', { name, rollNumber, department }).then(loadStudents);
});

loadStudents();
