const cron = require('node-cron');
const EmailService = require('./EmailService.js');

class CronService {
  static initCronJobs() {
    // Schedule weekly newsletter
    cron.schedule('0 9 * * 1', () => {
      EmailService.sendNewsletter();
    });
  }
}

module.exports = CronService;