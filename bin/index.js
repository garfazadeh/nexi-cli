#!/usr/bin/env node
import chalk from 'chalk';
import { program } from 'commander';
import dotenv from 'dotenv';

import runCreateCheckout from '../src/commands/create-checkout.js';
import runCreateCompletedCheckout from '../src/commands/create-completed-checkout.js';
import runCreateSubscriptions from '../src/commands/create-subscriptions.js';
import runFetchPayment from '../src/commands/fetch-payment.js';

// read environment variables
dotenv.config();

function parseBoolean(value) {
    if (value === null || value === undefined) {
        return false; // or any default value you prefer
    }
    return value === 'true';
}

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
    .option(
        '-p, --production',
        'Use production environment',
        !parseBoolean(process.env.IS_TEST)
    )
    .option(
        '-s, --save',
        'Save table to CSV-file',
        parseBoolean(process.env.SAVE_TO_CSV)
    )
    .action((arg, options) => {
        if (!arg && !options.file) {
            console.error(
                'Error: Either the argument or the file option must be set.'
            );
            process.exit(1);
        }
        options.prodSecretKey =
            process.env.PROD_SECRET_KEY || options.prodSecretKey;
        options.testSecretKey =
            process.env.TEST_SECRET_KEY || options.testSecretKey;
        options.production =
            !parseBoolean(process.env.IS_TEST) || options.production;
        options.save = parseBoolean(process.env.SAVE_TO_CSV) || options.save;
        runFetchPayment(options, arg);
    });

program
    .command('create-checkout')
    .description('Create a checkout URL')
    .option('-c, --currency <string>', 'Set checkout currency', 'SEK')
    .option('-l, locale <string>', 'Set consumer locale', 'sv')
    .option(
        '--lang <string>',
        'Set checkout language',
        process.env.CHECKOUT_LANGUAGE || 'en-GB'
    )
    .option('--charge', 'Charge payment automatically if reserved', false)
    .option('--prod-secret-key <string>', 'Your production secret API key')
    .option('--test-secret-key <string>', 'Your test secret API key')
    .option(
        '-p, --production',
        'Use production environment',
        !parseBoolean(process.env.IS_TEST)
    )
    .action(options => {
        options.prodSecretKey =
            process.env.PROD_SECRET_KEY || options.prodSecretKey;
        options.testSecretKey =
            process.env.TEST_SECRET_KEY || options.testSecretKey;
        options.production =
            !parseBoolean(process.env.IS_TEST) || options.production;
        runCreateCheckout(options);
    });

program
    .command('create-completed-checkout')
    .argument('[number]', 'Number of checkouts')
    .description('Create completed checkout in test')
    .option('-c, --currency <string>', 'Set currency', 'SEK')
    .option('-l, locale <string>', 'Set consumer locale', 'sv')
    .option('--charge', 'Charge payment automatically if reserved', false)
    .requiredOption(
        '--test-secret-key <key>',
        'Your test secret API key',
        process.env.TEST_SECRET_KEY || ''
    )
    .option(
        '-s, --save',
        'Save table to CSV-file',
        parseBoolean(process.env.SAVE_TO_CSV)
    )
    .action((arg, options) => {
        options.testSecretKey =
            process.env.TEST_SECRET_KEY || options.testSecretKey;
        options.production =
            !parseBoolean(process.env.IS_TEST) || options.production;
        options.save = parseBoolean(process.env.SAVE_TO_CSV) || options.save;
        runCreateCompletedCheckout(options, arg);
    });

program
    .command('create-subscriptions')
    .description('Create subscriptions in test')
    .argument('[number]', 'Number of checkouts')
    .option('-u, --unscheduled', 'Create unscheduled subscription')
    .option('-c, --currency <currency>', 'Set subscription currency', 'SEK')
    .option('-l, locale <locale>', 'Set consumer locale', 'sv')
    .option('--test-secret-key <key>', 'Your test secret API key')
    .option(
        '-s, --save',
        'Save table to CSV-file',
        parseBoolean(process.env.SAVE_TO_CSV)
    )
    .action((arg, options) => {
        options.testSecretKey =
            process.env.TEST_SECRET_KEY || options.testSecretKey;
        options.production =
            !parseBoolean(process.env.IS_TEST) || options.production;
        options.save = parseBoolean(process.env.SAVE_TO_CSV) || options.save;
        runCreateSubscriptions(options, arg);
    });

program.parse(process.argv);
