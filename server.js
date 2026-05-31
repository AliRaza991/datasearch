const express = require('express');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessions = {};

const USERS = [
  { id: 1, username: "admin", password: "admin123", role: "admin", active: true, name: "Admin User" },
  { id: 2, username: "user1", password: "user123", role: "user", active: true, name: "Test User" }
];

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function requireAuth(req, res, next) {
  const token = req.headers['authorization'];
  if (!token || !sessions[token]) return res.status(401).json({ error: 'Unauthorized' });
  req.user = sessions[token];
  next();
}

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(u => u.username === username && u.password === password && u.active);
  if (!user) return res.status(401).json({ error: 'Invalid username or password' });

  const token = generateToken();
  sessions[token] = { id: user.id, username: user.username, name: user.name, role: user.role };
  setTimeout(() => delete sessions[token], 8 * 60 * 60 * 1000);

  res.json({ token, user: { name: user.name, role: user.role, username: user.username } });
});

app.post('/api/logout', requireAuth, (req, res) => {
  delete sessions[req.headers['authorization']];
  res.json({ success: true });
});

app.get('/api/me', requireAuth, (req, res) => res.json({ user: req.user }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`DataSearch running on port ${PORT}`));
