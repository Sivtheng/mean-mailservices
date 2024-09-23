const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const EmailService = require('../services/EmailService');
const crypto = require('crypto');

class AuthService {
  async registerUser({ name, email, password, role }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    await EmailService.sendVerificationEmail(user);

    return user;
  }

  async loginUser(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
  }

  async forgotPassword(email) {
    console.log('AuthService.forgotPassword called with email:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.error('User not found for email:', email);
      throw new Error('User not found');
    }

    // Generate password reset token
    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    user.resetPasswordToken = resetToken;
    await EmailService.sendPasswordResetEmail(user, resetToken);
    await user.save();
    return { message: 'Password reset email sent' };
  }

  async resetPassword(resetToken, newPassword) {
    console.log('AuthService.resetPassword called with token:', resetToken);

    // Log the current time for comparison
    const currentTime = Date.now();
    console.log('Current time:', currentTime);

    // Find the user with the reset token and check if the token is not expired
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: currentTime }
    });

    if (!user) {
      console.error('Invalid or expired reset token');
      throw new Error('Invalid or expired reset token');
    }

    console.log('User found for reset token:', user.email);
    console.log('Reset token expiry time:', user.resetPasswordExpires);

    // Hash the new password and save it
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log('Password reset successful for user:', user.email);

    return { message: 'Password reset successful' };
  }

  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded.userId;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async verifyEmail(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.isVerified) {
      throw new Error('Email already verified');
    }

    user.isVerified = true;
    await user.save();

    await EmailService.sendWelcomeEmail(user);

    return { message: 'Email verified successfully' };
  }
}

module.exports = new AuthService();
