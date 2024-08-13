const router = require('express').Router();
const Client = require('../../models/Client');
const generateCode = require('../../utils/generateCode');
const fs = require('fs');
const path = require('path');
const { clientModel, trackerModel } = require('../../template/model');
const auth = require('../../../../../common/api-proxy/src/middlewares/auth');
const { ROLES } = require('../../../../../common/constants');

router.post('/register-client', auth, async (req, res) => {
    try {
        const { name, redirectUri } = req.body;
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
        const dirPath = path.join(
            path.dirname(path.dirname(__dirname)), '/models', `/client${client._id}`
        );
        console.log(dirPath);


        const dbsession = await Client.startSession();
        await dbsession.withTransaction(async () => {
            try {
                fs.mkdirSync(dirPath);
                fs.writeFileSync(path.join(dirPath, `ClientPlayer.js`), clientModel(client._id));
                fs.writeFileSync(path.join(dirPath, `ClientTracker.js`), trackerModel(client._id));
                await client.save();
            } catch (error) {
                console.error('File operation failed:', error);
                throw fileError; // This will abort the transaction
            }
        });

        dbsession.endSession();

        res.status(200).json({
            clientId: client.clientId,
            clientSecret: client.clientSecret
        });
    } catch (error) {
        console.log(error);

        if (fs.existsSync(dirPath)) {
            fs.rmdirSync(dirPath, { recursive: true });
        }
        res.status(500).json({ message: 'Error registering client.' });
    }
});


router.post('/add-users', auth, async (req, res) => {
    try {
        const users = req.body.users;
        const client_id = req.user._id;
        const Player = require(`../../models/client${client_id}/ClientPlayer`);
        const bulkOperations = [];
        users.map(user => {
            const option = {
                insertOne: {
                    "document": {
                        playerId: user._id,
                        client: client_id
                    }
                }
            }
            bulkOperations.push(option);
        });
        Player.bulkWrite(bulkOperations)
            .then(() => res.status(200).json({ success: true }))
            .catch(error => res.status(500).json({ message: 'Error registering Players.' }));
    } catch(error) {
        console.log(error);
        res.status(500).json({ message: 'Error registering client.' });

    }
});

/**
 * @desc:   Update a client by id
 * @route:  PUT /auth/api/client
 * @access: Private
 */

router.put('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { name, clientId, clientSecret, redirectUris } = req.body;

    try {
        const client = await Client.findById(id);

        if (!client) {
            return res.status(404).json({
                message: 'There is no client with this id.'
            });
        }

        if (req.user.role ==  ROLES.Admin || client.userAccountId == req.user._id) {
            if (name !== undefined) client.name = name;
            if (clientId !== undefined) client.clientId = clientId;
            if (clientSecret !== undefined) client.clientSecret = clientSecret;
            if (redirectUris !== undefined) client.redirectUris = redirectUris;

            await client.save();

            return res.status(200).json({
                id: client._id,
                name: client.name,
                clientId: client.clientId,
                clientSecret: client.clientSecret,
                redirectUris: client.redirectUris,
                userAccountId: client.userAccountId,
            });
        }

        res.status(403).json({
            message: 'This client belongs to another user so you cannot update it.'
        });
    } catch(e) {
        console.error(e);

        res.status(500).json({
            message: 'An unexpected error occurred while updating the client.'
        });
    }
});

/**
 * @desc:   Delete a client by id
 * @route:  DELETE /auth/api/client
 * @access: Private
 */

router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params;

    try {
        const client = await Client.findById(id);

        if (!client) {
            return res.status(404).json({
                message: 'There is no client with this id.'
            });
        }

        if (req.user.role ==  ROLES.Admin || client.userAccountId == req.user._id) {
            await client.deleteOne();

            return res.status(204).send();
        }

        res.status(403).json({
            message: 'This client belongs to another user so you cannot delete it.'
        });
    } catch(e) {
        console.error(e);

        res.status(500).json({
            message: 'An unexpected error occurred while deleting the client.'
        });
    }
});

module.exports = router;