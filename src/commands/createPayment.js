import chalk from 'chalk';
import { colorize } from 'json-colorizer';

import { createPayment } from '../nexi-api/payment.js';
import generatePayload from '../utils/generatePayload.js';

export default async function runCreatePayment(options) {
    const payload = await generatePayload(options);
    if (options.verbose) {
        console.log(chalk.bold(`POST v1/payments`));
        console.log(colorize(JSON.stringify(payload, null, 2)));
    }
    if (options.dryrun) {
        console.log(colorize(JSON.stringify(payload, null, 2)));
    }
    if (!options.dryrun) {
        try {
            const createdPayment = await createPayment(payload, options);
            if (options.verbose) {
                console.log(chalk.bold('\nResponse body:'));
                console.log(colorize(JSON.stringify(createdPayment, null, 2)));
            } else {
                console.log(createdPayment.paymentId);
            }
        } catch (error) {
            console.error('Creation of completed checkouts failed:', error.response.statusText);
        }
    }
}
