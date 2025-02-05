#!/usr/bin/env node
import chalk from 'chalk';
import { program } from 'commander';

import configPromise from '../src/utils/config.js';

// Read and use the config file
const config = await configPromise;

function validateTarget(value) {
    const allowedValues = ['da', 'de', 'de_AT', 'en', 'nb_NO', 'sv'];
    if (!allowedValues.includes(value)) {
        throw new Error(`Invalid target value. Allowed values are: ${allowedValues.join(', ')}`);
    }
    return value;
}

function applyConfigDefaults(options, config) {
    // Iterate over the keys in config
    for (const key in config) {
        if (Object.prototype.hasOwnProperty.call(config, key)) {
            // If the option is not provided (undefined or null), use the value from config
            if (options[key] === undefined || options[key] === null) {
                options[key] = config[key];
            }
        }
    }

    return options;
}

function addCommonOptions(cmd) {
    return cmd
        .option('-e, --export', 'Export table to CSV-file', config.export)
        .option('--no-export')
        .option('-t, --table', 'Display results in a table')
        .option('--no-table')
        .option('-v, --verbose', 'Output additional information', config.verbose)
        .option('--no-verbose');
}

function addSecretKeysOptions(cmd) {
    return cmd
        .option('-p, --production', 'Use production environment', config.production || false)
        .option('--no-production')
        .option('--prod-secret-key <string>', 'Your production secret API key')
        .option('--test-secret-key <string>', 'Your test secret API key');
}

function addCreatePaymentOptions(cmd) {
    return cmd
        .option('-c, --currency <code>', 'Set checkout currency', config.currency || 'EUR')
        .option('-C, --charge', 'Charge payment automatically if reserved', config.charge || false)
        .option('--no-charge')
        .option('-o, --order-value <amount>', 'Set the total order value of all order items')
        .option('-s, --scheduled', 'Create scheduled subscription')
        .option('-u, --unscheduled', 'Create unscheduled subscription')
        .option('--consumer', 'Automatically adds consumer object', config.consumer || false)
        .option('--no-consumer')
        .option(
            '--consumer-locale <locale>',
            "Available locales: 'da', 'de', 'de_AT', 'en', 'nb_NO', 'sv'",
            config.consumerLocale || 'en_GB'
        )
        .option('--consumer-type <type>', 'Set type of consumer generated', config.consumerType || 'B2C')
        .option('--default-consumer-type <type>', 'Set default consumer type')
        .option('--supported-consumer-type <types>', 'Set supported consumer types', value => value.split(','))
        .option('-H, --hosted', 'Hosted mode provides checkout link')
        .option('-m, --mhcd', 'Hides address fields in checkout', config.mhcd || false)
        .option('--no-mhcd')
        .option('--shipping-countries <codes>', 'Specify enabled shipping countries', value => value.split(','))
        .option('--country-code <code>', 'Set default country')
        .option('--public-device', 'Prevents cookies from being read or saved')
        .option('--port', 'Server port', config.port)
        .option('--webhook-events <events>', 'Comma-separated list of webhook events to include');
}

program
    .name('nexi-cli')
    .description(
        chalk.bold.blue('Nexi Checkout CLI') + chalk.dim('\nA CLI tool to interact with Nexi Checkout Payment API')
    )
    .version('0.9.3');

const fetch = program.command('fetch').description('fetch information');
const create = program.command('create').description('create payment');
const charge = program.command('charge').description('charge payment');
const refund = program.command('refund').description('refund charges or payments');
/* 
const update = program.command('update').description('Update payment');
const cancel = program
    .command('cancel')
    .description('Cancel reservation or refund'); 
*/
const terminate = program.command('terminate').description('terminate payment');
/* const verify = program.command('verify').description('Verify subscription'); */
const init = program.command('init').description('initiate checkout');
const mock = program.command('mock').description('create mock payment');

addCommonOptions(addSecretKeysOptions(fetch.command('payment')))
    .argument('[paymentId]', 'Payment ID')
    .description('Fetch payment information individually or in bulk')
    .option('-f, --file <path>', 'Path to file containing list of payment ID')
    .action(async (arg, options) => {
        if (!arg && !options.file) {
            console.error('Error: Either the argument or the file option must be set.');
            process.exit(1);
        }
        const mergedOptions = applyConfigDefaults(options, config);
        const { default: runFetchPayment } = await import('../src/commands/fetchPayment.js');
        runFetchPayment(mergedOptions, arg);
    });

