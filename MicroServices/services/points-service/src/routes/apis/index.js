const { Router } = require("express");
const router = Router();

const playerRoutes = require("./player");
const pointsRoutes = require('./points');

router.use('/', pointsRoutes);
router.use("/players", playerRoutes);


module.exports = router;
