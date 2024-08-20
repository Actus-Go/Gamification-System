const { Router } = require('express');
const apiRoutes = require('./apis');

const router = Router();

const BASE_API_URL = process.env.BASE_API_URL;

const api = `/${BASE_API_URL}}`;

router.use(api, apiRoutes);
router.use(api, (req, res) => res.status(404).json('No API route found'));

module.exports = router;
