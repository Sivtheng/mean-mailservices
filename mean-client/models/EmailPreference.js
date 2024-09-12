const mongoose = require('mongoose');

const emailPreferenceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  newsletterOptIn: { type: Boolean, default: true },
  dailyUpdatesOptIn: { type: Boolean, default: false },
  promotionalEmailsOptIn: { type: Boolean, default: true },
  allEmailsOptIn: { type: Boolean, default: true }
});

module.exports = mongoose.model('EmailPreference', emailPreferenceSchema);