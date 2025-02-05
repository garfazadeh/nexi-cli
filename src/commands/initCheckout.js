import axios from 'axios';
import chalk from 'chalk';
import { fork } from 'child_process';
import { colorize } from 'json-colorizer';
import localtunnel from 'localtunnel';
import { resolve } from 'path';

import { createPayment, retrievePayment } from '../nexi-api/payment.js';
import configPromise from '../utils/config.js';
import generatePayload from '../utils/generatePayload.js';

const config = await configPromise;
const log = console.log;

const serverPath = resolve(new URL(import.meta.url).pathname, '../../../bin/server.js');

export default async function runInitCheckout(options) {
    // create tunnel to receive webhooks
    const tunnel = await localtunnel({ port: config.port });
    let payload = await generatePayload(options, tunnel);
    if (options.verbose) {
        log(chalk.bold(`POST v1/payments`));
        log(colorize(JSON.stringify(payload, null, 2)));
    } else {
        log(chalk.bold(`POST v1/payments`));
    }
    const response = await createPayment(payload, options);
    if (options.hosted) {
        log(chalk.green.bold('Payment ID: '));
        log(response.paymentId);
        log(chalk.green.bold('URL:'));
        log(response.hostedPaymentPageUrl + '&language=' + options.lang);
    } else {
        log(chalk.bold('\nResponse body:'));
        log(colorize(JSON.stringify(response, null, 2)));
        const serverProcess = fork(serverPath);
        serverProcess.on('message', async message => {
            if (message === 'server-started') {
                // Send requests to the server
                const url = `http://localhost:${config.port}/data`;

                const postData = {
                    checkoutKey: options.production ? options.prodCheckoutKey : options.testCheckoutKey,
                    environment: options.production,
                    paymentId: response.paymentId,
                    language: options.lang,
                    verbose: options.verbose,
                    themeDark: options.themeDark,
                    themeLight: options.themeLight,
                    finalizedEvent: !options.finalizedEvent,
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
                        console.error('\nError: The supplied checkout key is incorrect.');
                    } else if (error.code === 'ECONNABORTED') {
                        console.error(chalk.red.bold('ERROR: Request timed out'));
                    } else {
                        const payloadLog = colorize(JSON.stringify(postData, null, 2));
                        console.error(
                            chalk.red.bold(`\nERROR: HTTP ${error.response.status}`) +
                                `\nError posting ${url}\nPayload:\n${payloadLog}`
                        );
                    }
                    throw error;
                }
            }
            if (message === 'payment-completed') {
                log(chalk.green.bold('\nFetching payment:'));
                const retrieveResponse = await retrievePayment(response.paymentId, options);
                log(colorize(JSON.stringify(retrieveResponse.data, null, 2)));
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
