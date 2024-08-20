const { Router } = require('express');
const pointsRoutes = require('./points');

const router = Router();

/**
 * @route:  GET points/api/player/:userId
 * @access: Private
 */

router.get('/:userId', (req, rea) => {

});

/**
 * @route:  GET points/api/player/:userId/history
 * @access: Private
 */

router.get('/:userId/history', (req, rea) => {

});

router.use('/:userId/points', pointsRoutes);

module.exports = router;