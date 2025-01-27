import axios from 'axios';
import chalk from 'chalk';
import { fork } from 'child_process';
import localtunnel from 'localtunnel';
import util from 'node:util';
import { resolve } from 'path';

import { createPayment, retrievePayment } from '../nexi-api/payment.js';
import configPromise from '../utils/config.js';
import generatePayload from '../utils/generatePayload.js';

const config = await configPromise;
const log = console.log;

const serverPath = resolve(
    new URL(import.meta.url).pathname,
    '../../../bin/server.js'
);

export default async function runCreateCheckout(options) {
    // create tunnel to receive webhooks
    const tunnel = await localtunnel({ port: config.port });

    let payload = generatePayload(options);
    payload.notifications = {
        webHooks: [
            {
                eventName: 'payment.cancel.failed',
                url: tunnel.url + '/webhook',
                authorization: 'abcdef1234567890',
            },
            {
                eventName: 'payment.cancel.created',
                url: tunnel.url + '/webhook',
                authorization: 'abcdef1234567890',
            },
            {
                eventName: 'payment.charge.created',
                url: tunnel.url + '/webhook',
                authorization: 'abcdef1234567890',
            },
            {
                eventName: 'payment.charge.created.v2',
                url: tunnel.url + '/webhook',
                authorization: 'abcdef1234567890',
            },
            {
                eventName: 'payment.charge.failed',
                url: tunnel.url + '/webhook',
                authorization: 'abcdef1234567890',
            },
            {
                eventName: 'payment.charge.failed.v2',
                url: tunnel.url + '/webhook',
                authorization: 'abcdef1234567890',
            },
            {
                eventName: 'payment.created',
                url: tunnel.url + '/webhook',
                authorization: 'abcdef1234567890',
            },
            {
                eventName: 'payment.refund.completed',
                url: tunnel.url + '/webhook',
                authorization: 'abcdef1234567890',
            },
            {
                eventName: 'payment.refund.failed',
                url: tunnel.url + '/webhook',
                authorization: 'abcdef1234567890',
            },
            {
                eventName: 'payment.refund.initiated',
                url: tunnel.url + '/webhook',
                authorization: 'abcdef1234567890',
            },
            {
                eventName: 'payment.reservation.created',
                url: tunnel.url + '/webhook',
                authorization: 'abcdef1234567890',
            },
            {
                eventName: 'payment.reservation.created.v2',
                url: tunnel.url + '/webhook',
                authorization: 'abcdef1234567890',
            },
            {
                eventName: 'payment.reservation.failed',
                url: tunnel.url + '/webhook',
                authorization: 'abcdef1234567890',
            },
        ],
    };
    if (!options.hosted) {
        log(chalk.green.bold('Sent payload:'));
        log(
            util.inspect(payload, {
                depth: null,
                colors: true,
                maxArrayLength: null,
            })
        );
    }

    if (options.hosted) {
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
            chalk.green(
                response.hostedPaymentPageUrl + '&language=' + options.lang
            )
        );
    } else {
        const response = await createPayment(payload, options);
        log(chalk.blue.bold('\nReceived Payment ID: ') + response.paymentId);
        const serverProcess = fork(serverPath);
        serverProcess.on('message', async message => {
            if (message === 'server-started') {
                // Send requests to the server
                const url = `http://localhost:${config.port}/data`;

                const postData = {
                    checkoutKey: config.testCheckoutKey,
                    paymentId: response.paymentId,
                    language: options.lang,
                };

                try {
                    const configResponse = await axios.post(url, postData, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        timeout: 5000,
                    });
                    return configResponse;
                } catch (error) {
                    if (error.response && error.response.status === 401) {
                        console.error(
                            'Error: The supplied API key is incorrect.'
                        );
                    } else if (error.code === 'ECONNABORTED') {
                        console.error(
                            chalk.red.bold('ERROR: Request timed out')
                        );
                    } else {
                        console.error(
                            chalk.red.bold(
                                `ERROR: HTTP ${error.response.status}`
                            ) + `\nError fetching ${url}`
                        );
                    }
                    throw error;
                }
            }
            if (message === 'payment-completed') {
                log(chalk.green.bold('\nFetching payment:'));
                const retrieveResponse = await retrievePayment(
                    response.paymentId,
                    options
                );
                log(
                    util.inspect(retrieveResponse.data, {
                        depth: null,
                        colors: true,
                        maxArrayLength: null,
                    })
                );
                serverProcess.kill();
                process.exit(1);
            }
        });
        // Handle process exit and terminate server process
        process.on('exit', () => {
            serverProcess.kill();
        });

        process.on('SIGINT', () => {
            process.exit();
        });

        process.on('SIGTERM', () => {
            process.exit();
        });
    }
}
