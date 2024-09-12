const cron = require('node-cron');
const EmailService = require('./EmailService.js');
const User = require('../models/User.js');

class CronService {
  static initCronJobs() {
    // Schedule weekly newsletter (every Monday at 9 AM)
    cron.schedule('0 9 * * 1', async () => {
      console.log('Sending weekly newsletter...');
      await EmailService.sendNewsletter();
    });

    // Schedule daily update email (every day at 8 AM)
    cron.schedule('0 8 * * *', async () => {
      console.log('Sending daily update emails...');
      await this.sendDailyUpdateEmails();
    });

    // Schedule monthly promotional email (1st day of every month at 10 AM)
    cron.schedule('0 10 1 * *', async () => {
      console.log('Sending monthly promotional emails...');
      await this.sendMonthlyPromotionalEmails();
    });
  }

  static async sendDailyUpdateEmails() {
    const users = await User.find({ 'emailPreference.dailyUpdatesOptIn': true });
    for (const user of users) {
      await EmailService.sendDailyUpdateEmail(user);
    }
  }

  static async sendMonthlyPromotionalEmails() {
    const users = await User.find({ 'emailPreference.promotionalEmailsOptIn': true });
    for (const user of users) {
      await EmailService.sendMonthlyPromotionalEmail(user);
    }
  }
}

module.exports = CronService;