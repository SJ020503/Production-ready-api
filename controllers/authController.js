const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { promisify } = require('util');
const { body, validationResult } = require('express-validator');

exports.validateLogin = [
  body('email').isEmail().withMessage('Invalid email'),

  body('password')
    .isString()
    .withMessage('Password must be a string')
    .isLength({ min: 8 }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        errors: errors.array(),
      });
    }
    next();
  },
];

/* =========================
   Helper: sign JWT
========================= */
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

/* =========================
   SIGNUP
========================= */
exports.signup = async (req, res) => {
  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = signToken(user._id);

    // Send JWT as httpOnly cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failure',
      message: err.message,
    });
  }
};

/* =========================
   LOGIN
========================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send('Please enter email and password');
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).send('Please enter valid email or password');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).send('Please enter valid email or password');
    }

    const token = signToken(user._id);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

/* =========================
   PROTECT (AUTH GUARD)
========================= */
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Get token from cookie
    if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).send('You are not logged in');
    }

    // Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Check if user still exists
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(401).send('User no longer exists');
    }

    // Check if password changed after token issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res
        .status(401)
        .send('Password recently changed. Please log in again.');
    }

    // Grant access
    req.user = currentUser;
    next();
  } catch (err) {
    return res.status(401).send('Invalid or expired token');
  }
};

/* =========================
   AUTHORISE (ROLE CHECK)
========================= */
exports.authorise = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).send('Not authenticated');
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).send('You do not have permission');
    }

    next();
  };
};

/* =========================
   LOGOUT
========================= */
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    httpOnly: true,
    expires: new Date(Date.now() + 10 * 1000),
  });

  res.status(200).json({ status: 'success' });
};
