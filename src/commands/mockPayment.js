import { colorize } from 'json-colorizer';

import { createPayment, retrievePayment } from '../nexi-api/payment.js';
import configPromise from '../utils/config.js';
import finalizeCheckout from '../utils/finalizeCheckout.js';
import generatePayload from '../utils/generatePayload.js';
import updateLoader from '../utils/loader.js';
import writeCsv from '../utils/writeCsv.js';

const config = await configPromise;

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function runMockPayment(options, arg) {
    // create array for responses
    const responses = [];
    const setDelay = 1000 / config.requestLimit;

    if (!arg) {
        arg = 1;
    }

    // initialize loader
    updateLoader(0, arg, 'Creating completed checkouts');
    for (let i = 0; i < arg; i++) {
        try {
            // create payment request
            const payload = await generatePayload(options);

            // create payment
            const createdPayment = await createPayment(payload, options);
            const paymentId = createdPayment.paymentId;

            // finalize checkout
            await finalizeCheckout(paymentId, payload.order.amount, options.testCheckoutKey);

            // fetch finalized payment
            const response = await retrievePayment(paymentId, options);
            responses.push(response.data);
            updateLoader(i + 1, arg, 'Creating completed checkouts');
            await delay(setDelay);
        } catch (error) {
            // Handle any errors that may be thrown during the process
            console.error('Creation of completed checkouts failed:', error.response.statusText);
        }
    }
    process.stdout.write('\r' + ' '.repeat(80) + '\r');
    let tableContent = [];
    if (options.table) {
        tableContent = responses.map(response => {
            const { payment } = response;
            const { orderDetails, paymentDetails, summary } = payment;
            const formatAmount = amount => (amount && amount !== 0 ? (amount / 100).toFixed(2) : 0);
            const row = {
                paymentId: payment.paymentId,
                currency: orderDetails.currency,
                paymentMethod: paymentDetails.paymentMethod,
                reservedAmount: formatAmount(summary.reservedAmount) || '',
                chargedAmount: formatAmount(summary.chargedAmount) || '',
            };
            if (payment.unscheduledSubscription) {
                row.unscheduledSubscriptionId = payment.unscheduledSubscription.unscheduledSubscriptionId;
            }
            if (payment.subscription) {
                row.scheduledSubscriptionId = payment.subscription.id;
            }
            if (payment.charges) {
                row.chargeId = payment.charges[0].chargeId;
            }
            return row;
        });
        console.table(tableContent);
    } else {
        responses.forEach(response => {
            console.log(colorize(JSON.stringify(response, null, 2)));
        });
    }

    if (options.export) {
        // create fields for csv file
        const fields = [
            { label: 'Payment ID', value: 'paymentId' },
            { label: 'Currency', value: 'currency' },
            { label: 'Payment Type', value: 'paymentType' },
            { label: 'Payment Method', value: 'paymentMethod' },
            { label: 'Masked PAN', value: 'maskedPan' },
            { label: 'Card Expiry date', value: 'expiryDate' },
        ];
        writeCsv('payment_ids.csv', tableContent, fields);
    }
}
