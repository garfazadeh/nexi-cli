import { retrievePayment, createPayment } from '../nexi-api/payment-api.js'
import { checkoutPay, pares } from '../nexi-api/checkout-api.js'
import writeCsv from '../utils/write-csv.js';
import updateLoader from '../utils/loader.js'

const testCardNumber = ['4268270087374847', '4925000000000079', '4925000000000061', '5213199803453465', '5544330000000235']

const payload = {
	"order": {
		"items": [
			{
				"reference": "subscription",
				"name": "Subscription",
				"quantity": 1,
				"unit": "pcs",
				"unitPrice": 0,
				"taxRate": 0,
				"taxAmount": 0,
				"netTotalAmount": 0,
				"grossTotalAmount": 0
			}
		],
		"amount": 0,
		"currency": "SEK",
		"reference": "subscription"
	},
	"checkout": {
		"termsUrl": "https://shop.easy.nets.eu/terms",
		"integrationType": "EmbeddedCheckout",
		"merchantHandlesConsumerData": true,
		"url": "https://shop.easy.nets.eu/checkout"
	},
	"subscription": {
		"endDate": "2099-12-31T23:59:59.999Z",
		"interval": 0
	}
}

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}


function generateCardExpiry(currentDate) {
	const currentYear = currentDate.getFullYear();
	const currentMonth = currentDate.getMonth();
	let expiryYear, expiryMonth;
	expiryYear = Math.floor(currentYear - 2000 + Math.random() * 5)
	if (expiryYear === currentYear - 2000) {
		expiryMonth = currentMonth + Math.floor(Math.random() * (12 - currentMonth))
	} else {
		expiryMonth = 1 + Math.floor(Math.random() * 11)
	}
	if (expiryMonth <= 9) {
		expiryMonth = expiryMonth.toString().padStart(2, '0');
	}

	return { expiryYear, expiryMonth }
}



export default async function runCreateSubscriptions(amount, options, type) {

	// check date for CC expiry
	const currentDate = new Date();

	// create array for responses
	const responses = [];
	const setDelay = (1000 / process.env.REQUEST_PER_SECOND);

	// initialize loader
	updateLoader(0, amount, "Creating subscriptions");
	for (let i = 0; i < amount; i++) {
		try {
			// choose a random working test card
			const randomIndex = Math.floor(Math.random() * testCardNumber.length);

			// get expiry date for card
			const { expiryYear, expiryMonth } = generateCardExpiry(currentDate);

			// create payment
			const paymentId = await createPayment(options, payload);

			// send card details to checkout api
			const redirectUrl = await checkoutPay(paymentId, expiryYear, expiryMonth, testCardNumber[randomIndex]);

			// extract session id from redirect URL
			const ThreedsSessionId = redirectUrl.split('/')[4];

			// simulate 3DS callback
			const paidPayment = await pares(paymentId, ThreedsSessionId);

			// fetch payment and sore
			const response = await retrievePayment(paymentId, options);
			responses.push({
				subscriptionId: response.data.payment.subscription.id,
				currency: response.data.payment.orderDetails.currency,
				paymentType: response.data.payment.paymentDetails.paymentType,
				paymentMethod: response.data.payment.paymentDetails.paymentMethod,
				maskedPan: response.data.payment.paymentDetails.cardDetails.maskedPan,
				expiryDate: response.data.payment.paymentDetails.cardDetails.expiryDate
			});
			updateLoader(i + 1, amount, "Creating subscriptions");
			await delay(setDelay);
		} catch (error) {
			// Handle any errors that may be thrown during the process
			console.error('Payment processing failed:', error);
		}
	}
	console.log('')
	console.table(responses);

	// create fields for csv file
	const fields = [
		{ label: 'Subscription ID', value: 'subscriptionId' },
		{ label: 'Currency', value: 'currency' },
		{ label: 'Payment Type', value: 'paymentType' },
		{ label: 'Payment Method', value: 'paymentMethod' },
		{ label: 'Masked PAN', value: 'maskedPan' },
		{ label: 'Card Expiry date', value: 'expiryDate' },
	];
	if (options.save) {
		writeCsv('subscription_ids.csv', responses, fields)
	}
};