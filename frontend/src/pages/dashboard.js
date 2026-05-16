function setDate() {
  const d = new Date();
  const opts = { weekday: 'short', day: '2-digit', month: 'long', year: 'numeric' };
  document.getElementById('header-date').textContent = d.toLocaleDateString('en-GB', opts);
}

function setDonut(present, absent) {
  const donut = document.getElementById('donut');
  const msg   = document.getElementById('donut-msg');
  const total  = present + absent;

  if (total === 0) {
    donut.style.background = 'conic-gradient(#94a3b8 100%)';
    msg.textContent = 'No attendance marked today yet';
    return;
  }

  const pct = Math.round((present / total) * 100);
  donut.style.background = `conic-gradient(#10b981 ${pct}%, #ef4444 ${pct}% 100%)`;
  msg.textContent = `${pct}% attendance today (${present} present, ${absent} absent)`;
}

async function loadDashboard() {
  const badge = document.getElementById('server-badge');
  const label = document.getElementById('server-label');

  try {
    const stats   = await api.get('/dashboard/stats?t=' + Date.now());
    const total   = stats.totalStudents ?? 0;
    const present = stats.todayPresent  ?? 0;
    const absent  = stats.todayAbsent   ?? 0;
    const courses = stats.totalSubjects ?? 0;

    document.getElementById('stat-students').textContent = total;
    document.getElementById('stat-courses').textContent  = courses;
    document.getElementById('stat-present').textContent  = present;
    document.getElementById('stat-absent').textContent   = absent;

    setDonut(present, absent);

    badge.classList.remove('offline');
    const now = new Date();
    label.textContent = `Updated ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
  } catch {
    badge.classList.add('offline');
    label.textContent = 'Server Offline';
    ['stat-students','stat-courses','stat-present','stat-absent']
      .forEach(id => document.getElementById(id).textContent = '—');
  }
}

setDate();
loadDashboard();

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') loadDashboard();
});

setInterval(loadDashboard, 10000);
