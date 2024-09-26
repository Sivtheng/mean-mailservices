const mongoose = require('mongoose');
const User = require('../models/User');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

console.log('MONGO_URI:', process.env.MONGO_URI);

if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not set in the environment variables');
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function addEmailPreferencesToUsers() {
    try {
        const result = await User.updateMany(
            { newsletterOptIn: { $exists: false }, allEmailsOptIn: { $exists: false } },
            { $set: { newsletterOptIn: true, allEmailsOptIn: true } }
        );
        console.log(`Updated ${result.nModified} users with default email preferences.`);
    } catch (error) {
        console.error('Error updating users:', error);
    } finally {
        mongoose.connection.close();
    }
}

addEmailPreferencesToUsers();