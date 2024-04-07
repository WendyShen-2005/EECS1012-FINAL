const express = require('express');
const path = require('path');
const multer = require('multer');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

// Simulated in-memory 'database' for demonstration
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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'frontend/images'));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });
app.use(express.static(path.join(__dirname, '../frontend')));

app.post('/api/upload', upload.single('bgImg'), (req, res) => {
  res.json({ message: 'File uploaded successfully.', file: req.file });
});

// Hashes the password and stores the user in the 'database'
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required.' });
  }

  if (usersDb[username]) {
    return res.status(400).json({ success: false, message: 'Username already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 8);

  usersDb[username] = { password: hashedPassword };

  res.json({ success: true, message: 'Signup successful.' });
});

// Checks the user's credentials and logs them in
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const user = usersDb[username];

  if (!user) {
    return res.status(400).json({ success: false, message: 'User does not exist.' });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Password is incorrect.' });
  }

  res.json({ success: true, message: 'Login successful.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
