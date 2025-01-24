import axios from 'axios';
import chalk from 'chalk';

const log = console.log;

const payload = {
	"order": {
		"reference": "order-1",
		"amount": 0,
		"currency": "SEK",
		"items": [
			{
				"reference": "sneaker-1",
				"name": "Sneakers",
				"quantity": 1,
				"unit": "pcs",
				"unitPrice": 0,
				"grossTotalAmount": 0,
				"netTotalAmount": 0
			}
		]
	},
	"checkout": {
		"integrationType": "HostedPaymentPage",
		"returnUrl": "https://www.test.com/success",
		"cancelUrl": "https://www.test.com/cancel",
		"termsUrl": "https://www.test.com/terms",
		"merchantHandlesConsumerData": false
	},
	"unscheduledSubscription": {
		"create": true
	}
};


async function createPayment(payload, options) {
	const url = options.production
		? "https://api.dibspayment.eu/v1/payments"
		: "https://test.api.dibspayment.eu/v1/payments";
	const key = options.production
		? options.prodSecretKey
		: options.testSecretKey;
	try {
		const response = await axios.post(url, payload, {
			headers: {
				Authorization: `${key}`,
			},
		});
		return response;
	} catch (error) {
		if (error.response && error.response.status === 401) {
			console.error("Error: The supplied API key is incorrect.");
			process.exit(1);
		} else {
			console.error(`Error fetching ${url}:`, error);
		}
	}
}

export default function runCreateCheckout(options) {
	createPayment(payload, options)
		.then(response => {
			log(chalk.blue.bold('Payment ID: '));
			log(chalk.green(response.data.paymentId));
			log(chalk.blue.bold('URL:'));
			log(chalk.green(response.data.hostedPaymentPageUrl))
		});
}