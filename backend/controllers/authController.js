const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { run, get, all } = require('../config/database');
const { JWT_SECRET } = require('../middleware/authMiddleware');

// Generate JWT token helper
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Register a new citizen
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    // Check if email already exists
    const existing = await get('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await run(
      `INSERT INTO users (name, email, password_hash, role, phone) VALUES (?, ?, ?, 'citizen', ?)`,
      [name.trim(), email.toLowerCase().trim(), passwordHash, phone || null]
    );

    const newUser = {
      id: result.id,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: 'citizen',
      phone: phone || null
    };

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to CleanCity 360.',
      token,
      user: newUser
    });
  } catch (error) {
    next(error);
  }
};

// Login user (citizen or admin)
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.'
      });
    }

    const user = await get('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone
    };

    const token = generateToken(userPayload);

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: userPayload
    });
  } catch (error) {
    next(error);
  }
};

// Get current authenticated user profile
const getMe = async (req, res, next) => {
  try {
    const user = await get(
      'SELECT id, name, email, role, phone, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// 1-Click Demo Login for fast Hackathon presentation
const demoLogin = async (req, res, next) => {
  try {
    const { role } = req.body; // 'citizen' or 'admin'
    const targetRole = role === 'admin' ? 'admin' : 'citizen';

    const user = await get('SELECT * FROM users WHERE role = ? LIMIT 1', [targetRole]);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No demo ${targetRole} user found. Please reseed database.`
      });
    }

    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone
    };

    const token = generateToken(userPayload);

    res.json({
      success: true,
      message: `Demo logged in as ${user.name} (${user.role.toUpperCase()})`,
      token,
      user: userPayload
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  demoLogin
};
