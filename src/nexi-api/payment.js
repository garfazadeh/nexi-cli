import axios from 'axios';
import chalk from 'chalk';

const live = 'https://api.dibspayment.eu/v1/payments/';
const test = 'https://test.api.dibspayment.eu/v1/payments/';

export async function retrievePayment(paymentId, options) {
    const endpoint = options.production ? live : test;
    const key = options.production
        ? options.prodSecretKey
        : options.testSecretKey;
    const url = endpoint + paymentId;
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: key,
                CommercePlatformTag: 'nexi-cli',
            },
            timeout: 5000,
        });
        return response;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.error('Error: The supplied API key is incorrect.');
        } else if (error.code === 'ECONNABORTED') {
            console.error(chalk.red.bold('ERROR: Request timed out'));
        } else {
            console.error(
                chalk.red.bold(`ERROR: HTTP ${error.response.status}`) +
                    `\nError fetching ${url}`
            );
        }
        throw error;
    }
}

export async function createPayment(payload, options) {
    const url = options.production ? live : test;
    const key = options.production
        ? options.prodSecretKey
        : options.testSecretKey;
    try {
        const response = await axios.post(url, payload, {
            headers: {
                Authorization: key,
                CommercePlatformTag: 'nexi-cli',
            },
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.error('Error: The supplied API key is incorrect.');
        } else if (error.code === 'ECONNABORTED') {
            console.error(chalk.red.bold('ERROR: Request timed out'));
        } else {
            console.error(
                chalk.red.bold(`ERROR: HTTP ${error.response.status}`) +
                    `\nError fetching ${url}`
            );
        }
        throw error;
    }
}
