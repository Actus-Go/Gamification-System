const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const { ROLES } = require('../constants');
require('dotenv').config();
const salt = process.env.SALT;

const ProfileSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        default: ROLES.Member,
        enum: [ROLES.Admin, ROLES.Member]
    }
}, { timestamps: true });


// Method for setting a user's hashed password and salt
ProfileSchema.methods.setPassword = function (password) {
    this.password = crypto.pbkdf2Sync(password, salt, 310000, 32, 'sha256').toString('hex');
};

// Method for validating a user's password
ProfileSchema.methods.validatePassword = function (password) {
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 310000, 32, 'sha256').toString('hex');
    return this.password === hashedPassword;
};


const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;