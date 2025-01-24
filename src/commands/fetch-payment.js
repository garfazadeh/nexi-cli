import Ajv from 'ajv';
import { readFileSync } from 'fs';
import { retrievePayment } from '../nexi-api/payment-api.js'
import writeCsv from '../utils/write-csv.js';
import updateLoader from '../utils/loader.js'

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

async function processList(paymentIds, options) {
	// validate the array to make sure the format is correct
	validateInput(paymentIds)

	const responses = [];
	const setDelay = (1000 / process.env.REQUEST_PER_SECOND)
	for (let i = 0; i < paymentIds.length; i++) {
		const response = await retrievePayment(paymentIds[i], options)
		responses.push(response.data);
		updateLoader(i + 1, paymentIds.length, "Fetching payments");
		await delay(setDelay);
	}
	return responses;
}

export default async function runFetchPayment(options) {
	if (options.file) {
		// read file containing payment ID
		const fileContent = readFileSync(options.file, 'utf8');
		const paymentIds = fileContent.split('\n').map(line => line.trim());

		// process list of payment ID
		const responses = await processList(paymentIds, options)

		// format the response object to a flat structure
		const formattedContent = await responses.map((response) => {
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
		console.log('\n')
		console.table(formattedContent);

		// create fields for csv file
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

		if (options.save) { writeCsv('responses.csv', formattedContent, fields) }

	}
	if (options.pid) {
		retrievePayment(options.pid, options)
			.then(response => {
				console.log(response.data);
			})
	}
};