const user = auth.getUser();
if (!user?.rollNumber) {
  alert('No roll number linked to this account. Contact your administrator.');
  auth.logout();
}

const rollNumber = user.rollNumber;
document.getElementById('student-info').textContent = `Roll No: ${rollNumber}`;

const _n = new Date();
const today = `${_n.getFullYear()}-${String(_n.getMonth()+1).padStart(2,'0')}-${String(_n.getDate()).padStart(2,'0')}`;
document.getElementById('mark-date').value = today;

async function loadTodayRecords() {
  try {
    const data        = await api.get(`/attendance/my?rollNumber=${encodeURIComponent(rollNumber)}`);
    const todayRecords = (data.records || []).filter(r => r.date === today);
    const tbody = document.getElementById('today-body');
    if (todayRecords.length === 0) {
      tbody.innerHTML = '<tr><td class="empty-td" colspan="2">No records marked today yet.</td></tr>';
      return;
    }
    tbody.innerHTML = todayRecords.map(r => `
      <tr>
        <td>${r.subject}</td>
        <td><span class="status-badge present">Present</span></td>
      </tr>`).join('');
  } catch {}
}

document.getElementById('btn-mark').addEventListener('click', async () => {
  const subject = document.getElementById('mark-subject').value;
  if (!subject) { showNotice('mark-alert', 'Please select a subject.', 'error'); return; }

  const btn = document.getElementById('btn-mark');
  btn.disabled = true;
  btn.textContent = 'Marking…';

  try {
    await api.post('/attendance/self', { rollNumber, subject });
    showNotice('mark-alert', `Attendance marked for ${subject}!`, 'success');
    document.getElementById('mark-subject').value = '';
    loadTodayRecords();
  } catch (err) {
    const msg = err?.message || 'Failed to mark attendance.';
    showNotice('mark-alert', msg.includes('already') ? 'Already marked for this subject today.' : msg, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Mark Present';
  }
});

loadCourseOptions('mark-subject');
loadTodayRecords();
