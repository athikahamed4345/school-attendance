async function loadSubjectOptions() {
  try {
    const courses = await api.get('/courses');
    const select  = document.getElementById('attendance-subject');
    courses.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.name;
      opt.textContent = `${c.code} — ${c.name}`;
      select.appendChild(opt);
    });
  } catch {
    // fallback: keep as-is
  }
}

function showNotice(msg, type) {
  const el = document.getElementById('att-notice');
  el.textContent = msg;
  el.style.display = 'block';
  el.style.background = type === 'error' ? '#fef2f2' : '#f0fdf4';
  el.style.color      = type === 'error' ? '#dc2626'  : '#16a34a';
  el.style.borderTop  = type === 'error' ? '1px solid #fecaca' : '1px solid #bbf7d0';
  el.style.borderBottom = el.style.borderTop;
}

// Default to today's date
document.getElementById('attendance-date').value = new Date().toISOString().split('T')[0];

document.getElementById('btn-load').addEventListener('click', async () => {
  const subject = document.getElementById('attendance-subject').value;
  if (!subject) { showNotice('Please select a subject first.', 'error'); return; }

  document.getElementById('att-notice').style.display = 'none';

  const students = await api.get('/students');
  const tbody    = document.getElementById('attendance-body');
  if (students.length === 0) {
    tbody.innerHTML = '<tr><td class="empty-td" colspan="3">No students found.</td></tr>';
    return;
  }
  tbody.innerHTML = students.map(s => `
    <tr>
      <td><strong>${s.rollNumber}</strong></td>
      <td>${s.name}</td>
      <td><input type="checkbox" name="present" value="${s.id}" checked/></td>
    </tr>`).join('');
});

document.getElementById('attendance-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const date    = document.getElementById('attendance-date').value;
  const subject = document.getElementById('attendance-subject').value;
  if (!date || !subject) { showNotice('Please select a date and subject.', 'error'); return; }

  const checkboxes = document.querySelectorAll('input[name="present"]');
  if (checkboxes.length === 0) { showNotice('Load students first.', 'error'); return; }

  const records = Array.from(checkboxes).map(cb => ({
    studentId: parseInt(cb.value),
    date, subject, present: cb.checked
  }));

  const btn = document.getElementById('btn-submit');
  btn.disabled = true;
  btn.textContent = 'Submitting…';

  try {
    const res = await api.post('/attendance/bulk', records);
    const saved = res.saved ?? records.length;
    showNotice(`Attendance saved for ${saved} student(s) — ${subject} on ${date}.`, 'success');
    document.getElementById('attendance-body').innerHTML =
      '<tr><td class="empty-td" colspan="3">Attendance submitted. Load again to mark another batch.</td></tr>';
  } catch (err) {
    showNotice(err.message || 'Failed to submit attendance. Is the backend running?', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Submit Attendance';
  }
});

loadSubjectOptions();
