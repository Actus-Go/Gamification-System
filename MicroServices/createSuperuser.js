const mongoose = require('mongoose');
const readlineSync = require('readline-sync');
const UserAccount = require('./services/auth-service/src/models/UserAccount');
const setupDB = require('./common/api-proxy/src/utils/db');
const { ROLES } = require('./common/constants');


async function createSuperuser() {
    await setupDB();
    try {
        const username = readlineSync.question('Username: ');
        const password = readlineSync.question('Password: ', {
            hideEchoBack: true
        });

        const exists = await UserAccount.findOne({ username });
        if (exists) {
            console.log('Error: A user with that username or email already exists.');
            return;
        }

        const adminUserAccount = new UserAccount({ username, password, role: ROLES.Admin });
        adminUserAccount.setPassword(password);
        await adminUserAccount.save();

        console.log('Superuser created successfully!');
    } catch (error) {
        console.error('Failed to create superuser:', error.message);
    } finally {
        mongoose.disconnect();
    }
}

createSuperuser();