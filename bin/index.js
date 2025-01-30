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

program
    .name('nexi-cli')
    .description(
        chalk.bold.blue('Nexi Checkout CLI') +
            chalk.dim('\nA CLI tool to interact with Nexi Checkout Payment API')
    )
    .version('0.9.1');

program
    .command('fetch-payment')
    .argument('[paymentId]', 'Payment ID')
    .description('Fetch payment information individually or in bulk')
    .option('-f, --file <path>', 'Path to file containing list of payment ID')
    .option('--prod-secret-key <key>', 'Your production secret API key')
    .option('--test-secret-key <key>', 'Your test secret API key')
    .option('-p, --production', 'Use production environment', !config.isTest)
    .option('-s, --save', 'Save table to CSV-file', config.saveToCSV)
    .option('-t, --table', 'Display results in a table')
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
            : !config.isTest;
        options.save = options.save ? options.save : config.saveToCSV;
        runFetchPayment(options, arg);
    });

program
    .command('create-payload')
    .description('Returns a payload for a create payment request')
    .option(
        '-c, --currency <code>',
        'Set checkout currency',
        config.currency || 'EUR'
    )
    .option('-h, --hosted', 'Hosted mode provides checkout link')
    .option(
        '-m, --mhcd',
        'Hides address fields in checkout',
        config.mhcd || false
    )
    .option('--no-mhcd', 'Displays address fields in checkout')
    .option(
        '--consumer',
        'Automatically adds consumer object',
        config.consumer || false
    )
    .option('--no-consumer', 'Automatically removes consumer object')
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
    .option(
        '--charge',
        'Charge payment automatically if reserved',
        config.charge || false
    )
    .action(options => {
        runCreatePayload(options);
    });

program
    .command('create-checkout')
    .description('Create a embedded checkout or URL')
    .option(
        '-c, --currency <code>',
        'Set checkout currency',
        config.currency || 'EUR'
    )
    .option('-h, --hosted', 'Hosted mode provides checkout link')
    .option(
        '-m, --mhcd',
        'Hides address fields in checkout',
        config.mhcd || false
    )
    .option('--no-mhcd', 'Displays address fields in checkout')
    .option(
        '--consumer',
        'Automatically adds consumer object',
        config.consumer || false
    )
    .option('--no-consumer', 'Automatically removes consumer object')
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
    .option(
        '--charge',
        'Charge payment automatically if reserved',
        config.charge || false
    )
    .option(
        '--lang <string>',
        'Set checkout language',
        config.checkoutLanguage || 'en-GB'
    )
    .option('--prod-secret-key <string>', 'Your production secret API key')
    .option('--prod-checkout-key <string>', 'Your production checkout key')
    .option('--test-secret-key <string>', 'Your test secret API key')
    .option('--test-checkout-key <string>', 'Your test checkout key')
    .option('-p, --production', 'Use production environment')
    .option('-v, --verbose', 'Output additional information')
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
        options.production = options.production
            ? options.production
            : !config.isTest;
        options.darkTheme = config.darkTheme;
        options.lightTheme = config.lightTheme;
        options.verbose = options.verbose ? options.verbose : config.verbose;
        runCreateCheckout(options);
    });

program
    .command('create-completed-checkout')
    .argument('[number]', 'Number of checkouts')
    .description('Create completed checkout in test environment')
    .option(
        '-c, --currency <code>',
        'Set checkout currency',
        config.currency || 'EUR'
    )
    .option('-h, --hosted', 'Hosted mode provides checkout link')
    .option(
        '-m, --mhcd',
        'Hides address fields in checkout',
        config.mhcd || false
    )
    .option('--no-mhcd', 'Displays address fields in checkout')
    .option(
        '--consumer',
        'Automatically adds consumer object',
        config.consumer || false
    )
    .option('--no-consumer', 'Automatically removes consumer object')
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
    .option(
        '--charge',
        'Charge payment automatically if reserved',
        config.charge || false
    )
    .option('-u, --unscheduled', 'Create unscheduled subscription')
    .option('-S, --scheduled', 'Create scheduled subscription')
    .option('--test-secret-key <key>', 'Your test secret API key')
    .option('--test-checkout-key <key>', 'Your test checkout API key')
    .option('-s, --save', 'Save table to CSV-file', config.saveToCSV)
    .option('-t, --table', 'Display results in a table')
    .option('-v, --verbose', 'Output additional information', config.verbose)
    .action((arg, options) => {
        options.testSecretKey = options.testSecretKey
            ? options.testSecretKey
            : config.testSecretKey;
        options.testCheckoutKey = options.testCheckoutKey
            ? options.testCheckoutKey
            : config.testCheckoutKey;
        options.save = config.saveToCSV || options.save;
        options.verbose = options.verbose ? options.verbose : config.verbose;
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
    .option('-f, --file <path>', 'Path to file containing list of payment ID')
    .option('--prod-secret-key <key>', 'Your production secret API key')
    .option('--test-secret-key <key>', 'Your test secret API key')
    .option('-p, --production', 'Use production environment', !config.isTest)
    .option('-s, --save', 'Save table to CSV-file', config.saveToCSV)
    .option('-t, --table', 'Display results in a table')
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
            : !config.isTest;
        options.save = options.save ? options.save : config.saveToCSV;
        runTerminatePayment(options, arg);
    });
program.parse(process.argv);
