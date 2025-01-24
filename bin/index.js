#!/usr/bin/env node
import { program } from 'commander';
import dotenv from 'dotenv'
import runFetchPayment from "../src/commands/fetch-payment.js";
import runCreateCheckout from "../src/commands/create-checkout.js";
import runCreateSubscriptions from "../src/commands/create-subscriptions.js";
import chalk from 'chalk';

dotenv.config()

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
	.option('-p, --production', 'Use production environment', process.env.IS_TEST === "false")
	.option('-s, --save', 'Save table to CSV-file', process.env.SAVE_TO_CSV === "true")
	.action((options) => {
		options.prodSecretKey = process.env.PROD_SECRET_KEY || options.prodSecretKey
		options.testSecretKey = process.env.TEST_SECRET_KEY || options.testSecretKey
		options.production = process.env.IS_TEST === "false" || options.production
		options.save = process.env.SAVE_TO_CSV === "true" || options.save
		runFetchPayment(options);
	});

program
	.command('create-checkout')
	.description('Create a checkout URL')
	.option('--prod-secret-key <key>', 'Your production secret API key')
	.option('--test-secret-key <key>', 'Your test secret API key')
	.option('--prod-checkout-key <key>', 'Your production checkout key')
	.option('--test-checkout-key <key>', 'Your test checkout key')
	.option('-p, --production', 'Use production environment', process.env.IS_TEST === "false")
	.option('-s, --save', 'Save table to CSV-file', process.env.SAVE_TO_CSV)
	.action((options) => {
		options.prodSecretKey = process.env.PROD_SECRET_KEY || options.prodSecretKey
		options.testSecretKey = process.env.TEST_SECRET_KEY || options.testSecretKey
		options.prodCheckoutKey = process.env.PROD_CHECKOUT_KEY || options.prodCheckoutKey
		options.testCheckoutKey = process.env.TEST_CHECKOUT_KEY || options.testCheckoutKey
		options.production = process.env.IS_TEST === "false" || options.production
		options.save = process.env.SAVE_TO_CSV === "true" || options.save
		runCreateCheckout(options);
	});


program
	.command('create-subscriptions <amount>')
	.description('Create subscriptions')
	.option('-u, --unscheduled', 'Create unscheduled subscription ID')
	.option('--test-secret-key <key>', 'Your test secret API key')
	.option('-p, --production', 'Use production environment', process.env.IS_TEST === "false")
	.option('-s, --save', 'Save table to CSV-file', process.env.SAVE_TO_CSV)
	.action((amount, options) => {
		options.testSecretKey = process.env.TEST_SECRET_KEY || options.testSecretKey
		options.production = process.env.IS_TEST === "false" || options.production
		options.save = process.env.SAVE_TO_CSV === "true" || options.save
		runCreateSubscriptions(amount, options);
	});

program.parse(process.argv);
