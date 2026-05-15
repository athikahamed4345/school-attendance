const user = auth.getUser();
if (!user?.rollNumber) {
  alert('No roll number linked to this account. Contact your administrator.');
  auth.logout();
}

const rollNumber = user.rollNumber;
document.getElementById('student-info').textContent = `Roll No: ${rollNumber}`;

async function loadAttendance() {
  try {
    const data    = await api.get(`/attendance/my?rollNumber=${encodeURIComponent(rollNumber)}`);
    const records = data.records || [];
    const present = data.present ?? records.filter(r => r.present).length;
    const absent  = data.absent  ?? records.filter(r => !r.present).length;
    const total   = data.total   ?? records.length;
    const pct     = total > 0 ? Math.round((present / total) * 100) : 0;

    document.getElementById('s-present').textContent = present;
    document.getElementById('s-absent').textContent  = absent;
    document.getElementById('s-total').textContent   = total;

    const badge = document.getElementById('pct-badge');
    const pctEl = document.getElementById('pct-text');
    pctEl.textContent = `${pct}% Attendance`;
    badge.style.display    = 'flex';
    badge.style.background = pct >= 75 ? 'var(--green-light)' : pct >= 50 ? '#fff7ed' : '#fef2f2';
    badge.style.color      = pct >= 75 ? 'var(--green)'       : pct >= 50 ? '#f97316'  : 'var(--red)';

    const tbody = document.getElementById('att-body');
    if (records.length === 0) {
      tbody.innerHTML = '<tr><td class="empty-td" colspan="3">No attendance records found.</td></tr>';
      return;
    }
    tbody.innerHTML = records
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(r => `
        <tr>
          <td>${formatDate(r.date)}</td>
          <td>${r.subject}</td>
          <td><span class="status-badge ${r.present ? 'present' : 'absent'}">${r.present ? 'Present' : 'Absent'}</span></td>
        </tr>`)
      .join('');
  } catch {
    document.getElementById('att-body').innerHTML =
      '<tr><td class="empty-td" colspan="3">Failed to load attendance records.</td></tr>';
  }
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

loadAttendance();
