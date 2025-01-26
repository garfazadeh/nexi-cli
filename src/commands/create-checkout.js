import chalk from 'chalk';

import { createPayment } from '../nexi-api/payment-api.js';
import preparePaymentRequest from '../utils/prepare-payment-request.js';

const log = console.log;

export default async function runCreateCheckout(options) {
    let payload = preparePaymentRequest(options.currency, options.charge);

    payload.checkout = {
        ...payload.checkout,
        ...{
            integrationType: 'HostedPaymentPage',
            url: null,
            returnUrl: 'https://www.test.com/success',
            cancelUrl: 'https://www.test.com/cancel',
            termsUrl: 'https://www.test.com/terms',
            merchantHandlesConsumerData: true,
        },
    };
    const response = await createPayment(payload, options);
    log(chalk.blue.bold('Payment ID: '));
    log(chalk.green(response.paymentId));
    log(chalk.blue.bold('URL:'));
    log(
        chalk.green(response.hostedPaymentPageUrl + '&language=' + options.lang)
    );
}
