const { Router } = require('express');
const apiRoutes = require('./apis');

const router = Router();

router.use('/api', apiRoutes);
router.use('/api', (req, res) => res.status(404).json('No API route found'));

module.exports = router;
