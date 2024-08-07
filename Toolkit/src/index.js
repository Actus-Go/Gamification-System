const axios = require('axios');
const config = require('./config');
const qs = require('querystring');

class Gamification {
    #clientId;
    #clientSecret;
    constructor() {
        this.#clientId = config.clientId;
        this.#clientSecret = config.clientSecret;
    }

    // static Clearly distinguishes between operations that affect all instances of the class (class-level operations) and those that affect a single instance (instance-level operations).
    static async getAccessToken() {
        const base64Credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
        const data = {
            grant_type: 'client_credentials'
        };
        const axiosConfig = {
            
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${base64Credentials}`
            }
        };
        const tokenEndpoint = '/oauth/token';
        await axios.post(config.baseURL + tokenEndpoint, qs.stringify(data), axiosConfig)
            .then(res => {
                process.env.GAMIFICATION_TOKEN = res.data.access_token;
                console.log(process.env.GAMIFICATION_TOKEN);
                console.log(res.data.access_token);
            })
            .catch(error => {
                console.error('Error fetching the access token:', error.response ? error.response.data : error.message);
            })
    }
}



module.exports = {
    Gamification
};
