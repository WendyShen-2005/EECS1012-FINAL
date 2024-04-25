const express = require('express');
const path = require('path');
const multer = require('multer');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const usersDb = {};

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

app.use(express.static(path.join(__dirname, '../frontend')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'frontend/images'));
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });
app.post('/api/upload', upload.single('bgImg'), (req, res) => {
  res.json({ message: 'File uploaded successfully.', file: req.file });
});

app.post('/api/signup', async (req, res) => {
  console.log(req.body);  // Log incoming data for debugging
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
  }

  if (usersDb[username]) {
      return res.status(400).json({ message: 'Username already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 8);
  usersDb[username] = { password: hashedPassword };

  res.json({ message: 'Signup successful.', success: true });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = usersDb[username];
  if (!user) return res.status(400).json({ message: 'User does not exist' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  req.session.username = username;
  res.json({ message: 'Login successful', success: true });
});

app.get('/api/settings', (req, res) => {
  const { username } = req.session;
  if (!username || !usersDb[username]) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(usersDb[username]);
});

app.post('/api/updateSettings', async (req, res) => {
  const { username } = req.session;
  if (!username || !usersDb[username]) return res.status(404).json({ message: 'User not found' });

  const { email, password } = req.body;
  if (email) usersDb[username].email = email;
  if (password) usersDb[username].password = await bcrypt.hash(password, 8);
  res.json({ message: 'Settings updated successfully' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
