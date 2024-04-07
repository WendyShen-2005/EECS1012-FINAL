const express = require('express');
const path = require('path');
const multer = require('multer');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

// Simulated in-memory 'database'
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

// Serve static files
app.use(express.static(path.join(__dirname, 'frontend')));

// Multer setup for file uploads
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

// User registration
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (usersDb[username]) {
    return res.status(400).json({ message: 'Username already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 8);
  usersDb[username] = { email, password: hashedPassword };

  res.json({ message: 'Signup successful.' });
});

// User login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = usersDb[username];

  if (!user) {
    return res.status(400).json({ message: 'User does not exist.' });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  // Assuming successful login
  req.session.username = username; // Save username in session
  res.json({ message: 'Login successful.' });
});

// Retrieve current user settings
app.get('/api/settings', (req, res) => {
  const { username } = req.session;
  
  if (!username || !usersDb[username]) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const user = usersDb[username];
  res.json({ username, email: user.email });
});

// Update user settings
app.post('/api/updateSettings', async (req, res) => {
  const { username } = req.session;
  const { email, password } = req.body;

  if (!username || !usersDb[username]) {
    return res.status(404).json({ message: 'User not found.' });
  }

  if (email) {
    usersDb[username].email = email;
  }
  
  if (password) {
    usersDb[username].password = await bcrypt.hash(password, 8);
  }

  res.json({ message: 'Settings updated successfully.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
