const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['buyer', 'seller'], required: true },
  isVerified: { type: Boolean, default: false },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  newsletterOptIn: { type: Boolean, default: true },
  allEmailsOptIn: { type: Boolean, default: true },
}, { timestamps: true });

userSchema.pre('save', function(next) {
  console.log('Attempting to save user:', this);
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;