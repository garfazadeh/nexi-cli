import chalk from 'chalk';
import express from 'express';
import { join } from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

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

app.listen(port, () => {
    console.log(
        chalk.green.bold('\nCheckout accessible on http://localhost:3000')
    );
    if (process.send) {
        process.send('server-started');
    }
});
