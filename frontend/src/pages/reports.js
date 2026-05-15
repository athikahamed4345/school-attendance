document.getElementById('btn-generate').addEventListener('click', async () => {
  const roll = document.getElementById('report-roll').value.trim();
  const from = document.getElementById('report-from').value;
  const to   = document.getElementById('report-to').value;
  const out  = document.getElementById('report-output');

  if (!roll || !from || !to) { alert('Please fill all fields.'); return; }

  out.innerHTML = '<p style="padding:20px;color:var(--muted)">Loading…</p>';

  try {
    const data = await api.get(`/attendance/report?roll=${roll}&from=${from}&to=${to}`);
    const pct  = data.percentage ?? 0;
    const cls  = pct >= 75 ? 'good' : pct >= 50 ? 'warn' : 'bad';

    out.innerHTML = `
      <div class="report-summary">
        <div class="report-stat">
          <div class="rs-num">${data.studentName}</div>
          <div class="rs-lbl">Student — ${roll}</div>
        </div>
        <div class="report-stat">
          <div class="rs-num">${data.total}</div>
          <div class="rs-lbl">Total Classes</div>
        </div>
        <div class="report-stat" style="color:var(--green)">
          <div class="rs-num">${data.present}</div>
          <div class="rs-lbl">Present</div>
        </div>
        <div class="report-stat" style="color:var(--red)">
          <div class="rs-num">${data.absent}</div>
          <div class="rs-lbl">Absent</div>
        </div>
        <div class="report-stat">
          <span class="pct ${cls}" style="font-size:1.3rem;padding:4px 14px">${pct}%</span>
          <div class="rs-lbl" style="margin-top:4px">Attendance</div>
        </div>
      </div>
      <table>
        <thead><tr><th>Date</th><th>Subject</th><th>Status</th></tr></thead>
        <tbody>
          ${data.records.length === 0
            ? '<tr><td class="empty-td" colspan="3">No records in this date range</td></tr>'
            : data.records.map(r => `
              <tr>
                <td>${r.date}</td>
                <td>${r.subject}</td>
                <td><span class="pct ${r.present ? 'good' : 'bad'}">${r.present ? 'Present' : 'Absent'}</span></td>
              </tr>`).join('')}
        </tbody>
      </table>`;
  } catch (err) {
    out.innerHTML = '<p style="padding:20px;color:var(--muted)">No records found for the given criteria.</p>';
  }
});
