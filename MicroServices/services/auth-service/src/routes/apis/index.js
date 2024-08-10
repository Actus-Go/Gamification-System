const router = require('express').Router();
const authRouters = require('./auth');

// auth routers
router.use('/', authRouters);

module.exports = router;