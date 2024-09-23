const nodemailer = require('nodemailer');
const User = require('../models/User.js');
const EmailPreference = require('../models/EmailPreference.js');

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
    const mailOptions = {
      from: '"E-commerce App" <noreply@ecommerce.com>',
      to: user.email,
      subject: 'Verify Your Email',
      html: `<p>Please click <a href="http://localhost:4200/verify-email/${user.id}">here</a> to verify your email.</p>`
    };

    await this.transporter.sendMail(mailOptions);
  }

  static async sendOrderConfirmationEmail(order) {
    const user = await User.findById(order.userId);
    const mailOptions = {
      from: '"E-commerce App" <noreply@ecommerce.com>',
      to: user.email,
      subject: 'Order Confirmation',
      html: `<p>Your order #${order.id} has been confirmed.</p>`
    };

    await this.transporter.sendMail(mailOptions);
  }

  static async sendSellerNotificationEmail(order) {
    const seller = await User.findOne({ role: 'seller' });
    const mailOptions = {
      from: '"E-commerce App" <noreply@ecommerce.com>',
      to: seller.email,
      subject: 'New Order Received',
      html: `<p>You have received a new order #${order.id}.</p>`
    };

    await this.transporter.sendMail(mailOptions);
  }

  static async updateEmailPreference({ userId, newsletterOptIn, allEmailsOptIn }) {
    let preference = await EmailPreference.findOne({ userId });
    if (!preference) {
      preference = new EmailPreference({ userId, newsletterOptIn, allEmailsOptIn });
    } else {
      preference.newsletterOptIn = newsletterOptIn;
      preference.allEmailsOptIn = allEmailsOptIn;
    }
    await preference.save();
    return preference;
  }

  static async sendNewsletter() {
    const users = await User.find({ 'emailPreference.newsletterOptIn': true });
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
    console.log('Sending password reset email to:', email, 'with token:', resetToken);
    const mailOptions = {
      from: '"E-commerce App" <noreply@ecommerce.com>',
      to: email,
      subject: 'Password Reset',
      html: `<p>You requested a password reset. Please click on the following link to reset your password:</p>
<a href="http://localhost:4200/reset-password/${resetToken}">Reset Password</a>
<p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`
    };

    await this.transporter.sendMail(mailOptions);
    console.log('Password reset email sent to:', email);
  }
}

module.exports = EmailService;