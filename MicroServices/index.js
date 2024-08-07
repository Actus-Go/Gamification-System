const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const setupDB = require('./utils/db');
const http = require('http');
const chalk = require('chalk');
const oauth = require('./routes/apis/oauth');
require('dotenv').config();


const app = express();
const server = http.createServer(app);
const debug = process.env.DEBUG;

const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

setupDB();

app.use(cors());

require('./config/passport')(app);
app.use(oauth);
app.use(routes);


server.listen(port, () => {
    console.log(
        `${chalk.green('✓')} ${chalk.blue(
            `Listening on port ${port}. Visit http://localhost:${port}/ in your browser.`
        )}`
    );
});


