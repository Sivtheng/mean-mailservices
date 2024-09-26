const cron = require('node-cron');
const EmailService = require('./EmailService.js');

class CronService {
  static newsletterSchedule = '0 9 * * 1'; // Default: Every Monday at 9 AM

  static initCronJobs() {
    cron.schedule(this.newsletterSchedule, async () => {
      console.log('Sending newsletter...');
      await EmailService.sendNewsletter();
    });
  }

  static setNewsletterSchedule(schedule) {
    // Validate the schedule string before setting
    if (cron.validate(schedule)) {
      this.newsletterSchedule = schedule;
      console.log(`Newsletter schedule updated to: ${schedule}`);
      // Re-initialize cron jobs with the new schedule
      this.initCronJobs();
    } else {
      console.error('Invalid cron schedule provided');
    }
  }
}

module.exports = CronService;