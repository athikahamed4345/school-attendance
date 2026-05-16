const auth = {
  TOKEN_KEY:  'att_token',
  USER_KEY:   'att_user',

  getToken()  { return localStorage.getItem(this.TOKEN_KEY); },
  getUser()   {
    try { return JSON.parse(localStorage.getItem(this.USER_KEY)); }
    catch { return null; }
  },
  isStaff()   { return this.getUser()?.role === 'STAFF'; },
  isStudent()  { return this.getUser()?.role === 'STUDENT'; },

  setSession(token, username, role, rollNumber) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify({ username, role, rollNumber: rollNumber ?? null }));
  },

  clear() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  },

  // Generic: must be logged in
  guard() {
    if (!this.getToken()) { window.location.replace('/login'); throw new Error('unauth'); }
  },

  // Staff-only pages — students get bounced to /student
  guardStaff() {
    if (!this.getToken()) { window.location.replace('/login');   throw new Error('unauth'); }
    if (this.isStudent()) { window.location.replace('/student'); throw new Error('not staff'); }
  },

  // Student-only page — staff get bounced to /dashboard
  guardStudent() {
    if (!this.getToken())  { window.location.replace('/login');    throw new Error('unauth'); }
    if (!this.isStudent()) { window.location.replace('/dashboard'); throw new Error('not student'); }
  },

  initSidebar() {
    const user     = this.getUser();
    const username = user?.username ?? 'User';
    const nameEl   = document.getElementById('sidebar-username');
    const avatarEl = document.getElementById('sidebar-avatar');
    if (nameEl)   nameEl.textContent   = username;
    if (avatarEl) avatarEl.textContent = username[0].toUpperCase();
    document.querySelector('.btn-logout')
      ?.addEventListener('click', () => this.logout());
  },

  async logout() {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${this.getToken()}` }
      });
    } catch {}
    this.clear();
    window.location.replace('/login');
  }
};
