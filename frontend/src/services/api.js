const API_BASE = 'http://localhost:8080/api';

const api = {
  _headers(withBody = false) {
    const h = {};
    if (withBody) h['Content-Type'] = 'application/json';
    const token = localStorage.getItem('att_token');
    if (token) h['Authorization'] = `Bearer ${token}`;
    return h;
  },

  _handle401() {
    if (typeof auth !== 'undefined') auth.clear();
    window.location.replace('/login');
    throw new Error('Session expired');
  },

  async get(endpoint) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: this._headers(),
      cache: 'no-store'
    });
    if (res.status === 401) this._handle401();
    if (!res.ok) throw new Error(`GET ${endpoint} → ${res.status}`);
    return res.json();
  },

  async post(endpoint, data) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method:  'POST',
      headers: this._headers(true),
      body:    JSON.stringify(data)
    });
    if (res.status === 401) this._handle401();
    if (!res.ok) {
      let msg = `POST ${endpoint} → ${res.status}`;
      try { const j = await res.json(); if (j.error) msg = j.error; } catch {}
      throw new Error(msg);
    }
    return res.json();
  },

  async delete(endpoint) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method:  'DELETE',
      headers: this._headers()
    });
    if (res.status === 401) this._handle401();
    if (!res.ok) throw new Error(`DELETE ${endpoint} → ${res.status}`);
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }
};
