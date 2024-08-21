require('dotenv').config();

module.exports = {
    userModelName: process.env.MODEL_NAME,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    baseURL: 'http://127.0.0.1:8080'
}
