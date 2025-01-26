import { createPayment, retrievePayment } from '../nexi-api/payment-api.js';
import finalizeCheckout from '../utils/finalize-checkout.js';
import updateLoader from '../utils/loader.js';
import preparePaymentRequest from '../utils/prepare-payment-request.js';
import writeCsv from '../utils/write-csv.js';

const payload = {
    order: {
        items: [
            {
                reference: 'subscription',
                name: 'Subscription',
                quantity: 1,
                unit: 'pcs',
                unitPrice: 0,
                taxRate: 0,
                taxAmount: 0,
                netTotalAmount: 0,
                grossTotalAmount: 0,
            },
        ],
        amount: 0,
        currency: 'SEK',
        reference: 'subscription',
    },
    checkout: {
        termsUrl: 'https://shop.easy.nets.eu/terms',
        integrationType: 'EmbeddedCheckout',
        merchantHandlesConsumerData: true,
        url: 'https://shop.easy.nets.eu/checkout',
    },
    subscription: {
        endDate: '2099-12-31T23:59:59.999Z',
        interval: 0,
    },
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function runCreateSubscriptions(options, arg) {
    // create array for responses
    const responses = [];
    const setDelay = 1000 / process.env.REQUEST_PER_SECOND;

    if (!arg) {
        arg = 1;
    }

    const subscription = options.unscheduled ? 2 : 1;

    // initialize loader
    updateLoader(0, arg, 'Creating subscriptions');
    for (let i = 0; i < arg; i++) {
        try {
            // create payment request

            const payload = preparePaymentRequest(
                options.currency,
                options.charge,
                subscription
            );

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
