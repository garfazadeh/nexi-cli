#!/usr/bin/env node
import chalk from 'chalk';
import { program } from 'commander';

import configPromise from '../src/utils/config.js';

// Read and use the config file
const config = await configPromise;

function validateTarget(value) {
    const allowedValues = ['da', 'de', 'de_AT', 'en', 'nb_NO', 'sv'];
    if (!allowedValues.includes(value)) {
        throw new Error(
            `Invalid target value. Allowed values are: ${allowedValues.join(', ')}`
        );
    }
    return value;
}

function applyConfigDefaults(options, config) {
    // Iterate over the keys in config
    for (const key in config) {
        if (config.hasOwnProperty(key)) {
            // If the option is not provided (undefined or null), use the value from config
            if (options[key] === undefined || options[key] === null) {
                options[key] = config[key];
            }
        }
    }

    return options;
}

function addSecretKeysOptions(cmd) {
    return cmd
        .option('--prod-secret-key <string>', 'Your production secret API key')
        .option('--test-secret-key <string>', 'Your test secret API key')
        .option('--no-production', 'Negate production')
        .option(
            '-p, --production',
            'Use production environment',
            config.production || false
        );
}

function addCreatePaymentOptions(cmd) {
    return cmd
        .option(
            '-C, --charge',
            'Charge payment automatically if reserved',
            config.charge || false
        )
        .option('--no-charge', 'Disables automatic charge')
        .option(
            '-c, --currency <code>',
            'Set checkout currency',
            config.currency || 'EUR'
        )
        .option(
            '--consumer',
            'Automatically adds consumer object',
            config.consumer || false
        )
        .option('--no-consumer', 'Automatically removes consumer object')
        .option(
            '--consumer-locale <locale>',
            "Available locales: 'da', 'de', 'de_AT', 'en', 'nb_NO', 'sv'",
            config.consumerLocale || 'en_GB'
        )
        .option(
            '--consumer-type <type>',
            'Set type of consumer generated',
            config.consumerType || 'B2C'
        )
        .option('-H, --hosted', 'Hosted mode provides checkout link')
        .option(
            '-m, --mhcd',
            'Hides address fields in checkout',
            config.mhcd || false
        )
        .option('--no-mhcd', 'Displays address fields in checkout')
        .option('--port', 'Server port', config.port)
        .option('-S, --scheduled', 'Create scheduled subscription')
        .option('-u, --unscheduled', 'Create unscheduled subscription');
}

function addPrintListOptions(cmd) {
    return cmd
        .option('-e, --export', 'Export table to CSV-file', config.export)
        .option('--no-export', 'Disables csv-export')
        .option('-t, --table', 'Display results in a table')
        .option('--no-table', 'Prints raw data to console');
}

program
    .name('nexi-cli')
    .description(
        chalk.bold.blue('Nexi Checkout CLI') +
            chalk.dim('\nA CLI tool to interact with Nexi Checkout Payment API')
    )
    .version('0.9.2');

const fetch = program.command('fetch').description('fetch information');
const create = program.command('create').description('create payments');
/* const charge = program
    .command('charge')
    .description('Charge reservations or subscriptions');
const refund = program
    .command('refund')
    .description('Refund charges or payments');
const update = program.command('update').description('Update payments');
const cancel = program
    .command('cancel')
    .description('Cancel reservations or refunds');*/
const terminate = program
    .command('terminate')
    .description('terminate payments');
//const verify = program.command('verify').description('Verify subscriptions');
const init = program.command('init').description('initiate a checkout');
const mock = program.command('mock').description('create mock payments');

addPrintListOptions(addSecretKeysOptions(fetch.command('payment')))
    .argument('[paymentId]', 'Payment ID')
    .description('Fetch payment information individually or in bulk')
    .option('-f, --file <path>', 'Path to file containing list of payment ID')
    .action(async (arg, options) => {
        if (!arg && !options.file) {
            console.error(
                'Error: Either the argument or the file option must be set.'
            );
            process.exit(1);
        }
        const mergedOptions = applyConfigDefaults(options, config);
        const { default: runFetchPayment } = await import(
            '../src/commands/fetchPayment.js'
        );
        runFetchPayment(mergedOptions, arg);
    });

addCreatePaymentOptions(create.command('payment'))
    .description('Returns a payload for a create payment request')
    .action(async options => {
        const mergedOptions = applyConfigDefaults(options, config);
        try {
            validateTarget(mergedOptions.consumerLocale);
        } catch (error) {
            console.error('Not a valid consumer locale');
            process.exit(1);
        }
        const { default: runCreatePayload } = await import(
            '../src/commands/createPayload.js'
        );
        runCreatePayload(mergedOptions);
    });

addSecretKeysOptions(addCreatePaymentOptions(init.command('checkout')))
    .description('Create a embedded checkout or URL')
    .option('-f, --finalized-event', 'Sends payment-order-finalized as false')
    .option(
        '--lang <string>',
        'Set checkout language',
        config.checkoutLanguage || 'en-GB'
    )
    .option('--no-verbose', 'Negate verbose')
    .option('--test-checkout-key <string>', 'Your test checkout key')
    .option('--prod-checkout-key <string>', 'Your production checkout key')
    .option('-v, --verbose', 'Output additional information', config.verbose)
    .action(async options => {
        const mergedOptions = applyConfigDefaults(options, config);
        const { default: runCreateCheckout } = await import(
            '../src/commands/createCheckout.js'
        );
        runCreateCheckout(mergedOptions);
    });

addSecretKeysOptions(addCreatePaymentOptions(mock.command('payment')))
    .argument('[number]', 'Number of completed payments')
    .description(
        'Create mock payments for testing purposes in test environment'
    )
    .option('-e, --export', 'Export table to CSV-file', config.export)
    .option('--no-export', 'Negate export')
    .option('--no-verbose', 'Negate verbose')

    .option('-t, --table', 'Display results in a table')
    .option('-v, --verbose', 'Output additional information', config.verbose)
    .action(async (arg, options) => {
        const mergedOptions = applyConfigDefaults(options, config);
        if (mergedOptions.unscheduled && mergedOptions.scheduled) {
            console.error(
                'Error: Can not create both scheduled and unscheduled subscription for same payment ID.'
            );
            process.exit(1);
        } else {
            const { default: runCreateCompletedCheckout } = await import(
                '../src/commands/createCompletedCheckout.js'
            );
            runCreateCompletedCheckout(mergedOptions, arg);
        }
    });

terminate
    .command('payment')
    .argument('[paymentId]', 'Payment ID')
    .description('Terminate payment information individually or in bulk')
    .option('-e, --export', 'Export table to CSV-file', config.export)
    .option('-f, --file <path>', 'Path to file containing list of payment ID')
    .option('--no-export', 'Negate export')
    .option('--no-production', 'Negate production')
    .option(
        '-p, --production',
        'Use production environment',
        config.production || false
    )
    .option('--prod-secret-key <key>', 'Your production secret API key')
    .option('-t, --table', 'Display results in a table')
    .option('--test-secret-key <key>', 'Your test secret API key')
    .action(async (arg, options) => {
        if (!arg && !options.file) {
            console.error(
                'Error: Either the argument or the file option must be set.'
            );
            process.exit(1);
        }
        const mergedOptions = applyConfigDefaults(options, config);
        const { runTerminatePayment } = await import(
            '../src/commands/terminatePayment.js'
        );
        runTerminatePayment(mergedOptions, arg);
    });

program.parse(process.argv);
