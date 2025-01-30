#!/usr/bin/env node
import chalk from 'chalk';
import { program } from 'commander';

import runCreateCheckout from '../src/commands/createCheckout.js';
import runCreateCompletedCheckout from '../src/commands/createCompletedCheckout.js';
import runCreatePayload from '../src/commands/createPayload.js';
import runFetchPayment from '../src/commands/fetchPayment.js';
import runTerminatePayment from '../src/commands/terminatePayment.js';
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

program
    .name('nexi-cli')
    .description(
        chalk.bold.blue('Nexi Checkout CLI') +
            chalk.dim('\nA CLI tool to interact with Nexi Checkout Payment API')
    )
    .version('0.9.2');

program
    .command('fetch-payment')
    .argument('[paymentId]', 'Payment ID')
    .description('Fetch payment information individually or in bulk')
    .option('-f, --file <path>', 'Path to file containing list of payment ID')
    .option('-p, --production', 'Use production environment', config.production)
    .option('--prod-secret-key <key>', 'Your production secret API key')
    .option('-e, --export', 'Export table to CSV-file', config.export)
    .option('-t, --table', 'Display results in a table')
    .option('--test-secret-key <key>', 'Your test secret API key')
    .action((arg, options) => {
        if (!arg && !options.file) {
            console.error(
                'Error: Either the argument or the file option must be set.'
            );
            process.exit(1);
        }
        options.prodSecretKey = options.prodSecretKey
            ? options.prodSecretKey
            : config.prodSecretKey;
        options.testSecretKey = options.testSecretKey
            ? options.testSecretKey
            : config.testSecretKey;
        options.production = options.production
            ? options.production
            : config.production;
        options.export = options.export ? options.export : config.export;
        runFetchPayment(options, arg);
    });

program
    .command('create-payload')
    .description('Returns a payload for a create payment request')
    .option(
        '-C, --charge',
        'Charge payment automatically if reserved',
        config.charge || false
    )
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
    .option('--no-charge', 'Disables automatic charge')
    .option('--no-consumer', 'Automatically removes consumer object')
    .option('--no-mhcd', 'Displays address fields in checkout')
    .action(options => {
        try {
            validateTarget(options.consumerLocale);
        } catch (error) {
            console.error('Not a valid consumer locale');
            process.exit(1);
        }
        runCreatePayload(options);
    });

program
    .command('create-checkout')
    .description('Create a embedded checkout or URL')
    .option(
        '-C, --charge',
        'Charge payment automatically if reserved',
        config.charge || false
    )
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
    .option(
        '--consumer-locale <locale>',
        'Set consumer locale',
        config.consumerLocale || 'sv'
    )
    .option(
        '--consumer-type <type>',
        'Set consumer type',
        config.consumerType || 'B2C'
    )
    .option('-f, --finalized-event', 'Sends payment-order-finalized as false')
    .option('-H, --hosted', 'Hosted mode provides checkout link')
    .option(
        '--lang <string>',
        'Set checkout language',
        config.checkoutLanguage || 'en-GB'
    )
    .option(
        '-m, --mhcd',
        'Hides address fields in checkout',
        config.mhcd || false
    )
    .option('--no-charge', 'Negate charge')
    .option('--no-consumer', 'Negate consumer')
    .option('--no-mhcd', 'Negate mhcd')
    .option('--no-production', 'Negate production')
    .option('--no-verbose', 'Negate verbose')
    .option(
        '-p, --production',
        'Use production environment',
        config.production || false
    )
    .option('--prod-checkout-key <string>', 'Your production checkout key')
    .option('--prod-secret-key <string>', 'Your production secret API key')
    .option('--test-checkout-key <string>', 'Your test checkout key')
    .option('--test-secret-key <string>', 'Your test secret API key')
    .option('-v, --verbose', 'Output additional information', config.verbose)
    .action(options => {
        options.prodSecretKey = options.prodSecretKey
            ? options.prodSecretKey
            : config.prodSecretKey;
        options.prodCheckoutKey = options.prodCheckoutKey
            ? options.prodCheckoutKey
            : config.prodCheckoutKey;
        options.testSecretKey = options.testSecretKey
            ? options.testSecretKey
            : config.testSecretKey;
        options.testCheckoutKey = options.testCheckoutKey
            ? options.testCheckoutKey
            : config.testCheckoutKey;
        options.themeDark = config.themeDark;
        options.themeLight = config.themeLight;
        runCreateCheckout(options);
    });

program
    .command('create-completed-checkout')
    .argument('[number]', 'Number of checkouts')
    .description('Create completed checkout in test environment')
    .option(
        '-C, --charge',
        'Charge payment automatically if reserved',
        config.charge || false
    )
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
    .option(
        '--consumer-locale <locale>',
        'Set consumer locale',
        config.consumerLocale || 'en'
    )
    .option(
        '--consumer-type <type>',
        'Set consumer type',
        config.consumerType || 'B2C'
    )
    .option('-e, --export', 'Export table to CSV-file', config.export)
    .option('-H, --hosted', 'Hosted mode provides checkout link')
    .option(
        '-m, --mhcd',
        'Hides address fields in checkout',
        config.mhcd || false
    )
    .option('--no-charge', 'Negate charge')
    .option('--no-consumer', 'Negate consumer')
    .option('--no-export', 'Negate export')
    .option('--no-mhcd', 'Negate mhcd')
    .option('--no-verbose', 'Negate verbose')
    .option('-S, --scheduled', 'Create scheduled subscription')
    .option('-t, --table', 'Display results in a table')
    .option('--test-checkout-key <key>', 'Your test checkout API key')
    .option('--test-secret-key <key>', 'Your test secret API key')
    .option('-u, --unscheduled', 'Create unscheduled subscription')
    .option('-v, --verbose', 'Output additional information', config.verbose)
    .action((arg, options) => {
        options.testSecretKey = options.testSecretKey
            ? options.testSecretKey
            : config.testSecretKey;
        options.testCheckoutKey = options.testCheckoutKey
            ? options.testCheckoutKey
            : config.testCheckoutKey;
        if (options.unscheduled && options.scheduled) {
            console.error(
                'Error: Can not create both scheduled and unscheduled subscription for same payment ID.'
            );
            process.exit(1);
        } else {
            runCreateCompletedCheckout(options, arg);
        }
    });

program
    .command('terminate-payment')
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
    .action((arg, options) => {
        if (!arg && !options.file) {
            console.error(
                'Error: Either the argument or the file option must be set.'
            );
            process.exit(1);
        }
        options.prodSecretKey = options.prodSecretKey
            ? options.prodSecretKey
            : config.prodSecretKey;
        options.testSecretKey = options.testSecretKey
            ? options.testSecretKey
            : config.testSecretKey;
        options.export = options.export ? options.export : config.export;
        runTerminatePayment(options, arg);
    });

program.parse(process.argv);
