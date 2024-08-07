const mongoose = require('mongoose');
const readlineSync = require('readline-sync');
const Profile = require('./models/Profile');
const setupDB = require('./utils/db');
const { ROLES } = require('./constants');


async function createSuperuser() {
    await setupDB();
    try {
        const username = readlineSync.question('Username: ');
        const password = readlineSync.question('Password: ', {
            hideEchoBack: true
        });

        const exists = await Profile.findOne({ username });
        if (exists) {
            console.log('Error: A user with that username or email already exists.');
            return;
        }

        const adminProfile = new Profile({ username, password, role: ROLES.Admin });
        adminProfile.setPassword(password);
        await adminProfile.save();

        console.log('Superuser created successfully!');
    } catch (error) {
        console.error('Failed to create superuser:', error.message);
    } finally {
        mongoose.disconnect();
    }
}

createSuperuser();