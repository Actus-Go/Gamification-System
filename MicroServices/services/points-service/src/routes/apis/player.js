const { Router } = require('express');
const pointsRoutes = require('./points');

const router = Router();

/**
 * @route:  GET points/api/players
 * @access: Private
 */

router.get('/', async (req, res) => {
    try {
        const cleintId = req.user._id;
        const { page = 1, limit = 20, categoryId } = req.query;
        const skip = (page - 1) * limit;

        const Player = require(`../../../../auth-service/src/models/client${cleintId}/Player`);
        const Tracker = require(`../../../../auth-service/src/models/client${cleintId}/Tracker`);

        let players;

        if (!categoryId) {
            players = await Player.find({}).sort({ points: -1 }).skip(skip).limit(limit);
        } else {
            // Aggregation pipeline to find unique players in a category
            const trackers = await Tracker.aggregate([
                { $match: { categoryId } },
                { $group: { _id: "$Player" } }
            ]);

            const playerIds = trackers.map(tracker => tracker._id);

            players = await Player.find({ _id: { $in: playerIds } }).sort({ points: -1 }).skip(skip).limit(limit);
        }

        res.status(200).json({
            players,
        })
    } catch(e) {
        console.error(e);

        res.status(500).json({
            message: 'An unexpected error occurred.'
        });
    }
});

/**
 * @route:  GET points/api/players/:id
 * @access: Private
 */

router.get('/:id', (req, res) => {

});

/**
 * @route:  GET points/api/players/:id/history
 * @access: Private
 */

router.get('/:id/history', (req, res) => {

});

router.use('/:id/points', pointsRoutes);

module.exports = router;