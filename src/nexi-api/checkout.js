import axios from 'axios';
import chalk from 'chalk';
import util from 'node:util';

import configPromise from '../utils/config.js';

const config = await configPromise;

const checkoutUrl = 'https://test.checkout.dibspayment.eu';

export async function checkoutPay(
    paymentId,
    amount,
    expiryYear,
    expiryMonth,
    testCardNumber,
    testCheckoutKey
) {
    const url = checkoutUrl + '/api/v1/pay';
    const payload = {
        type: 'card',
        paymentType: {
            card: {
                cardNumber: testCardNumber,
                cardVerificationCode: '125',
                expiryMonth: expiryMonth,
                expiryYear: expiryYear,
                cardholderName: '',
            },
        },
        acceptedTermsAndConditions: true,
        amountConfirmedByConsumer: amount,
        consumerCheckedSaveNewPaymentMethod: false,
        consumerHasConsentedToRememberingNewDevice: false,
        consumerWantsToBeAnonymous: false,
    };
    try {
        const response = await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/json',
                paymentId: paymentId,
                CheckoutKey: testCheckoutKey,
            },
        });
        return response.data.redirectUrl;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.error('\nError: The supplied checkout key is incorrect.');
        } else if (error.code === 'ECONNABORTED') {
            console.error(chalk.red.bold('ERROR: Request timed out'));
        } else {
            const payloadLog = util.inspect(payload, {
                depth: null,
                colors: true,
                maxArrayLength: null,
            });
            console.error(
                chalk.red.bold(`\nERROR: HTTP ${error.response.status}`) +
                    `\nError posting ${url}\nPayload:\n${payloadLog}`
            );
        }
        throw error;
    }
}

export async function pares(paymentId, ThreedsSessionId, testCheckoutKey) {
    const url = checkoutUrl + '/api/v1/callback/pares';
    const payload = {
        AcsFormActionUrl: 'https://3ds-acs.test.modirum.com/mdpayacs/creq',
        AuthenticationStatus: 'Y',
        EnrollmentStatus: 'Y',
        Cavv: 'xgQOljwoAAAAAAAAAAAAAAAAAAA=',
        CavvAlgorithm: null,
        Eci: '02',
        ReferenceId: paymentId,
        SessionId: ThreedsSessionId,
        ThreeDsAvailable: true,
        Xid: 'G1RH7FDF+LeKxR0o5RjXLgSBXZk=',
        DsTransId: '3b65f1c8-3976-5f2e-8000-000001c0f409',
        MessageVersion: '2.2.0',
        CardHolderInfo: null,
        MessageExtension: null,
    };
    try {
        const response = await axios.post(url, payload, {
            headers: {
                paymentId: paymentId,
                CheckoutKey: testCheckoutKey,
                'Content-Type': 'application/json',
                'x-api-key': config.xApiKey,
            },
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.error('Error: The supplied checkout key is incorrect.');
        } else if (error.code === 'ECONNABORTED') {
            console.error(chalk.red.bold('\nERROR: Request timed out'));
        } else {
            const payloadLog = util.inspect(payload, {
                depth: null,
                colors: true,
                maxArrayLength: null,
            });
            console.error(
                chalk.red.bold(`\nERROR: HTTP ${error.response.status}`) +
                    `\nError posting ${url}\nPayload:\n${payloadLog}`
            );
        }
        throw error;
    }
}
