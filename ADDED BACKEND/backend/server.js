const express = require('express');
const path = require('path');
const multer = require('multer');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config(); // Ensure you have the dotenv package installed

const app = express();

// Middleware for logging HTTP requests
app.use(morgan('dev'));

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for cookies and session management
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET, // Make sure you have SESSION_SECRET in your .env file
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' } // Use secure cookies in production
}));

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../frontend/images')); // Adjust the path as necessary
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Endpoint for file uploads
app.post('/api/upload', upload.single('bgImg'), (req, res) => {
  res.json({ message: 'File uploaded successfully.', file: req.file });
});

// Endpoint for handling user data submission
app.post('/api/userdata', (req, res) => {
  // Extract user data from request body
  const { username, email, password } = req.body;

  // Here, add server-side validation as needed
  if (!username || !email || !password) { // Simple validation example
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Assuming validation passed, process the data (e.g., save to database)
  // For now, just sending back a success message
  res.json({ message: 'User data processed successfully.', userData: req.body });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
