const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have a name'],
  },
  email: {
    type: String,
    required: [true, 'User must have an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Enter password'],
    select: false,
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Reconfirm password'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Passwords do not match',
    },
  },
  photo: String,
  passwordChangedAt: Date,
  role: {
    type: String,
    enum: ['user', 'admin', 'tour-lead'],
    default: 'user',
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // Password NOT changed at all
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
