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

export default async function runCreateSubscriptions(options, arg) {
    // create array for responses
    const responses = [];
    const setDelay = 1000 / config.requestLimit;

    if (!arg) {
        arg = 1;
    }

    // initialize loader
    updateLoader(0, arg, 'Creating subscriptions');
    for (let i = 0; i < arg; i++) {
        try {
            // create payment request

            const payload = generatePayload(options);

            // create payment
            const createdPayment = await createPayment(payload, options);
            const paymentId = createdPayment.paymentId;

            // finalize checkout
            const paid = await finalizeCheckout(
                paymentId,
                payload.order.amount
            );

            // fetch payment and sore
            const response = await retrievePayment(paymentId, options);
            const { payment } = response.data;
            const { orderDetails, paymentDetails, summary } = payment;

            if (options.unscheduled) {
                responses.push({
                    unscheduledSubscriptionId:
                        payment.unscheduledSubscription
                            .unscheduledSubscriptionId,
                    currency: orderDetails.currency,
                    paymentType: paymentDetails.paymentType,
                    paymentMethod: paymentDetails.paymentMethod,
                    maskedPan: paymentDetails.cardDetails.maskedPan,
                    expiryDate: paymentDetails.cardDetails.expiryDate,
                });
            } else {
                responses.push({
                    subscriptionId: payment.subscription.id,
                    currency: orderDetails.currency,
                    paymentType: paymentDetails.paymentType,
                    paymentMethod: paymentDetails.paymentMethod,
                    maskedPan: paymentDetails.cardDetails.maskedPan,
                    expiryDate: paymentDetails.cardDetails.expiryDate,
                });
            }
            updateLoader(i + 1, arg, 'Creating subscriptions');
            await delay(setDelay);
        } catch (error) {
            // Handle any errors that may be thrown during the process
            console.error('Payment processing failed:', error);
        }
    }
    console.log('');
    console.table(responses);

    if (options.save) {
        // create fields for csv file
        const fields = [
            { label: 'Subscription ID', value: 'subscriptionId' },
            { label: 'Currency', value: 'currency' },
            { label: 'Payment Type', value: 'paymentType' },
            { label: 'Payment Method', value: 'paymentMethod' },
            { label: 'Masked PAN', value: 'maskedPan' },
            { label: 'Card Expiry date', value: 'expiryDate' },
        ];
        writeCsv('subscription_ids.csv', responses, fields);
    }
}
