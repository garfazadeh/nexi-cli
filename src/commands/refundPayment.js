import chalk from 'chalk';
import { colorize } from 'json-colorizer';

import { refundPayment } from '../nexi-api/payment.js';
import { generateChargePayload } from '../utils/generatePayload.js';

export default async function runRefundPayment(options, paymentId) {
    const payload = await generateChargePayload(options);
    options.verbose ? console.log(chalk.bold('Request payload:')) : null;
    if (options.verbose || options.dryrun) {
        console.log(colorize(JSON.stringify(payload, null, 2)));
    }
    if (!options.dryrun) {
        try {
            const chargedPayment = await refundPayment(paymentId, payload, options);
            if (options.verbose) {
                console.log(chalk.bold('Response body received:'));
                console.log(chargedPayment);
            } else {
                console.log(chargedPayment.paymentId);
            }
        } catch (error) {
            console.error('Refund attempt failed', error.response.statusText);
        }
    }
}
