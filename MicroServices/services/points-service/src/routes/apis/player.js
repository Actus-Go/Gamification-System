const { Router } = require('express');

const router = Router();

const getPlayer = async (clientId, playerId, res) => {
    if (!clientId) {
      res.status(404).json({ message: "Client not found." });
      return null;
    }
  
    const Player = require(`../../../../auth-service/src/models/client${clientId}/Player`);
    const player = await Player.findById(playerId);
  
    if (!player) {
      res.status(404).json({ message: "Player not found." });
      return null;
    }
  
    return player;
  };
  
  // Error Handler
  const handleError = (error, res, message = "An error occurred.") => {
    console.error(error);
    res.status(500).json({ message });
};

  
/**
 * @route:  GET points/api/players/:playerId
 * @access: Private
 */

router.get('/:playerId', async (req, res) => {
    try {
        const clientId = req.body.user.id;
        const playerId = req.params.playerId;
        const player = await getPlayer(clientId, playerId, res);

        if (!player) {
            return;
        }

        return res.status(200).json({ player });
    } catch (err) {
        handleError(err, res, 'Request failed. Try again.');
    }
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

            players = players.map((player) => new Player(player));
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