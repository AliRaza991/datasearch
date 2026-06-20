const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://syedaliraza991_db_user:ADYX5obyb5mb4ohx@datasearch.yjc2tol.mongodb.net/datasearch?appName=datasearch';
const ADMIN_USERNAME = 'syedaliraza991@gmail.com';
const ADMIN_PASSWORD = 'RazaAliSyed@3491';

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
  tokenVersion: Number,
  pages: { type: [String], default: ['datasearch','sod','eod'] }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

(async () => {
  await mongoose.connect(MONGO_URI);
  let admin = await User.findOne({ username: ADMIN_USERNAME });
  if (admin) {
    admin.password = ADMIN_PASSWORD;
    admin.role = 'admin';
    admin.active = true;
    admin.pages = ['datasearch','sod','eod'];
    admin.deviceRegistered = false;
    admin.registeredDeviceToken = null;
    await admin.save();
    console.log('RESULT: admin already existed -> updated/restored');
  } else {
    await User.create({
      username: ADMIN_USERNAME, password: ADMIN_PASSWORD, name: 'Admin User',
      designation: 'Super Admin', role: 'admin', active: true,
      pages: ['datasearch','sod','eod']
    });
    console.log('RESULT: admin recreated');
  }
  const count = await User.countDocuments({ role: 'admin' });
  console.log('Total admin users now:', count);
  await mongoose.disconnect();
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
