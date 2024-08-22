const { Router } = require('express');

const router = Router();

/**
 * @route:  GET points/api/players/:playerId
 * @access: Private
 */

router.get('/:playerId', (req, res) => {
    console.log(req.params);
    return res.send('working.');
});

/**
 * @route:  GET points/api/players/:playerId/history
 * @access: Private
 */

router.get('/:playerId/history', (req, res) => {
    console.log(req.params);
    return res.send('asfdg');
});

/**
 * @route:  GET points/api/players/filter
 * @access: Private
 */

router.get('/filter', async (req, res) => {
    try {
        const clientObjectId = req.user._id;
        const { page = 1, limit = 20, categoryId } = req.query;
        const skip = (page - 1) * limit;

        const Player = require(`../../../../auth-service/src/models/client${clientObjectId}/Player`);
        const Tracker = require(`../../../../auth-service/src/models/client${clientObjectId}/Tracker`);

        let players;

        if (!categoryId) {
            players = await Player.find({}).sort({ points: -1 }).skip(skip).limit(limit);
        } else {
            players = await Tracker.aggregate([
                { $match: { categoryId } },
                { $group: { _id: "$player" } },
                {
                    $lookup: {
                        from: `players_${clientObjectId}`,
                        localField: "_id",
                        foreignField: "_id",
                        as: "player"
                    }
                },
                { $unwind: "$player" },
                { $replaceRoot: { newRoot: "$player" } },
                { $sort: { "player.points": -1 } },
                { $skip: skip },
                { $limit: limit },
            ]);
        }

        res.status(200).json({
            players,
        })
    } catch(e) {
        console.error(e);

        res.status(500).json({
            message: "An unexpected error occurred.",
        });
    }
});

module.exports = router;