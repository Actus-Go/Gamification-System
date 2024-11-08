const router = require('express').Router();
const validator = require('validator');
const mongoose = require('mongoose');
const Client = require('../../models/Client');
const generateCode = require('../../utils/generateCode');
const fs = require('fs');
const path = require('path');
const { playerModel, trackerModel } = require('../../template/model');
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
            path.dirname(path.dirname(__dirname)), 'models', `client${client._id}`
        );
        console.log(dirPath);


        const dbsession = await Client.startSession();
        await dbsession.withTransaction(async () => {
            try {
                fs.mkdirSync(dirPath);
                fs.writeFileSync(path.join(dirPath, `Player.js`), playerModel(client._id));
                fs.writeFileSync(path.join(dirPath, `Tracker.js`), trackerModel(client._id));
                await client.save();
            } catch (error) {
                console.error('File operation failed:', error);
                throw fileError; // This will abort the transaction
            }
        });

        dbsession.endSession();

        res.status(201).json({
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

/**
 * @desc:   Adds players for authenticated client
 * @route:  POST /auth/api/client/add-players
 * @access: Private
 */

router.post('/add-players', auth, async (req, res) => {
    try {
        const playerIds = req.body.playerIds;
        const clientObjectId = req.user._id;

        const Player = require(`../../models/client${clientObjectId}/Player`);

        const bulkOperations = [];

        playerIds.forEach(playerId => {
            const option = {
                insertOne: {
                    "document": {
                        _id: new mongoose.Types.ObjectId(playerId),
                    }
                }
            }

            bulkOperations.push(option);
        });

        await Player.bulkWrite(bulkOperations);

        res.status(201).json({ success: true });
    } catch(error) {
        console.log(error);

        res.status(500).json({ message: 'Error registering players.' });
    }
});

/**
 * @desc:   Regnerates client credentials by id
 * @route:  POST /auth/api/client/:id/regenerate-credentials
 * @access: Private
 */

router.post('/:id/regenerate-credentials', auth, async (req, res) => {
    const { id } = req.params;

    try {
        const client = await Client.findById(id);

        if (!client) {
            return res.status(404).json({
                message: 'There is no client with this id.'
            });
        }

        if (req.user.role !==  ROLES.Admin && client.userAccountId != req.user._id) {
            return res.status(403).json({
                message: "This client belongs to another user so you cannot regenerate it's credentials."
            });
        }

        client.clientId = generateCode();
        client.clientSecret = generateCode();

        await client.save();

        return res.status(200).json({
            client,
        });
    } catch(e) {
        console.error(e);

        res.status(500).json({
            message: 'An unexpected error occurred while regenerating the client credentials.'
        });
    }
});

/**
 * @desc:   Get all clients for the authenticated user
 * @route:  GET /api/auth/client
 * @query:  page
 * @example: /api/auth/client?page=1
 * @access: Private
 */
router.get('/', auth, async (req, res) => {
    try {
        const user = req.user;
        const page = parseInt(req.query.page) || 0;
        const limit = 10;
        const skip = page * limit;

        let clients;
        if (user.role === ROLES.Admin) {
            // Admins can view all clients
            clients = await Client.find().populate('userAccountId name').sort({ createdAt: -1 }).skip(skip).limit(limit);
        } else {
            // Members can only view clients they created
            clients = await Client.find({ userAccountId: user._id }).populate('userAccountId name').sort({ createdAt: -1 }).skip(skip).limit(limit);
        }

        return res.status(200).json(clients);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error retrieving clients.' });
    }
});

/**
 * @desc:   Updates a client by id
 * @route:  PUT /auth/api/client/:id
 * @access: Private
 */

router.put('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { name, redirectUris } = req.body;

    try {
        const client = await Client.findById(id);

        if (!client) {
            return res.status(404).json({
                message: 'There is no client with this id.'
            });
        }

        if (req.user.role !==  ROLES.Admin && client.userAccountId != req.user._id) {
            return res.status(403).json({
                message: 'This client belongs to another user so you cannot update it.'
            });
        }

        if (name !== undefined) client.name = name;
        
        if (Array.isArray(redirectUris)) {
            if (redirectUris.every((uri) => validator.isURL(uri))) {
                client.redirectUris = redirectUris;
            } else {
                return res.status(400).json({
                    message: '"redirectUris" must be an array of URIs',
                });
            }
        }

        await client.save();

        return res.status(200).json({
            client,
        });
    } catch(e) {
        console.error(e);

        res.status(500).json({
            message: 'An unexpected error occurred while updating the client.'
        });
    }
});

/**
 * @desc:   Deletes a client by id
 * @route:  DELETE /auth/api/client/:id
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

        if (req.user.role !==  ROLES.Admin && client.userAccountId != req.user._id) {
            return res.status(403).json({
                message: 'This client belongs to another user so you cannot delete it.'
            });    
        }

        await client.deleteOne();

        res.status(204).send();
    } catch(e) {
        console.error(e);

        res.status(500).json({
            message: 'An unexpected error occurred while deleting the client.'
        });
    }
});

/**
 * @desc:   Get a client by ID
 * @route:  GET /api/auth/client/:id
 * @access: Private
 */
router.get('/:id', auth, async (req, res) => {
    try {
        const user = req.user;
        const clientId = req.params.id;

        let client;
        if (user.role === ROLES.Admin) {
            // Admins can view any client by ID
            client = await Client.findById(clientId);
        } else {
            // Members can only view clients they created
            client = await Client.findOne({ _id: clientId, userAccountId: user._id });
        }

        if (!client) {
            return res.status(404).json({ message: 'Client not found.' });
        }

        return res.status(200).json(client);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error retrieving client.' });
    }
});

module.exports = router;
