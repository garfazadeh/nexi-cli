#!/usr/bin/env node
import chalk from 'chalk';
import { program } from 'commander';
import e from 'express';

import runCreateCheckout from '../src/commands/createCheckout.js';
import runCreateCompletedCheckout from '../src/commands/createCompletedCheckout.js';
import runCreatePayload from '../src/commands/createPayload.js';
import runCreateSubscriptions from '../src/commands/createSubscriptions.js';
import runFetchPayment from '../src/commands/fetchPayment.js';
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
    .command('fetch-payment')
    .argument('[paymentId]', 'Payment ID')
    .description('Fetch payment information individually or in bulk')
    .option('-f, --file <path>', 'Path to file containing list of payment ID')
    .option('--prod-secret-key <key>', 'Your production secret API key')
    .option('--test-secret-key <key>', 'Your test secret API key')
    .option('-p, --production', 'Use production environment', !config.isTest)
    .option('-s, --save', 'Save table to CSV-file', config.saveToCSV)
    .action((arg, options) => {
        if (!arg && !options.file) {
            console.error(
                'Error: Either the argument or the file option must be set.'
            );
            process.exit(1);
        }
        options.prodSecretKey = config.prodSecretKey || options.prodSecretKey;
        options.testSecretKey = config.testSecretKey || options.testSecretKey;
        options.production = !config.isTest || options.production;
        options.save = config.saveToCSV || options.save;
        runFetchPayment(options, arg);
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
    .option('--test-secret-key <string>', 'Your test secret API key')
    .option('-p, --production', 'Use production environment', !config.isTest)
    .action(options => {
        options.prodSecretKey = config.prodSecretKey || options.prodSecretKey;
        options.testSecretKey = config.testSecretKey || options.testSecretKey;
        options.production = !config.isTest || options.production;
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
    .requiredOption(
        '--test-secret-key <key>',
        'Your test secret API key',
        config.testSecretKey || ''
    )
    .option('-s, --save', 'Save table to CSV-file', config.saveToCSV)
    .action((arg, options) => {
        options.testSecretKey = config.testSecretKey || options.testSecretKey;
        options.production = !config.isTest || options.production;
        options.save = config.saveToCSV || options.save;
        runCreateCompletedCheckout(options, arg);
    });

program
    .command('create-subscriptions')
    .description('Create subscriptions in test environment')
    .argument('[number]', 'Number of checkouts')
    .option('-u, --unscheduled', 'Create unscheduled subscription')
    .option('--scheduled', 'Create scheduled subscription')
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
    .option('--test-secret-key <key>', 'Your test secret API key')
    .option('-s, --save', 'Save table to CSV-file', config.saveToCSV)
    .action((arg, options) => {
        options.testSecretKey = config.testSecretKey || options.testSecretKey;
        options.save = config.saveToCSV || options.save;
        if (options.unscheduled || options.scheduled) {
            runCreateSubscriptions(options, arg);
        } else {
            console.error(
                'Error: Either the scheduled or unscheduled subscription must be true.'
            );
            process.exit(1);
        }
    });

program.parse(process.argv);
