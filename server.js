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
  active: { type: Boolean, default: true },
  deviceCode: String,
  registeredDeviceToken: String,
  deviceRegistered: Boolean,
  tokenVersion: Number
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

function generateDeviceCode(){
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for(let i=0; i<8; i++){
    if(i===4) code+='-';
    code += chars[Math.floor(Math.random()*chars.length)];
  }
  return code;
}

function generateDeviceToken(){
  const arr = new Uint8Array(32);
  for(let i=0;i<32;i++) arr[i]=Math.floor(Math.random()*256);
  return Array.from(arr).map(b=>b.toString(16).padStart(2,'0')).join('');
}

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
    // Check if device was reset after token was issued
    if(user.tokenVersion && payload.ts && user.tokenVersion > payload.ts){
      return res.status(401).json({ error: 'DEVICE_RESET', message: 'Your device has been reset. Please login again.' });
    }
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
  const { username, password, deviceCode, deviceToken } = req.body;
  const user = await User.findOne({ username, password, active: true });
  if(!user) return res.status(401).json({ error: 'Invalid username or password' });

  // Admin bypass - no device restriction
  if(user.role === 'admin'){
    const token = createToken(user);
    return res.json({ token, user: { name: user.name, role: user.role, designation: user.designation, username: user.username } });
  }

  // Check if device already registered
  if(user.deviceRegistered){
    if(!deviceToken || deviceToken !== user.registeredDeviceToken){
      return res.status(403).json({ error: 'DEVICE_NOT_AUTHORIZED', message: 'This device is not authorized. Please use your registered device.' });
    }
    const token = createToken(user);
    return res.json({ token, user: { name: user.name, role: user.role, designation: user.designation, username: user.username } });
  }

  // First time - device not registered yet
  if(!deviceCode){
    return res.status(403).json({ error: 'DEVICE_CODE_REQUIRED', message: 'Please enter your device code to register this device.' });
  }

  if(deviceCode.toUpperCase().replace(/-/g,'') !== (user.deviceCode||'').replace(/-/g,'')){
    return res.status(403).json({ error: 'INVALID_DEVICE_CODE', message: 'Invalid device code. Please contact admin.' });
  }

  // Register device
  const newDeviceToken = generateDeviceToken();
  await User.findByIdAndUpdate(user._id, {
    deviceRegistered: true,
    registeredDeviceToken: newDeviceToken
  });

  const token = createToken(user);
  return res.json({
    token,
    deviceToken: newDeviceToken,
    user: { name: user.name, role: user.role, designation: user.designation, username: user.username }
  });
});

app.post('/api/logout', (req, res) => res.json({ success: true }));

app.get('/api/me', requireAuth, (req, res) => {
  res.json({ user: { name: req.user.name, role: req.user.role, username: req.user.username } });
});

app.post('/api/admin/users/:id/device-code', requireAdmin, async (req, res) => {
  try{
    const code = generateDeviceCode();
    await User.findByIdAndUpdate(req.params.id, {
      deviceCode: code,
      deviceRegistered: false,
      registeredDeviceToken: null
    });
    res.json({ success: true, deviceCode: code });
  }catch(e){
    res.status(500).json({ error: 'Failed to generate device code' });
  }
});

app.post('/api/admin/users/:id/reset-device', requireAdmin, async (req, res) => {
  try{
    const newCode = generateDeviceCode();
    await User.findByIdAndUpdate(req.params.id, {
      deviceRegistered: false,
      registeredDeviceToken: null,
      deviceCode: newCode,
      tokenVersion: Date.now()
    });
    res.json({ success: true, message: 'Device reset successfully', deviceCode: newCode });
  }catch(e){
    res.status(500).json({ error: 'Failed to reset device' });
  }
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
