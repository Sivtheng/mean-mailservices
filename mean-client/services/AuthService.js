const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const EmailService = require('../services/EmailService');

class AuthService {
  async registerUser({ name, email, password, role }) {
    console.log('Starting user registration process');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists');
      throw new Error('User already exists');
    }

    console.log('Creating new user');
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    console.log('User saved, attempting to send verification email');
    try {
      await EmailService.sendVerificationEmail(user);
      console.log('Verification email sent successfully');
    } catch (error) {
      console.error('Error sending verification email:', error);
      // Delete the user if email sending fails
      console.warn('Verification email could not be sent. Deleting user.');
      await User.deleteOne({ _id: user._id });
      throw new Error('Failed to send verification email. Please try registering again.');
    }

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

    if (!user.isVerified) {
      await EmailService.sendVerificationEmail(user);
      throw new Error('Email not verified. A verification email has been sent.');
    }

    const tokenPayload = { userId: user._id, role: user.role, isVerified: user.isVerified };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
  }

  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
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
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

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
}

module.exports = new AuthService();
