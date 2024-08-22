const { Router } = require('express');

const router = Router();

const getPlayer = async (clientId, playerId, res) => {
    if (!clientId) {
      res.status(404).json({ message: "Client not found." });
      return null;
    }
  
    const Player = require(`../../../../auth-service/src/models/client${clientId}/ClientPlayer`);
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
 * @route:  GET points/api/player/:userId
 * @access: Private
 */

router.get('/:playerId', async(req, res) => {
    const user = req.body.user;
    const clientId = user.id;
    const playerId = req.params.playerId;

    const player = await getPlayer(clientId, playerId, res);
    if(!player) return;

    return res.status(200).json({Player: player});
});

/**
 * @route:  GET points/api/player/:userId/history
 * @access: Private
 */

router.get('/:playerId/history', (req, res) => {
    
});


module.exports = router;