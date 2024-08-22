require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const chalk = require('chalk');
const auth = require('./middlewares/auth');
const routes = require('./routes');
const setupDB = require('./utils/db');
const { createProxyMiddleware } = require('http-proxy-middleware');


const app = express();
const server = http.createServer(app);

const MAIN_PORT = process.env.MAIN_PORT || 8080;
const AUTH_SERVICE_PORT = process.env.AUTH_SERVICE_PORT || 8081;

setupDB();

app.use(cors());

require('../../../services/auth-service/src/config/passport')(app);

app.use('/auth', createProxyMiddleware({ target: `http://localhost:${AUTH_SERVICE_PORT}`, changeOrigin: true }));


app.use(auth);

// Add any route to the routes.js
routes(app, createProxyMiddleware);


server.listen(MAIN_PORT, () => {
    console.log(
        `${chalk.green('✓')} ${chalk.blue(
            `Listening on port ${MAIN_PORT}. Visit http://localhost:${MAIN_PORT}/ in your browser.`
        )}`
    );
});


