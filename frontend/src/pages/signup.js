if (auth.getToken()) window.location.replace(auth.isStudent() ? '/student' : '/dashboard');

// Role tab switching
document.querySelectorAll('.role-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const role = tab.dataset.role;
    document.getElementById('selected-role').value = role;
    document.getElementById('roll-group').style.display = role === 'STUDENT' ? 'flex' : 'none';
    document.getElementById('rollNumber').required = role === 'STUDENT';
  });
});

document.getElementById('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username   = document.getElementById('username').value.trim();
  const email      = document.getElementById('email').value.trim();
  const password   = document.getElementById('password').value;
  const confirm    = document.getElementById('confirm').value;
  const role       = document.getElementById('selected-role').value;
  const rollNumber = document.getElementById('rollNumber').value.trim().toUpperCase();
  const errEl      = document.getElementById('auth-error');
  const okEl       = document.getElementById('auth-success');
  const btn        = document.getElementById('submit-btn');

  errEl.style.display = 'none';
  okEl.style.display  = 'none';

  if (password !== confirm) {
    errEl.textContent = 'Passwords do not match';
    errEl.style.display = 'block'; return;
  }

  btn.disabled = true; btn.textContent = 'Creating account…';

  try {
    const body = { username, email, password, role };
    if (role === 'STUDENT') body.rollNumber = rollNumber;

    const res  = await fetch('http://localhost:8080/api/auth/signup', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();

    if (!res.ok) {
      errEl.textContent = data.error || 'Signup failed';
      errEl.style.display = 'block';
      btn.disabled = false; btn.textContent = 'Create account'; return;
    }

    okEl.textContent   = 'Account created! Redirecting to login…';
    okEl.style.display = 'block';
    setTimeout(() => window.location.replace('/login'), 1500);
  } catch {
    errEl.textContent = 'Cannot reach server. Is the backend running?';
    errEl.style.display = 'block';
    btn.disabled = false; btn.textContent = 'Create account';
  }
});
