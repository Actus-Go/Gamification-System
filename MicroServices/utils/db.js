require('dotenv').config();
const chalk = require('chalk');
const mongoose = require('mongoose');

const dbURl = process.env.DB_URL;

const setupDB = async () => {
    try {

        await mongoose.connect(dbURl)
            .then(() =>
                console.log(`\n${chalk.green('✓')} ${chalk.blue('MongoDB Connected')}`)
            )
            .catch(err => console.log('Error connect to DB ====> ', err));
    } catch (err) {
        console.log('Error connect to DB ====> ', err);
        return null;
    }
};

module.exports = setupDB;