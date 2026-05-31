const express = require('express');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET = process.env.SESSION_SECRET || 'datasearch-secret-key-2026';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const USERS = [
  { id: 1, username: "admin", password: "admin123", role: "admin", active: true, name: "Admin User" },
  { id: 2, username: "user1", password: "user123", role: "user", active: true, name: "Test User" }
];

function createToken(user) {
  const payload = JSON.stringify({ id: user.id, username: user.username, role: user.role, name: user.name, ts: Date.now() });
  const encoded = Buffer.from(payload).toString('base64');
  const sig = crypto.createHmac('sha256', SECRET).update(encoded).digest('hex');
  return `${encoded}.${sig}`;
}

function verifyToken(token) {
  try {
    const [encoded, sig] = token.split('.');
    const expected = crypto.createHmac('sha256', SECRET).update(encoded).digest('hex');
    if (sig !== expected) return null;
    const payload = JSON.parse(Buffer.from(encoded, 'base64').toString());
    if (Date.now() - payload.ts > 8 * 60 * 60 * 1000) return null;
    return payload;
  } catch(e) { return null; }
}

function requireAuth(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const user = verifyToken(token);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  const dbUser = USERS.find(u => u.id === user.id && u.active);
  if (!dbUser) return res.status(401).json({ error: 'Unauthorized' });
  req.user = user;
  next();
}

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(u => u.username === username && u.password === password && u.active);
  if (!user) return res.status(401).json({ error: 'Invalid username or password' });
  const token = createToken(user);
  res.json({ token, user: { name: user.name, role: user.role, username: user.username } });
});

app.post('/api/logout', (req, res) => res.json({ success: true }));

app.get('/api/me', requireAuth, (req, res) => res.json({ user: req.user }));

app.get('/api/admin/users', requireAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  const safe = USERS.map(({ password, ...u }) => u);
  res.json({ users: safe });
});

app.patch('/api/admin/users/:id', requireAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  const user = USERS.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'Not found' });
  if (req.body.username) user.username = req.body.username;
  if (req.body.password) user.password = req.body.password;
  if (req.body.name) user.name = req.body.name;
  if (req.body.active !== undefined) user.active = req.body.active;
  const { password, ...safe } = user;
  res.json({ success: true, user: safe });
});

app.post('/api/admin/users', requireAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  const { username, password, name, role } = req.body;
  if (!username || !password || !name) return res.status(400).json({ error: 'All fields required' });
  if (USERS.find(u => u.username === username)) return res.status(400).json({ error: 'Username exists' });
  const newUser = { id: Date.now(), username, password, name, role: role || 'user', active: true };
  USERS.push(newUser);
  const { password: _, ...safe } = newUser;
  res.json({ success: true, user: safe });
});

app.delete('/api/admin/users/:id', requireAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  const idx = USERS.findIndex(u => u.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  USERS.splice(idx, 1);
  res.json({ success: true });
});

app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => console.log(`DataSearch running on port ${PORT}`));
