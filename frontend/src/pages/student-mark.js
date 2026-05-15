const user = auth.getUser();
if (!user?.rollNumber) {
  alert('No roll number linked to this account. Contact your administrator.');
  auth.logout();
}

const rollNumber = user.rollNumber;
document.getElementById('student-info').textContent = `Roll No: ${rollNumber}`;

const today = new Date().toISOString().split('T')[0];
document.getElementById('mark-date').value = today;

async function loadSubjects() {
  try {
    const courses = await api.get('/courses');
    const select  = document.getElementById('mark-subject');
    courses.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.name;
      opt.textContent = `${c.code} — ${c.name}`;
      select.appendChild(opt);
    });
  } catch {
    showAlert('Failed to load subjects. Please refresh.', 'error');
  }
}

async function loadTodayRecords() {
  try {
    const data        = await api.get(`/attendance/my?rollNumber=${encodeURIComponent(rollNumber)}`);
    const allRecords  = data.records || [];
    const todayRecords = allRecords.filter(r => r.date === today);
    renderTodayTable(todayRecords);
  } catch {
    // silently ignore
  }
}

function renderTodayTable(records) {
  const tbody = document.getElementById('today-body');
  if (records.length === 0) {
    tbody.innerHTML = '<tr><td class="empty-td" colspan="2">No records marked today yet.</td></tr>';
    return;
  }
  tbody.innerHTML = records.map(r => `
    <tr>
      <td>${r.subject}</td>
      <td><span class="status-badge present">Present</span></td>
    </tr>`).join('');
}

function showAlert(msg, type) {
  const el = document.getElementById('mark-alert');
  el.textContent = msg;
  el.style.display = 'block';
  el.style.background = type === 'error' ? '#fef2f2' : '#f0fdf4';
  el.style.color      = type === 'error' ? 'var(--red)' : 'var(--green)';
  el.style.border     = type === 'error' ? '1px solid #fecaca' : '1px solid #bbf7d0';
}

document.getElementById('btn-mark').addEventListener('click', async () => {
  const subject = document.getElementById('mark-subject').value;
  if (!subject) { showAlert('Please select a subject.', 'error'); return; }

  const btn = document.getElementById('btn-mark');
  btn.disabled = true;
  btn.textContent = 'Marking…';

  try {
    await api.post('/attendance/self', { rollNumber, subject });
    showAlert(`Attendance marked for ${subject}!`, 'success');
    document.getElementById('mark-subject').value = '';
    loadTodayRecords();
  } catch (err) {
    const msg = err?.message || 'Failed to mark attendance.';
    showAlert(msg.includes('already') ? 'Already marked for this subject today.' : msg, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Mark Present';
  }
});

loadSubjects();
loadTodayRecords();
