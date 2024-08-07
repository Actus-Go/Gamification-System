const router = require('express').Router();
const authRouters = require('./auth');

// auth routers
router.use('/auth', authRouters);

module.exports = router;