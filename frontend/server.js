const express = require('express');
const path    = require('path');

const app    = express();
const PUBLIC = path.join(__dirname, 'public');
const SRC    = path.join(__dirname, 'src');

// Never cache HTML or JS so browsers always get the latest version
const noCache = (_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
};

app.use('/src',          noCache, express.static(SRC));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Clean URL routes — all served with no-cache
const pages = {
  '/':              'dashboard',
  '/dashboard':     'dashboard',
  '/students':      'students',
  '/courses':       'courses',
  '/attendance':    'attendance',
  '/reports':       'reports',
  '/login':         'login',
  '/signup':        'signup',
  '/student':       'student',
  '/student-mark':  'student-mark',
};

for (const [route, file] of Object.entries(pages)) {
  app.get(route, noCache, (_req, res) =>
    res.sendFile(path.join(PUBLIC, `${file}.html`)));
}

const PORT = 3000;
app.listen(PORT, () => console.log(`AttendPro → http://localhost:${PORT}`));
