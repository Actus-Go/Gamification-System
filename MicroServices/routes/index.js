const router = require('express').Router();
const apiRoutes = require('./apis');
require('dotenv').config();

const apiURL = process.env.BASE_API_URL;

const api = `/${apiURL}`;

// api routes
router.use(api, apiRoutes);
router.use(api, (req, res) => res.status(404).json('No API route found'));

module.exports = router;