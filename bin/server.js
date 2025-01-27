import chalk from 'chalk';
import express from 'express';
import localtunnel from 'localtunnel';
import { join } from 'path';
import { fileURLToPath } from 'url';

import configPromise from '../src/utils/config.js';

const config = await configPromise;

const app = express();
const port = config.port;

(async () => {
    const tunnel = await localtunnel({ port: port });

    // the assigned public url for your tunnel
    // i.e. https://abcdefgjhij.localtunnel.me
    console.log(tunnel.url);

    tunnel.on('request', info => {
        console.log('Request info:', info);
    });

    tunnel.on('close', () => {
        // tunnels are closed
    });
})();

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
    console.log(req.body);
    if (req.body.event === 'payment-completed') {
        process.send('payment-completed');
    }
    res.send('Data received');
});

// GET endpoint to retrieve data
app.get('/webhook', (req, res) => {
    console.log('webhook received');
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
