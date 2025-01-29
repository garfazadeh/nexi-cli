import axios from 'axios';
import chalk from 'chalk';

const live = 'https://api.dibspayment.eu/v1';
const test = 'https://test.api.dibspayment.eu/v1';

function getBaseUrlAndCredentials(options) {
    return {
        baseUrl: options.production ? live : test,
        key: options.production ? options.prodSecretKey : options.testSecretKey,
    };
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

export async function updateReference(paymentId, payload, options) {
    const environmentConfig = getBaseUrlAndCredentials(options);
    const url =
        environmentConfig.baseUrl +
        '/payments/' +
        paymentId +
        '/referenceinformation';
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

export async function updateOrder(paymentId, payload, options) {
    const environmentConfig = getBaseUrlAndCredentials(options);
    const url =
        environmentConfig.baseUrl + '/payments/' + paymentId + '/orderitems';
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

export async function updateMyReference(paymentId, payload, options) {
    const environmentConfig = getBaseUrlAndCredentials(options);
    const url =
        environmentConfig.baseUrl + '/payments/' + paymentId + '/myreference';
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

export async function terminatePayment(paymentId, options) {
    const environmentConfig = getBaseUrlAndCredentials(options);
    const url =
        environmentConfig.baseUrl + '/payments/' + paymentId + '/terminate';
    try {
        const response = await axios.put(url, {
            headers: {
                Authorization: environmentConfig.key,
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

export async function cancelPayment(paymentId, payload, options) {
    const environmentConfig = getBaseUrlAndCredentials(options);
    const url =
        environmentConfig.baseUrl + '/payments/' + paymentId + '/cancels';
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

export async function chargePayment(paymentId, payload, options) {
    const environmentConfig = getBaseUrlAndCredentials(options);
    const url =
        environmentConfig.baseUrl + '/payments/' + paymentId + '/charges';
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

export async function refundPayment(paymentId, payload, options) {
    const environmentConfig = getBaseUrlAndCredentials(options);
    const url =
        environmentConfig.baseUrl + '/payments/' + paymentId + '/refunds';
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

export async function cancelPendingRefund(refundId, options) {
    const environmentConfig = getBaseUrlAndCredentials(options);
    const url =
        environmentConfig.baseUrl + '/pending-refund/' + refundId + '/cancel';
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
