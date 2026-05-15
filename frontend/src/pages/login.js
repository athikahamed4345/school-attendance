if (auth.getToken()) {
  window.location.replace(auth.isStudent() ? '/student' : '/dashboard');
}

// Tab switching
document.querySelectorAll('.role-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('login-hint').textContent =
      tab.dataset.role === 'STUDENT'
        ? 'Login with your registered student email'
        : 'Login with your staff credentials';
  });
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const errEl    = document.getElementById('auth-error');
  const btn      = document.getElementById('submit-btn');

  errEl.style.display = 'none';
  btn.disabled = true;
  btn.textContent = 'Signing in…';

  try {
    const res  = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (!res.ok) {
      errEl.textContent = data.error || 'Login failed';
      errEl.style.display = 'block';
      btn.disabled = false; btn.textContent = 'Sign in';
      return;
    }

    auth.setSession(data.token, data.username, data.role, data.rollNumber);
    window.location.replace(data.role === 'STUDENT' ? '/student' : '/dashboard');
  } catch {
    errEl.textContent = 'Cannot reach server. Is the backend running?';
    errEl.style.display = 'block';
    btn.disabled = false; btn.textContent = 'Sign in';
  }
});
