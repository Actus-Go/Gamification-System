const { Router } = require('express');
const router = Router();
require('dotenv').config();

const apiRoutes = require('./apis');


const apiURL = process.env.BASE_API_URL;


const api = `/${apiURL}`;

router.use(api, apiRoutes);
router.use(api, (req, res) => res.status(404).json('No API route found'));

module.exports = router;
