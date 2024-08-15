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
            client = await Client.findOne({ clientId: clientId });
        } else {
            // Members can only view clients they created
            client = await Client.findOne({ clientId: clientId, userAccountId: user._id });
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
