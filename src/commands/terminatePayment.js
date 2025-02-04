import Ajv from 'ajv';
import { readFileSync } from 'fs';
import { colorize } from 'json-colorizer';

import { terminatePayment } from '../nexi-api/payment.js';
import configPromise from '../utils/config.js';
import updateLoader from '../utils/loader.js';
import writeCsv from '../utils/writeCsv.js';

const config = await configPromise;

function validateInput(input) {
    const inputSchema = { type: 'string', pattern: '^[a-fA-F0-9]{32}$' };
    const ajv = new Ajv();
    const validatePID = ajv.compile(inputSchema);

    // validate each payment ID
    const errors = [];
    input.forEach((paymentId, index) => {
        const valid = validatePID(paymentId);
        if (!valid) {
            errors.push(`Line ${index + 1} is invalid: ${paymentId}`);
        }
    });

    // print errors if lines failed validation
    if (errors.length > 0) {
        console.error('Validation failed with the following errors:');
        errors.forEach(error => console.error(error));
        process.exit(1); // Exit the application with a non-zero status code
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function runTerminatePayment(options, arg) {
    const paymentIds = [];
    if (options.file) {
        // read file containing payment ID
        const fileContent = readFileSync(options.file, 'utf8');
        paymentIds = fileContent.split('\n').map(line => line.trim());
    } else {
        paymentIds.push(arg);
    }
    // process list of payment ID
    validateInput(paymentIds);

    const responses = [];
    const setDelay = 1000 / config.requestLimit;
    for (let i = 0; i < paymentIds.length; i++) {
        try {
            const response = await terminatePayment(paymentIds[i], options);
            responses.push({
                status: response.status,
                paymentId: paymentIds[i],
            });
            updateLoader(i + 1, paymentIds.length, 'Fetching payments');
            await delay(setDelay);
        } catch {
            process.exit(1);
        }
    }
    if (options.table) {
        // format the response object to a flat structure
        console.log('');
        console.table(responses);
    } else {
        console.log('');
        const resultList = await responses.map(response => {
            console.log(colorize(JSON.stringify(response, null, 2)));
        });
    }

    if (options.save) {
        // create fields for csv file
        const fields = [
            { label: 'Payment ID', value: 'paymentId' },
            { label: 'Currency', value: 'currency' },
            { label: 'Payment Type', value: 'paymentType' },
            { label: 'Payment Method', value: 'paymentMethod' },
            { label: 'Reserved Amount', value: 'reservedAmount' },
            { label: 'Charged Amount', value: 'chargedAmount' },
            { label: 'Refunded Amount', value: 'refundedAmount' },
            { label: 'Cancelled Amount', value: 'cancelledAmount' },
        ];
        writeCsv('responses.csv', tableContent, fields);
    }
}
