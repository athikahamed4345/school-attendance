function showNotice(elId, msg, type) {
  const el = document.getElementById(elId);
  el.textContent = msg;
  el.style.display = 'block';
  el.style.background = type === 'error' ? '#fef2f2' : '#f0fdf4';
  el.style.color      = type === 'error' ? '#dc2626'  : '#16a34a';
  el.style.border     = type === 'error' ? '1px solid #fecaca' : '1px solid #bbf7d0';
}

async function loadCourseOptions(selectId) {
  try {
    const courses = await api.get('/courses');
    const select  = document.getElementById(selectId);
    courses.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.name;
      opt.textContent = `${c.code} — ${c.name}`;
      select.appendChild(opt);
    });
  } catch {}
}
