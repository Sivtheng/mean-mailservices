const mongoose = require('mongoose');

const emailPreferenceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  newsletterOptIn: { type: Boolean, default: true },
  allEmailsOptIn: { type: Boolean, default: true },
}, { timestamps: true });

const EmailPreference = mongoose.model('EmailPreference', emailPreferenceSchema);

module.exports = EmailPreference;