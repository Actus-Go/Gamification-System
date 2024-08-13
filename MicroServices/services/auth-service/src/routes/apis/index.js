const router = require('express').Router();
const authRouters = require('./auth');
const clientRouters = require('./client');

// auth routers
router.use('/user-account', authRouters);
router.use('/client', clientRouters);

module.exports = router;