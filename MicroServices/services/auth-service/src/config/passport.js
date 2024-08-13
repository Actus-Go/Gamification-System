const passport = require('passport');
const UserAccount = require('../models/UserAccount');
const ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
const BasicStrategy = require('passport-http').BasicStrategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Client = require('../models/Client');
require('dotenv').config();

/* 
Finding the client and verifying the Secret (request && database).
If they match, the client is authenticated.
*/
passport.use(new ClientPasswordStrategy(
    function (clientId, clientSecret, done) {
        console.log(clientId);
        Client.findOne({ clientId: clientId }, function (err, client) {
            if (err) { return done(err); }
            if (!client) { return done(null, false); }
            if (client.clientSecret != clientSecret) { return done(null, false); }
            return done(null, client);
        });
    }
))


const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(
    new JwtStrategy(opts, (payload, done) => {
        // payload -> JWT => {name: 'test', id: 1}. So I compare with database. 
        if (payload.userAccountId) {
            UserAccount.findById(payload.userAccountId)
            // this parameter acting the result of findById method..
                .then(userAccount => {
                    if (userAccount) {
                        return done(null, userAccount);
                    }

                    return done(null, false);
                })
                .catch(err => {
                    return done(err, false);
                });
        } else {
            Client.findOne({ clientId: payload.clientId })
                .then(client => {
                    if (client) {
                        return done(null, client);
                    }

                    return done(null, false);
                })
                .catch(err => {
                    return done(err, false);
                });
        }
    })
);


passport.use(new BasicStrategy(
    async function (clientId, clientSecret, done) {
        try {
            const client = await Client.findOne({ clientId: clientId });
            if (!client) {
                return done(null, false);
            }
            if (client.clientSecret !== clientSecret) { // Simple comparison; consider more secure hashing!
                return done(null, false);
            }
            return done(null, client);
        } catch (error) {
            console.log('Basic error', error);
            return done(error);
        }
    }
));


module.exports = async app => {
    app.use(passport.initialize());
};