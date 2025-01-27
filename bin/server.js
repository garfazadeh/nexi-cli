import chalk from 'chalk';
import express from 'express';
import util from 'node:util';
import { join } from 'path';
import { fileURLToPath } from 'url';

import configPromise from '../src/utils/config.js';

const config = await configPromise;

const app = express();
const port = config.port;

// Convert __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

// Use JSON middleware
app.use(express.json());

// Serve static files from the 'www' directory
app.use(express.static(join(__dirname, 'www')));

let data = {};

// POST endpoint to save data
app.post('/data', (req, res) => {
    data = req.body;
    res.send('Data received');
});

// GET endpoint to retrieve data
app.get('/data', (req, res) => {
    res.json(data);
});

// POST endpoint to save data
app.post('/event', (req, res) => {
    console.log(chalk.bold.green('\nCheckout JS SDK event received:'));
    console.log(req.body);
    res.send('Data received');
});

// GET endpoint to retrieve data
app.post('/webhook', (req, res) => {
    console.log(
        chalk.bold.green(`\nWebhook event ${req.body.event} received:`)
    );
    console.log(
        util.inspect(req.body, {
            depth: null,
            colors: true,
            maxArrayLength: null,
        })
    );
    res.status(200).send('Webhook received');
});

app.listen(port, () => {
    console.log(
        chalk.green.bold(`\nCheckout accessible on http://localhost:${port}`)
    );
    if (process.send) {
        process.send('server-started');
    }
});
