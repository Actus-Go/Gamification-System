const { Router } = require("express");

const router = Router();

// Helper function to get the player by ID and perform common checks
const getPlayer = async (clientId, playerId, res) => {
  if (!clientId) {
    res.status(404).json({ message: "Client not found." });
    return null;
  }

  const Player = require(`../../models/client${clientId}/ClientPlayer`);
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
 * @route:  POST points/api/player/:id/points/pay
 * @access: Private
 * @description: Subtracts points from a player's account when products are paid using points
 */
router.post("/pay", async (req, res) => {
  try {
    const clientId = req.user._id;
    const playerId = req.params.id;
    const order = req.body.order;

    // Verify if the order is paid using points before subtracting points
    if (!order.isPaidFromTotalPoints) {
      return res.status(400).json({
        message: "Order is not paid from points.",
      });
    }

    // Fetch the player and perform common checks
    const player = await getPlayer(clientId, playerId, res);
    if (!player) return; // Exit if the player is not found

    const PlayerTracker = require(`../../models/client${clientId}/ClientTracker`);

    // Calculate the total points required from the products in the order
    const pointsRequired = order.products.reduce((sum, product) => {
      const points = product.points;
      // Create a tracker instance for each product
      const tracker = new PlayerTracker({
        Player: playerId._id,
        numberOfPoints: points,
        categoryId: product.categoryId,
        productId: product.productId,
        isPaidFromTotalPoints: true,
      });

      tracker.save();
      return sum + points;
    }, 0);

    // Check if the player has enough points to complete the transaction
    if (player.points < pointsRequired) {
      return res
        .status(400)
        .json({ message: "Insufficient points to complete the transaction." });
    }

    // Subtract the calculated points from the player's account
    player.points -= pointsRequired;
    await player.save();

    res.status(200).json({
      message: "Points deducted successfully.",
      totalPoints: player.points,
    });
  } catch (error) {
    handleError(error, res, "Error paying with points.");
  }
});

module.exports = router;
