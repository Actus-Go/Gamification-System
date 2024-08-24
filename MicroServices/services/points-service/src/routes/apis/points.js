const { Router } = require("express");

const router = Router();

// Helper function to get the player by ID and perform common checks
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

// Function to create a tracker instance for each product
const createTrackerForProduct = async (
  clientId,
  playerId,
  product,
  isPaidFromTotalPoints
) => {
  const PlayerTracker = require(`../../../../auth-service/src/models/client${clientId}/ClientTracker`);
  const tracker = new PlayerTracker({
    Player: playerId,
    numberOfPoints: product.points,
    categoryId: product.categoryId,
    productId: product.productId,
    isPaidFromTotalPoints,
  });
  await tracker.save();
};

/**
 * @route:  POST points/api/player/:userId/pay
 * @access: Private
 * @description: Subtracts points from a player's account when products are paid using points
 */
router.post("/:userId/pay", async (req, res) => {
  try {
    // The user will come to you through proxy and you'll find it in body
    const { user, order } = req.body;
    const clientId = user.id;
    const playerId = req.params.userId;

    // Verify if the order is paid using points before subtracting points
    if (!order.isPaidFromTotalPoints) {
      return res.status(400).json({
        message: "Order is not paid from points.",
      });
    }

    // Fetch the player and perform common checks
    const player = await getPlayer(clientId, playerId, res);
    if (!player) return; // Exit if the player is not found

    // Calculate the total points required from the products in the order
    const pointsRequired = order.products.reduce((sum, product) => {
      createTrackerForProduct(clientId, playerId, product, true);
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

/**
 * @route:  POST points/api/player/:userId/add
 * @access: Private
 * @description: Adds points to a player's account
 */
router.post("/:userId/add", async (req, res) => {
  try {
    // The user will come to you through proxy and you'll find it in body
    const { user, order } = req.body;
    const clientId = user.id;
    const playerId = req.params.userId;

    // Verify if the order is paid using real money before adding points
    if (!order.isPaid) {
      return res.status(400).json({
        message: "Order is not paid.",
      });
    }

    // Fetch the player and perform common checks
    const player = await getPlayer(clientId, playerId, res);
    if (!player) return; // Exit if the player is not found

    // Calculate the total points from the products in the order
    const totalPoints = order.products.reduce((sum, product) => {
      createTrackerForProduct(clientId, playerId, product, false);
      return sum + points;
    }, 0);

    // Update the player's points and redeemed points count
    player.points += totalPoints;
    player.numberOfRedeemPoints += order.products.length;
    await player.save();

    res.status(200).json({
      message: "Points added successfully.",
      totalPoints: player.points,
    });
  } catch (error) {
    handleError(error, res, "Error adding points.");
  }
});

module.exports = router;
