import axios from 'axios';
import chalk from 'chalk';
import { colorize } from 'json-colorizer';

const live = 'https://api.dibspayment.eu/v1';
const test = 'https://test.api.dibspayment.eu/v1';

function getBaseUrlAndCredentials(options) {
    return {
        baseUrl: options.production ? live : test,
        key: options.production ? options.prodSecretKey : options.testSecretKey,
    };
}

function errorHandling(error) {
    if (error.response) {
        console.error(
            chalk.red.bold(`\nERROR: HTTP ${error.response.status}`) +
                chalk.red.bold(`\n${error.response.statusText}`) +
                chalk.bold('\nURL: ') +
                error.response.config.url +
                chalk.bold('\nMethod: ') +
                error.response.config.method.toUpperCase() +
                chalk.bold('\nHeaders:\n') +
                error.response.config.headers
        );
        if (error.response.data) {
            console.error(
                chalk.bold('\nResponse Body:\n') + JSON.stringify(error.response.data, null, 2) // Pretty-print response body
            );
        }
    } else if (error.code === 'ECONNABORTED') {
        console.error(chalk.red.bold('ERROR: Request timed out'));
    }
}

export async function retrievePayment(paymentId, options) {
    const environmentConfig = getBaseUrlAndCredentials(options);
    const url = environmentConfig.baseUrl + '/payments/' + paymentId;
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: environmentConfig.key,
                CommercePlatformTag: 'nexi-cli',
            },
            timeout: 5000,
        });
        return response;
    } catch (error) {
        errorHandling(error);
        process.exit(1);
    }
}

export async function createPayment(payload, options) {
    const environmentConfig = getBaseUrlAndCredentials(options);
    const url = environmentConfig.baseUrl + '/payments/';
    try {
        const response = await axios.post(url, payload, {
            headers: {
                Authorization: environmentConfig.key,
                CommercePlatformTag: 'nexi-cli',
            },
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        errorHandling(error);
        process.exit(1);
    }
}

export async function updateReference(paymentId, payload, options) {
    const environmentConfig = getBaseUrlAndCredentials(options);
    const url = environmentConfig.baseUrl + '/payments/' + paymentId + '/referenceinformation';
    try {
        const response = await axios.put(url, payload, {
            headers: {
                Authorization: environmentConfig.key,
                CommercePlatformTag: 'nexi-cli',
            },
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        errorHandling(error);
        process.exit(1);
    }
}

export async function updateOrder(paymentId, payload, options) {
    const environmentConfig = getBaseUrlAndCredentials(options);
    const url = environmentConfig.baseUrl + '/payments/' + paymentId + '/orderitems';
    try {
        const response = await axios.put(url, payload, {
            headers: {
                Authorization: environmentConfig.key,
                CommercePlatformTag: 'nexi-cli',
            },
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        errorHandling(error);
        process.exit(1);
    }
}

export async function updateMyReference(paymentId, payload, options) {
    const environmentConfig = getBaseUrlAndCredentials(options);
    const url = environmentConfig.baseUrl + '/payments/' + paymentId + '/myreference';
    try {
        const response = await axios.put(url, payload, {
            headers: {
                Authorization: environmentConfig.key,
                CommercePlatformTag: 'nexi-cli',
            },
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        errorHandling(error);
        process.exit(1);
    }
}

export async function terminatePayment(paymentId, options) {
    const environmentConfig = getBaseUrlAndCredentials(options);
    const url = environmentConfig.baseUrl + '/payments/' + paymentId + '/terminate';
    try {
        const response = await axios.put(
            url,
            {},
            {
                headers: {
                    Authorization: environmentConfig.key,
                    CommercePlatformTag: 'nexi-cli',
                },
                timeout: 5000,
            }
        );
        return response;
    } catch (error) {
        if (error.response.status === 400) {
            return error.response;
        } else {
            errorHandling(error);
            process.exit(1);
        }
    }
}

export async function cancelPayment(paymentId, payload, options) {
    const environmentConfig = getBaseUrlAndCredentials(options);
    const url = environmentConfig.baseUrl + '/payments/' + paymentId + '/cancels';
    try {
        const response = await axios.post(url, payload, {
            headers: {
                Authorization: environmentConfig.key,
                CommercePlatformTag: 'nexi-cli',
            },
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        errorHandling(error);
        process.exit(1);
    }
}

export async function chargePayment(paymentId, payload, options) {
    const environmentConfig = getBaseUrlAndCredentials(options);
    const url = environmentConfig.baseUrl + '/payments/' + paymentId + '/charges';
    try {
        const response = await axios.post(url, payload, {
            headers: {
                Authorization: environmentConfig.key,
                CommercePlatformTag: 'nexi-cli',
            },
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        errorHandling(error);
        process.exit(1);
    }
}

export async function retrieveCharge(chargeId, options) {
    const environmentConfig = getBaseUrlAndCredentials(options);
    const url = environmentConfig.baseUrl + '/charges/' + chargeId;
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: environmentConfig.key,
                CommercePlatformTag: 'nexi-cli',
            },
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        errorHandling(error);
        process.exit(1);
    }
}

export async function refundCharge(chargeId, payload, options) {
    const environmentConfig = getBaseUrlAndCredentials(options);
    const url = environmentConfig.baseUrl + '/charges/' + chargeId + '/refunds';
    try {
        const response = await axios.post(url, payload, {
            headers: {
                Authorization: environmentConfig.key,
                CommercePlatformTag: 'nexi-cli',
            },
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        errorHandling(error);
        process.exit(1);
    }
}

export async function refundPayment(paymentId, payload, options) {
    const environmentConfig = getBaseUrlAndCredentials(options);
    const url = environmentConfig.baseUrl + '/payments/' + paymentId + '/refunds';
    try {
        const response = await axios.post(url, payload, {
            headers: {
                Authorization: environmentConfig.key,
                CommercePlatformTag: 'nexi-cli',
            },
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        errorHandling(error);
        process.exit(1);
    }
}

export async function retrieveRefund(refundId, options) {
    const environmentConfig = getBaseUrlAndCredentials(options);
    const url = environmentConfig.baseUrl + '/refunds/' + refundId;
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: environmentConfig.key,
                CommercePlatformTag: 'nexi-cli',
            },
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        errorHandling(error);
        process.exit(1);
    }
}

export async function cancelPendingRefund(refundId, options) {
    const environmentConfig = getBaseUrlAndCredentials(options);
    const url = environmentConfig.baseUrl + '/pending-refund/' + refundId + '/cancel';
    try {
        const response = await axios.post(url, {
            headers: {
                Authorization: environmentConfig.key,
                CommercePlatformTag: 'nexi-cli',
            },
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        errorHandling(error);
        process.exit(1);
    }
}
