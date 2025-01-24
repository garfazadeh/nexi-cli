#!/usr/bin/env node
import axios from 'axios';
import Ajv from 'ajv';
import { readFileSync, writeFile } from 'fs';
import { Parser } from 'json2csv';
import { Command } from 'commander';

// set limits to throttle requess
const maxRequestsPerSecond = 5
const setDelay = (1000 / maxRequestsPerSecond)

// set up commander to handle arguments
const program = new Command();

program
	.version('0.9.0')
	.description('A simple CLI tool to interact with Nexi Checkout Payment API')
	.requiredOption('-i, --input <path>', 'Specify input file containing Payment ID(s)')
	.requiredOption('-k, --apiKey <type>', 'Your secret API Key')
	.option('-t, --test', 'Use test environment')
	.option('-s, --save', 'Save table to CSV-file')
	.parse(process.argv);

const options = program.opts();

// define AJV schema to validate input
const argumentSchema = {
	type: "object",
	properties: {
		apiKey: {
			type: "string",
			pattern: "^[a-fA-F0-9]{32}$"
		}
	},
	required: ["apiKey"]
};

function validateArguments(options) {
	const ajv = new Ajv();
	const validateArgument = ajv.compile(argumentSchema);
	const argsValid = validateArgument(options);
	if (!argsValid) {
		console.error('Validation failed:', validateArgument.errors);
		process.exit(1);
	}
}

function validateInput(input) {
	const inputSchema = { type: "string", pattern: "^[a-fA-F0-9]{32}$" };
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

async function fetchPayments(input, test, key) {
	const endpoint = test
		? "https://test.api.dibspayment.eu/v1/payments/"
		: "https://api.dibspayment.eu/v1/payments/";
	const responses = [];

	for (let i = 0; i < input.length; i++) {
		const url = endpoint + input[i];
		await delay(setDelay);
		try {
			const response = await axios.get(url, {
				headers: {
					Authorization: `${key}`,
				},
			});
			if (response.status === 401) {
				console.error("Error: The supplied API key is incorrect.");
				process.exit(1);
			}
			responses.push(response.data);
			updateLoader(i + 1, input.length);
		} catch (error) {
			if (error.response && error.response.status === 401) {
				console.error("Error: The supplied API key is incorrect.");
				process.exit(1);
			} else {
				console.error(`Error fetching ${url}:`, error);
			}
		}
	}

	// ensure each response has id, reservedAmount and chargedAmount
	const formattedResponse = responses.map((response) => {
		const { payment } = response;
		const { orderDetails, paymentDetails, summary } = payment;

		const formatAmount = (amount) =>
			amount && amount !== 0 ? (amount / 100).toFixed(2) : 0;

		return {
			created: payment.created,
			paymentId: payment.paymentId,
			reference: orderDetails.reference,
			currency: orderDetails.currency,
			paymentType: paymentDetails.paymentType || '',
			paymentMethod: paymentDetails.paymentMethod || '',
			reservedAmount: formatAmount(summary.reservedAmount) || '',
			chargedAmount: formatAmount(summary.chargedAmount) || '',
			refundedAmount: formatAmount(summary.refundedAmount) || '',
			cancelledAmount: formatAmount(summary.cancelledAmount) || '',
		};
	});

	return formattedResponse;
}

function writeCsv(filename, content) {
	const fields = [
		{ label: 'Created', value: 'created' },
		{ label: 'Payment ID', value: 'paymentId' },
		{ label: 'Reference', value: 'reference' },
		{ label: 'Currency', value: 'currency' },
		{ label: 'Payment Type', value: 'paymentType' },
		{ label: 'Payment Method', value: 'paymentMethod' },
		{ label: 'Reserved Amount', value: 'reservedAmount' },
		{ label: 'Charged Amount', value: 'chargedAmount' },
		{ label: 'Refunded Amount', value: 'refundedAmount' },
		{ label: 'Cancelled Amount', value: 'cancelledAmount' },
	];

	// Write to CSV file
	// Convert responses to CSV format using the defined fields
	const json2csvParser = new Parser({ fields });
	const csv = json2csvParser.parse(content);
	const finalContent = `sep=,\n${csv}`;
	writeFile(filename, finalContent, 'utf8', (err) => {
		if (err) {
			console.error('Error writing to CSV file:', err);
		} else {
			console.log('Responses saved to responses.csv');
		}
	});
}

function updateLoader(current, total) {
	const length = 50; // length of the loader bar
	const progress = Math.floor((current / total) * length);
	const loader = `Fetching payments: [${"#".repeat(progress)}${"-".repeat(
		length - progress
	)}] ${current}/${total}`;
	process.stdout.write(`\r${loader}`);
}

function main() {
	validateArguments(options);
	const fileContent = readFileSync(options.input, 'utf8');
	const paymentIds = fileContent.split('\n').map(line => line.trim());
	validateInput(paymentIds)
	fetchPayments(
		paymentIds,
		options.test,
		options.apiKey
	).then(response => {
		console.log('\n')
		console.table(response);
		if (options.save) { writeCsv('responses.csv', response) }
	})
}

main();