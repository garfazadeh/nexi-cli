import { createPayment, retrievePayment } from '../nexi-api/payment-api.js';
import finalizeCheckout from '../utils/finalize-checkout.js';
import updateLoader from '../utils/loader.js';
import preparePaymentRequest from '../utils/prepare-payment-request.js';
import writeCsv from '../utils/write-csv.js';

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function runCreateCompletedCheckout(options, arg) {
    // create array for responses
    const responses = [];
    const setDelay = 1000 / process.env.REQUEST_PER_SECOND;

    if (!arg) {
        arg = 1;
    }

    // initialize loader
    updateLoader(0, arg, 'Creating completed checkouts');
    for (let i = 0; i < arg; i++) {
        try {
            // create payment request
            const payload = preparePaymentRequest(
                options.currency,
                options.charge
            );

            // create payment
            const createdPayment = await createPayment(payload, options);
            const paymentId = createdPayment.paymentId;

            // finalize checkout
            const paid = await finalizeCheckout(
                paymentId,
                payload.order.amount
            );

            // fetch finalized payment
            const response = await retrievePayment(paymentId, options);

            const { payment } = response.data;
            const { orderDetails, paymentDetails, summary } = payment;
            const formatAmount = amount =>
                amount && amount !== 0 ? (amount / 100).toFixed(2) : 0;
            responses.push({
                paymentId: payment.paymentId,
                currency: orderDetails.currency,
                paymentMethod: paymentDetails.paymentMethod,
                reservedAmount: formatAmount(summary.reservedAmount) || '',
                chargedAmount: formatAmount(summary.chargedAmount) || '',
            });
            updateLoader(i + 1, arg, 'Creating completed checkouts');
            await delay(setDelay);
        } catch (error) {
            // Handle any errors that may be thrown during the process
            console.error('Creation of completed checkouts failed:', error);
        }
    }
    console.log('');
    console.table(responses);

    if (options.save) {
        // create fields for csv file
        const fields = [
            { label: 'Payment ID', value: 'paymentId' },
            { label: 'Currency', value: 'currency' },
            { label: 'Payment Type', value: 'paymentType' },
            { label: 'Payment Method', value: 'paymentMethod' },
            { label: 'Masked PAN', value: 'maskedPan' },
            { label: 'Card Expiry date', value: 'expiryDate' },
        ];
        writeCsv('payment_ids.csv', responses, fields);
    }
}
