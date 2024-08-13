const oauth2orize = require('oauth2orize');
const server = oauth2orize.createServer();
const Client = require('../../models/Client');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const generateCode = require('../../utils/generateCode');
require('dotenv').config();

// Stores the clientId in the session after authentication.
server.serializeClient((client, done) => done(null, client.clientId));

// Uses the clientId to retrieve the client's information from the database when needed for authentication.
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
    };
    const tokenValue = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    return done(null, tokenValue);
}));


// server.token() -> authenticate the client and then generate a token.
// server.errorHandler() -> a middleware that handles errors that might occur during the authentication process or token generation.


router.post('/oauth/token', passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
    server.token(),
    server.errorHandler()
);


router.post('/register-client', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { name, redirectUri } = req.body;
        // generateCode -> Random string (70 bytes) and acting the client ID.
        const clientId = generateCode();
        const clientSecret = generateCode();

        const client = new Client({
            name,
            clientId,
            clientSecret,
            userAccountId: req.user._id, // Link client to the authenticated user
            redirectUris: [redirectUri],
            grants: ['client_credentials'] // Depending on what you want to allow
        });

        await client.save();

        res.status(200).json({
            clientId: client.clientId,
            clientSecret: client.clientSecret
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering client.' });
    }
});

// router.post('/test', auth, (req, res) => res.json({message: 'success'}));

module.exports = router;