
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const axios = require('axios');

require('./config/passport')(passport);

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Could not connect to MongoDB', err);
});

const User = require('./models/User');
// Passport config
require('./config/passport')(passport);
app.use(passport.initialize());

// Routes
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'Email id already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true });
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Google OAuth routes
// app.get('/auth/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] })
// );

app.post('/auth/google', async (req, res) => {
  const { idToken } = req.body;

  try {
    // Verify the ID token with Google
    const response = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${idToken}`);
    const userData = response.data;

    // Example user data
    const user = {
      id: userData.sub,
      name: userData.name,
      email: userData.email
    };

    // Generate a JWT token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user });
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
});

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true });
    res.redirect('/courses');
  }
);

app.get('/api/courses', (req, res) => {
  const courses = [
    { title: '(New) Responsive Web Design Certification', duration: '300 hours', imageUrl: 'path/to/responsive_web_design.jpg' },
    { title: 'Legacy Responsive Web Design Certification', duration: '300 hours', imageUrl: 'path/to/legacy_responsive_web_design.jpg' },
    { title: 'JavaScript Algorithms and Data Structures Certification', duration: '300 hours', imageUrl: 'path/to/javascript_algorithms.jpg' },
    { title: 'Front End Development Libraries Certification', duration: '300 hours', imageUrl: 'path/to/front_end_libraries.jpg' },
    { title: 'Data Visualization Certification', duration: '300 hours', imageUrl: 'path/to/data_visualization.jpg' },
    { title: 'Back End Development and APIs Certification', duration: '300 hours', imageUrl: 'path/to/backend_apis.jpg' },
    { title: 'Quality Assurance Certification', duration: '300 hours', imageUrl: 'path/to/quality_assurance.jpg' }
    
  ];
  res.json(courses);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

