const oauth2orize = require('oauth2orize');
const server = oauth2orize.createServer();
const Client = require('../../models/Client');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('dotenv').config();

server.serializeClient((client, done) => done(null, client.clientId));
server.deserializeClient((clientId, done) => {
    const client = Client.findOne({ clientId: clientId });
    if (!client) {
        return done('Invalid Auth');
    }
    return done(null, client);
});



server.exchange(oauth2orize.exchange.clientCredentials(function (client, code, redirectURI, done) {
    if (!client.grants.includes('client_credentials')) {
        return done(null, false);
    }
    const payload = {
        userId: client.userAccountId,
        clientId: client.clientId,
        client_id: client._id,
    };
    const tokenValue = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    return done(null, tokenValue);
}));

// server.token() handles token generation after the client has been successfully authenticated.
// server.errorFieldHandler() a middleware that handles errors that might occur during the authentication process or token generation.
router.post('/oauth/token', passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
    server.token(),
    server.errorHandler()
);




// router.post('/test', auth, (req, res) => res.json({message: 'success'}));

module.exports = router;