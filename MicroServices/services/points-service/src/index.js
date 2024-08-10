const express = require('express');
const cors = require('cors');
const http = require('http');
const chalk = require('chalk');
const setupDB = require('../../../common/api-proxy/src/utils/db')
require('dotenv').config();


const app = express();
const server = http.createServer(app);

const port = process.env.POINTS_SERVICE_PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(cors());
setupDB();




server.listen(port, () => {
    console.log(
        `${chalk.green('✓')} ${chalk.blue(
            `Auth service Listening on port ${port}. Visit http://localhost:${port}/ in your browser.`
        )}`
    );
});
