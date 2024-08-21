const { Router } = require("express");
const router = Router();

const playerRoutes = require("./player");
const pointsRoutes = require('./points');

router.use('/', pointsRoutes);
router.use("/player", playerRoutes);


module.exports = router;
