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
 * @desc:   Adds points to a player's account when products are redeemed
 * @route:  POST points/api/player/:id/points/add
 * @access: Private
 */
router.post("/add", async (req, res) => {
  try {
    const clientId = req.body.user._id;
    const playerId = req.params.id;
    const order = req.body.order;

    // Verify if the order is paid before adding points
    if (!order.isPaid) {
      return res.status(400).json({ message: "Order is not paid." });
    }

    // Fetch the player and perform common checks
    const player = await getPlayer(clientId, playerId, res);
    if (!player) return;

    // Calculate the total points from the products in the order
    const totalPoints = order.products.reduce(
      (sum, product) => sum + product.points,
      0
    );

    // Add the calculated points to the player's account
    player.points += totalPoints;
    await player.save();

    res.status(200).json({ message: "Points added successfully." });
  } catch (error) {
    handleError(error, res, "Error adding points.");
  }
});

/**
 * @desc:   Deducts points from a player's account when products are paid using points
 * @route:  POST points/api/player/:id/points/pay
 * @access: Private
 */
router.post("/pay", async (req, res) => {
  try {
    const clientId = req.body.user._id;
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
    if (!player) return;

    // Calculate the total points required from the products in the order
    const pointsRequired = order.products.reduce(
      (sum, product) => sum + product.points,
      0
    );

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
