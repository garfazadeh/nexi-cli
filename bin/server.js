#!/usr/bin/env node
import chalk from 'chalk';
import express from 'express';
import { colorize } from 'json-colorizer';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import configPromise from '../src/utils/config.js';

const config = await configPromise;

const app = express();
const port = config.port;

// Convert __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use JSON middleware
app.use(express.json());

// Serve static files from the 'www' directory
app.use(express.static(join(__dirname, 'www')));

let data = {};

// Function to log events
const logEvent = (event, value = '') => {
    if (event === 'iframe-loaded' && config.verbose) {
        console.log(`\nClient raised event ${chalk.bold(event)}`);
    } else if (event === 'payment-order-finalized') {
        console.log(`\nClient raised ${chalk.bold(event)} event with value ${chalk.bold(value)}`);
    } else if (event !== 'iframe-loaded' && config.verbose) {
        console.log(chalk.blue(`\nCheckout JS raised event ${chalk.bold(event)}`));
    }
};

// POST endpoint to save data
app.post('/data', (req, res) => {
    data = req.body;
    res.send('Data received');
});

// GET endpoint to retrieve data
app.get('/data', (req, res) => {
    res.json(data);
});

// POST endpoint to handle events
app.post('/event', (req, res) => {
    const { event, value } = req.body;
    logEvent(event, value);
    res.send('Data received');
});

// POST endpoint to handle webhooks
app.post('/webhook', (req, res) => {
    const { event } = req.body;
    if (config.verbose) {
        console.log(chalk.green(`\nWebhook ${chalk.bold(event)} event received:`));
        console.log(colorize(JSON.stringify(req.body, null, 2)));
    } else {
        console.log(chalk.green(`\nWebhook ${chalk.bold(event)} event received`));
    }
    res.status(200).send('Webhook received');
});

// Start the server
app.listen(port, () => {
    console.log(`\nCheckout accessible on ${chalk.bold.underline(`http://localhost:${port}`)}`);
    if (process.send) {
        process.send('server-started');
    }
});
