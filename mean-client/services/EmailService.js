const nodemailer = require('nodemailer');
const User = require('../models/User.js');
const jwt = require('jsonwebtoken');

require('dotenv').config();

class EmailService {
  static transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS
    }
  });

  static async sendVerificationEmail(user) {
    console.log('Attempting to send verification email to:', user.email);
    try {
      const verificationToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const verificationUrl = `http://localhost:4200/verify-email/${verificationToken}`;

      const mailOptions = {
        from: '"E-commerce App" <noreply@ecommerce.com>',
        to: user.email,
        subject: 'Verify Your Email',
        html: `<p>Please click <a href="${verificationUrl}">here</a> to verify your email.</p>`
      };

      console.log('Sending verification email with options:', mailOptions);
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Verification email sent successfully. Message ID:', info.messageId);
      return info;
    } catch (error) {
      console.error('Error in sendVerificationEmail:', error);
      throw error;
    }
  }

  static async sendOrderNotificationToSeller(order, sellerEmail) {
    console.log(`Sending order notification email to seller: ${sellerEmail}`);
    const mailOptions = {
      from: '"E-commerce App" <noreply@ecommerce.com>',
      to: sellerEmail,
      subject: 'New Order Received',
      html: `
        <p>You have received a new order!</p>
        <p>Order details:</p>
        <ul>
          <li>Order ID: ${order.id}</li>
          <li>Product: ${order.productName}</li>
          <li>Price: $${order.productPrice}</li>
        </ul>
        <p>Click <a href="http://localhost:4200/order-history">here</a> to view your order history.</p>
      `
    };
  
    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Order notification email sent successfully to: ${sellerEmail}`);
    } catch (error) {
      console.error(`Error sending order notification email to ${sellerEmail}:`, error);
    }
  }

  static async updateEmailPreference({ userId, newsletterOptIn, allEmailsOptIn }) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { newsletterOptIn, allEmailsOptIn },
        { new: true, runValidators: true }
      );
      if (!user) {
        throw new Error('User not found');
      }
      return {
        userId: user._id,
        newsletterOptIn: user.newsletterOptIn,
        
        allEmailsOptIn: user.allEmailsOptIn
      };
    } catch (error) {
      console.error('Error in updateEmailPreference:', error);
      throw error;
    }
  }

  static async sendNewsletter() {
    const users = await User.find({ newsletterOptIn: true });
    for (const user of users) {
      const mailOptions = {
        from: '"E-commerce App" <noreply@ecommerce.com>',
        to: user.email,
        subject: 'Weekly Newsletter',
        html: `<p>Here's your weekly newsletter!</p>`
      };
      await this.transporter.sendMail(mailOptions);
    }
  }

  static async testEmailSending() {
    const mailOptions = {
      from: '"E-commerce App" <noreply@ecommerce.com>',
      to: 'test@example.com',
      subject: 'Test Email',
      html: '<p>This is a test email from the E-commerce App.</p>'
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Test email sent: ', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending test email:', error);
      throw error;
    }
  }

  static async sendDailyUpdateEmail(user) {
    const mailOptions = {
      from: '"E-commerce App" <noreply@ecommerce.com>',
      to: user.email,
      subject: 'Daily Update',
      html: `<p>Hello ${user.name}, here's your daily update from E-commerce App!</p>`
    };
    await this.transporter.sendMail(mailOptions);
  }

  static async sendMonthlyPromotionalEmail(user) {
    const mailOptions = {
      from: '"E-commerce App" <noreply@ecommerce.com>',
      to: user.email,
      subject: 'Monthly Promotions',
      html: `<p>Hello ${user.name}, check out our exciting promotions for this month!</p>`
    };
    await this.transporter.sendMail(mailOptions);
  }

  static async sendPasswordResetEmail(email, resetToken) {
    const resetUrl = `http://localhost:4200/reset-password/${resetToken}`;
    const mailOptions = {
      from: '"E-commerce App" <noreply@ecommerce.com>',
      to: email,
      subject: 'Password Reset',
      html: `<p>You requested a password reset. Please click on the following link to reset your password:</p>
<a href="${resetUrl}">Reset Password</a>
<p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`
    };

    await this.transporter.sendMail(mailOptions);
  }

  static async sendOrderStatusUpdateToBuyer(order, buyerEmail) {
    console.log(`Sending order status update email to buyer: ${buyerEmail}`);
    const statusMessage = order.status === 'completed' ? 'confirmed' : 'cancelled';
    const mailOptions = {
      from: '"E-commerce App" <noreply@ecommerce.com>',
      to: buyerEmail,
      subject: `Your Order Has Been ${statusMessage.charAt(0).toUpperCase() + statusMessage.slice(1)}`,
      html: `
        <p>Your order has been ${statusMessage} by the seller.</p>
        <p>Order details:</p>
        <ul>
          <li>Order ID: ${order.id}</li>
          <li>Product: ${order.productName}</li>
          <li>Price: $${order.productPrice}</li>
          <li>Status: ${order.status}</li>
        </ul>
        ${order.status === 'completed' ? '<p>Thank you for shopping with us!</p>' : '<p>We apologize for any inconvenience caused.</p>'}
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Order status update email sent successfully to buyer: ${buyerEmail}`);
    } catch (error) {
      console.error(`Error sending order status update email to buyer ${buyerEmail}:`, error);
    }
  }
}

module.exports = EmailService;