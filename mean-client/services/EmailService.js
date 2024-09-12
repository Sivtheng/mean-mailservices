const nodemailer = require('nodemailer');
const User = require('../models/User.js');
const EmailPreference = require('../models/EmailPreference.js');

class EmailService {
  static transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
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

  static async sendPasswordResetEmail(user, resetToken) {
    const mailOptions = {
      from: '"E-commerce App" <noreply@ecommerce.com>',
      to: user.email,
      subject: 'Password Reset',
      html: `<p>Please click <a href="http://localhost:4200/reset-password/${resetToken}">here</a> to reset your password.</p>`
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
}

module.exports = EmailService;