const express = require('express');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET = process.env.SESSION_SECRET || 'datasearch-secret-key-2026';
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://syedaliraza991_db_user:ADYX5obyb5mb4ohx@datasearch.yjc2tol.mongodb.net/datasearch?appName=datasearch';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  designation: { type: String, default: '' },
  role: { type: String, default: 'user' },
  active: { type: Boolean, default: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected!');
    const exists = await User.findOne({ username: 'admin' });
    if (!exists) {
      await User.create({ username: 'admin', password: 'admin123', name: 'Admin User', designation: 'Super Admin', role: 'admin', active: true });
      console.log('Default admin created');
    }
  })
  .catch(err => console.log('MongoDB error:', err));

function createToken(user) {
  const payload = JSON.stringify({ id: user._id, username: user.username, role: user.role, name: user.name, designation: user.designation, ts: Date.now() });
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

async function requireAuth(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const user = await User.findById(payload.id);
    if (!user || !user.active) return res.status(401).json({ error: 'Unauthorized' });
    req.user = user;
    next();
  } catch(e) {
    return res.status(401).json({ error: 'Unauthorized - please login again' });
  }
}

async function requireAdmin(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const user = await User.findById(payload.id);
    if (!user || !user.active || user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    req.user = user;
    next();
  } catch(e) {
    return res.status(401).json({ error: 'Unauthorized - please login again' });
  }
}

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password, active: true });
  if (!user) return res.status(401).json({ error: 'Invalid username or password' });
  const token = createToken(user);
  res.json({ token, user: { name: user.name, role: user.role, designation: user.designation, username: user.username } });
});

app.post('/api/logout', (req, res) => res.json({ success: true }));

app.get('/api/me', requireAuth, (req, res) => {
  res.json({ user: { name: req.user.name, role: req.user.role, username: req.user.username } });
});

app.get('/api/admin/users', requireAdmin, async (req, res) => {
  const users = await User.find({}, '-password');
  res.json({ users });
});

app.post('/api/admin/users', requireAdmin, async (req, res) => {
  const { username, password, name, role } = req.body;
  if (!username || !password || !name) return res.status(400).json({ error: 'All fields required' });
  try {
    const user = await User.create({ username, password, name, role: role || 'user', active: true });
    const { password: _, ...safe } = user.toObject();
    res.json({ success: true, user: safe });
  } catch(e) {
    res.status(400).json({ error: 'Username already exists' });
  }
});

app.patch('/api/admin/users/:id', requireAdmin, async (req, res) => {
  const { username, password, name, active } = req.body;
  const update = {};
  if (username) update.username = username;
  if (password) update.password = password;
  if (name) update.name = name;
  if (active !== undefined) update.active = active;
  if (req.body.designation !== undefined) update.designation = req.body.designation;
  const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select('-password');
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true, user });
});

app.delete('/api/admin/users/:id', requireAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => console.log(`DataSearch running on port ${PORT}`));
