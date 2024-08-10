const express = require('express');
const cors = require('cors');
const http = require('http');
const chalk = require('chalk');
const auth = require('./middlewares/auth');
const jwt = require('jsonwebtoken');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();


const app = express();
const server = http.createServer(app);

const port = process.env.MAIN_PORT;

app.use(cors());

require('../../../services/auth-service/src/config/passport')(app);

app.use('/auth', createProxyMiddleware({ target: 'http://localhost:8081', changeOrigin: true }));
app.use(auth);





server.listen(port, () => {
    console.log(
        `${chalk.green('✓')} ${chalk.blue(
            `Listening on port ${port}. Visit http://localhost:${port}/ in your browser.`
        )}`
    );
});