addCommonOptions(addCreatePaymentOptions(create.command('payment')))
    .description('Creates payment')
    .option('-d, --dryrun', 'Outputs generated request without sending it')
    .action(async options => {
        const mergedOptions = applyConfigDefaults(options, config);
        try {
            validateTarget(mergedOptions.consumerLocale);
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            console.error('Not a valid consumer locale');
            process.exit(1);
        }
        const { default: runCreatePayment } = await import('../src/commands/createPayment.js');
        runCreatePayment(mergedOptions);
    });

addCommonOptions(charge.command('payment'))
    .description('Charge a reserved payment')
    .argument('[paymentId]', 'Payment ID')
    .option('-d, --dryrun', 'Outputs generated request without sending it')
    .option('-o, --order-value <amount>', 'Set the total order value of all order items')
    .action(async (arg, options) => {
        const mergedOptions = applyConfigDefaults(options, config);
        const { default: runChargePayment } = await import('../src/commands/chargePayment.js');
        runChargePayment(mergedOptions, arg);
    });

addCommonOptions(refund.command('charge'))
    .description('Refund a charge')
    .argument('[chargeId]', 'Charge ID')
    .option('-d, --dryrun', 'Outputs generated request without sending it')
    .option('-o, --order-value <amount>', 'Set the total order value of all order items')
    .action(async (arg, options) => {
        const mergedOptions = applyConfigDefaults(options, config);
        const { default: runChargePayment } = await import('../src/commands/refundCharge.js');
        runChargePayment(mergedOptions, arg);
    });

addCommonOptions(refund.command('payment'))
    .description('Refund a charged payment')
    .argument('[paymentId]', 'Payment ID')
    .option('-d, --dryrun', 'Outputs generated request without sending it')
    .option('-o, --order-value <amount>', 'Set the total order value of all order items')
    .action(async (arg, options) => {
        const mergedOptions = applyConfigDefaults(options, config);
        const { default: runChargePayment } = await import('../src/commands/refundPayment.js');
        runChargePayment(mergedOptions, arg);
    });

addSecretKeysOptions(addCommonOptions(addCreatePaymentOptions(init.command('checkout'))))
    .description('Create a embedded checkout or URL')
    .option('--test-checkout-key <string>', 'Your test checkout key')
    .option('--prod-checkout-key <string>', 'Your production checkout key')
    .option('-f, --finalized-event', 'Sends payment-order-finalized as false')
    .option('--lang <string>', 'Set checkout language', config.checkoutLanguage || 'en-GB')
    .action(async options => {
        const mergedOptions = applyConfigDefaults(options, config);
        const { default: runInitCheckout } = await import('../src/commands/initCheckout.js');
        runInitCheckout(mergedOptions);
    });

addSecretKeysOptions(addCommonOptions(addCreatePaymentOptions(mock.command('payment'))))
    .argument('[number]', 'Number of completed payments')
    .description('Create mock payments for testing purposes in test environment')
    .action(async (arg, options) => {
        const mergedOptions = applyConfigDefaults(options, config);
        if (mergedOptions.unscheduled && mergedOptions.scheduled) {
            console.error('Error: Can not create both scheduled and unscheduled subscription for same payment ID.');
            process.exit(1);
        } else {
            const { default: runMockPayment } = await import('../src/commands/mockPayment.js');
            runMockPayment(mergedOptions, arg);
        }
    });

addCommonOptions(addSecretKeysOptions(terminate.command('payment')))
    .argument('[paymentId]', 'Payment ID')
    .description('Terminate payment information individually or in bulk')
    .option('-f, --file <path>', 'Path to file containing list of payment ID')
    .action(async (arg, options) => {
        if (!arg && !options.file) {
            console.error('Error: Either the argument or the file option must be set.');
            process.exit(1);
        }
        const mergedOptions = applyConfigDefaults(options, config);
        const { runTerminatePayment } = await import('../src/commands/terminatePayment.js');
        runTerminatePayment(mergedOptions, arg);
    });

program.parse(process.argv);
