const { Router } = require("express");
const playerRoutes = require("./player");

const router = Router();

router.use("/player/:id", playerRoutes);

module.exports = router;
