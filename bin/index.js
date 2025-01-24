#!/usr/bin/env node
import { program } from 'commander';
import dotenv from 'dotenv'
import runFetchPayment from "../src/commands/fetch-payment.js";
import runCreateCheckout from "../src/commands/create-checkout.js";
import runCreateSubscriptions from "../src/commands/create-subscriptions.js";
import chalk from 'chalk';

// read environment variables
dotenv.config()

function parseBoolean(value) {
	if (value === null || value === undefined) {
		return false; // or any default value you prefer
	}
	return value === 'true';
}


program
	.version('0.9.0')
	.description(chalk.bold.blue('Nexi Checkout CLI') + chalk.dim('\nA CLI tool to interact with Nexi Checkout Payment API'))

program
	.command('fetch-payment')
	.description('Fetch payments from a list of payment ID')
	.option('--pid <payment-id>', 'Fetch a payment ID')
	.option('-f, --file <path>', 'Path to file containing list of payment ID')
	.option('--prod-secret-key <key>', 'Your production secret API key')
	.option('--test-secret-key <key>', 'Your test secret API key')
	.option('-p, --production', 'Use production environment', !parseBoolean(process.env.IS_TEST))
	.option('-s, --save', 'Save table to CSV-file', parseBoolean(process.env.SAVE_TO_CSV))
	.action((options) => {
		options.prodSecretKey = process.env.PROD_SECRET_KEY || options.prodSecretKey
		options.testSecretKey = process.env.TEST_SECRET_KEY || options.testSecretKey
		options.production = !parseBoolean(process.env.IS_TEST) || options.production
		options.save = parseBoolean(process.env.SAVE_TO_CSV) || options.save
		runFetchPayment(options);
	});

program
	.command('create-checkout')
	.description('Create a checkout URL')
	.option('--prod-secret-key <key>', 'Your production secret API key')
	.option('--test-secret-key <key>', 'Your test secret API key')
	.option('--prod-checkout-key <key>', 'Your production checkout key')
	.option('--test-checkout-key <key>', 'Your test checkout key')
	.option('-p, --production', 'Use production environment', !parseBoolean(process.env.IS_TEST))
	.option('-s, --save', 'Save table to CSV-file', parseBoolean(process.env.SAVE_TO_CSV))
	.action((options) => {
		options.prodSecretKey = process.env.PROD_SECRET_KEY || options.prodSecretKey
		options.testSecretKey = process.env.TEST_SECRET_KEY || options.testSecretKey
		options.prodCheckoutKey = process.env.PROD_CHECKOUT_KEY || options.prodCheckoutKey
		options.testCheckoutKey = process.env.TEST_CHECKOUT_KEY || options.testCheckoutKey
		options.production = !parseBoolean(process.env.IS_TEST) || options.production
		options.save = parseBoolean(process.env.SAVE_TO_CSV) || options.save
		runCreateCheckout(options);
	});


program
	.command('create-subscriptions <amount>')
	.description('Create subscriptions in test')
	.option('-u, --unscheduled', 'Create unscheduled subscription ID')
	.option('--test-secret-key <key>', 'Your test secret API key')
	.option('-p, --production', 'Use production environment', !parseBoolean(process.env.IS_TEST))
	.option('-s, --save', 'Save table to CSV-file', parseBoolean(process.env.SAVE_TO_CSV))
	.action((amount, options) => {
		options.testSecretKey = process.env.TEST_SECRET_KEY || options.testSecretKey
		options.production = !parseBoolean(process.env.IS_TEST) || options.production
		options.save = parseBoolean(process.env.SAVE_TO_CSV) || options.save
		if (options.production === 'production') {
			console.error("Error: Can not create subscriptions in production environment");
			process.exit(1);
		} else {
			runCreateSubscriptions(amount, options);
		}
	});

program.parse(process.argv);
