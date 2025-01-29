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
    if (req.body.event === 'iframe-loaded' && config.verbose) {
        console.log(
            chalk.dim(`\nClient raised event ${chalk.bold(req.body.event)}`)
        );
    }
    if (req.body.event === 'payment-order-finalized') {
        console.log(
            chalk.yellow(
                `\nClient sent ${chalk.bold(req.body.event)} event with value ${chalk.bold(req.body.value)}`
            )
        );
    } else {
        console.log(
            chalk.yellow(
                `\nCheckout JS raised event ${chalk.bold(req.body.event)}`
            )
        );
    }

    res.send('Data received');
});

// GET endpoint to retrieve data
app.post('/webhook', (req, res) => {
    if (data.verbose) {
        console.log(
            chalk.blue(
                `\nWebhook ` + chalk.bold(req.body.event) + ' event received:'
            )
        );
        console.log(
            util.inspect(req.body, {
                depth: null,
                colors: true,
                maxArrayLength: null,
            })
        );
    } else {
        console.log(
            chalk.blue(
                `\nWebhook ` + chalk.bold(req.body.event) + ' event received'
            )
        );
    }
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
