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
 * @route:  GET points/api/player/:playerId
 * @access: Private
 */


router.get('/:playerId', async(req, res) => {
  try {
    const user = req.body.user;
    const clientId = user.id;
    const playerId = req.params.playerId;
    
    const player = await getPlayer(clientId, playerId, res);
    if(!player) return;
    
    return res.status(200).json({Player: player});
    
  }catch (err) {
    console.log(err);
    res.status(400).send('Request faild. Try again.')
}
  })
  
  
  /**
   * @route:  GET points/api/player/:playerId/history
   * @access: Private
  */
 
  router.get('/:playerId/history', async (req, res) => {
    try {

      const user = req.body.user; 
      const clientId = user.id;
      const playerId = req.params.playerId;

       
      const player = await getPlayer(clientId, playerId, res);
      if (!player) return;


      const PlayerTracker = require(`../../../../auth-service/src/models/client${clientId}/ClientTracker`);
      if(PlayerTracker) console.log('success')
    
      const playerHistory = await PlayerTracker.find({
        Player:  player,
      })
      
   
      return res.status(200).json({
          PlayerHistory: playerHistory
      });



    }catch (err) {
      console.log(err);
      res.status(400).send('Request faild. Try again.')
  }
});






module.exports = router;