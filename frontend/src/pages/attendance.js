const _d = new Date();
document.getElementById('attendance-date').value =
  `${_d.getFullYear()}-${String(_d.getMonth()+1).padStart(2,'0')}-${String(_d.getDate()).padStart(2,'0')}`;

document.getElementById('btn-load').addEventListener('click', async () => {
  const subject = document.getElementById('attendance-subject').value;
  if (!subject) { showNotice('att-notice', 'Please select a subject first.', 'error'); return; }

  document.getElementById('att-notice').style.display = 'none';

  try {
    const students = await api.get('/students');
    const tbody    = document.getElementById('attendance-body');
    if (students.length === 0) {
      tbody.innerHTML = '<tr><td class="empty-td" colspan="4">No students found.</td></tr>';
      return;
    }
    tbody.innerHTML = students.map(s => `
      <tr>
        <td><strong>${s.rollNumber}</strong></td>
        <td>${s.name}</td>
        <td style="text-align:center">
          <input type="radio" name="att_${s.id}" value="present" checked/>
        </td>
        <td style="text-align:center">
          <input type="radio" name="att_${s.id}" value="absent"/>
        </td>
      </tr>`).join('');
  } catch {
    showNotice('att-notice', 'Failed to load students.', 'error');
  }
});

document.getElementById('attendance-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const date    = document.getElementById('attendance-date').value;
  const subject = document.getElementById('attendance-subject').value;
  if (!date || !subject) { showNotice('att-notice', 'Please select a date and subject.', 'error'); return; }

  const radios = document.querySelectorAll('input[type="radio"]:checked');
  if (radios.length === 0) { showNotice('att-notice', 'Load students first.', 'error'); return; }

  const records = Array.from(radios).map(r => ({
    studentId: parseInt(r.name.replace('att_', '')),
    date, subject,
    present: r.value === 'present'
  }));

  const btn = document.getElementById('btn-submit');
  btn.disabled = true;
  btn.textContent = 'Submitting…';

  try {
    await api.post('/attendance/bulk', records);
    showNotice('att-notice', 'Attendance submitted! Going to dashboard…', 'success');
    setTimeout(() => window.location.href = '/dashboard', 1000);
  } catch (err) {
    showNotice('att-notice', err.message || 'Failed to submit. Is the backend running?', 'error');
    btn.disabled = false;
    btn.textContent = 'Submit Attendance';
  }
});

loadCourseOptions('attendance-subject');
