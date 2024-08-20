const { Router } = require('express');
const playerRoutes = require('./player');

const router = Router();

router.use('/player', playerRoutes);

module.exports = router;
