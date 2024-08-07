const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Profile = require('../models/Profile');
const ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
const BasicStrategy = require('passport-http').BasicStrategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Client = require('../models/Client');
require('dotenv').config();

passport.use(
    new LocalStrategy(
        async function (username, password, cb) {
            console.log(username)
            const profile = await Profile.findOne({ username: username });
            if (!profile) {
                return cb(null, false, { message: 'Incorrect username or password.' });
            }
            if (!profile.validatePassword(password)) {
                return cb(null, false, { message: 'Incorrect username or password.' });
            }
            return cb(null, profile);

        }
    )
);


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