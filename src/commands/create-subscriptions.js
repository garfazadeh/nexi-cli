import axios from 'axios';
import updateLoader from '../utils/loader.js'

const testCardNo = ['4268270087374847', '4925000000000079', '4925000000000061', '5213199803453465', '5544330000000235']

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

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function generateExpiry() {
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

async function payPayment(paymentId) {
	const randomIndex = Math.floor(Math.random() * testCardNo.length);
	const { expiryYear: expY, expiryMonth: expM } = generateExpiry();
	try {
		const response = await axios.post('https://test.checkout.dibspayment.eu/api/v1/pay', {
			"type": "card",
			"paymentType": {
				"card": {
					"cardNumber": `${testCardNo[randomIndex]}`,
					"cardVerificationCode": "125",
					"expiryMonth": `${expM}`,
					"expiryYear": `${expY}`,
					"cardholderName": "aaa"
				}
			},
			"acceptedTermsAndConditions": true,
			"amountConfirmedByConsumer": 0,
			"consumerCheckedSaveNewPaymentMethod": false,
			"consumerHasConsentedToRememberingNewDevice": false,
			"consumerWantsToBeAnonymous": false
		}, {
			headers: {
				'Content-Type': 'application/json',
				'paymentId': `${paymentId}`,
				'CheckoutKey': `${process.env.PARES_CHECKOUT_KEY}`,
			},
		})
		return response.data.redirectUrl;
	} catch (error) {
		if (error.response && error.response.status === 401) {
			console.error("Error: The checkout key is incorrect.");
			console.log(error)
			process.exit(1);
		} else {
			console.error(`Error posting ${'https://test.checkout.dibspayment.eu/api/v1/pay'}:`, error);
		}
	}

}

async function pares(paymentId, ThreedsSessionId) {
	try {
		const response = await axios.post('https://test.checkout.dibspayment.eu/api/v1/callback/pares', {
			"AcsFormActionUrl": "https://3ds-acs.test.modirum.com/mdpayacs/creq",
			"AuthenticationStatus": "Y",
			"EnrollmentStatus": "Y",
			"Cavv": "xgQOljwoAAAAAAAAAAAAAAAAAAA=",
			"CavvAlgorithm": null,
			"Eci": "02",
			"ReferenceId": `${paymentId}`,
			"SessionId": `${ThreedsSessionId}`,
			"ThreeDsAvailable": true,
			"Xid": "G1RH7FDF+LeKxR0o5RjXLgSBXZk=",
			"DsTransId": "3b65f1c8-3976-5f2e-8000-000001c0f409",
			"MessageVersion": "2.2.0",
			"CardHolderInfo": null,
			"MessageExtension": null
		}, {
			headers: {
				'paymentId': `${paymentId}`,
				'CheckoutKey': `${process.env.PARES_CHECKOUT_KEY}`,
				'Content-Type': 'application/json',
				'x-api-key': `${process.env.X_API_KEY}`
			},
		})
		return response.data.redirectUrl;
	} catch (error) {
		if (error.response && error.response.status === 401) {
			console.error("Error: The checkout key is incorrect pares.");
			process.exit(1);
		} else {
			console.error(`Error fetching ${url}:`, error);
		}
	}

}

async function createPayment(options) {
	if (options.production === 'production') {
		console.error("Error: Can not create subscriptions in production environment");
		process.exit(1);
	}
	const url = "https://test.api.dibspayment.eu/v1/payments";
	const key = options.testSecretKey;
	try {
		const response = await axios.post(url, payload, {
			headers: {
				Authorization: `${key}`,
			},
		})
		return response.data.paymentId;
	} catch (error) {
		if (error.response && error.response.status === 401) {
			console.error("Error: The supplied API key is incorrect.");
			process.exit(1);
		} else {
			console.error(`Error fetching ${url}:`, error);
		}
	}
}

async function retrievePayment(paymentId, options) {
	const key = options.testSecretKey;
	const url = "https://test.api.dibspayment.eu/v1/payments/" + paymentId;
	try {
		const response = await axios.get(url, {
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

export default async function runCreateSubscriptions(amount, options, type) {
	const responses = [];
	updateLoader(0, amount, "Fetching payments");
	for (let i = 0; i < amount; i++) {
		const setDelay = (1000 / process.env.REQUEST_PER_SECOND);
		await delay(setDelay);
		const paymentId = await createPayment(options)
		const redirectUrl = await payPayment(paymentId)
		const ThreedsSessionId = redirectUrl.split('/')[4]
		const paidPayment = await pares(paymentId, ThreedsSessionId)
		const response = await retrievePayment(paymentId, options)
		responses.push({
			subscriptionId: response.data.payment.subscription.id,
			currency: response.data.payment.orderDetails.currency,
			paymentType: response.data.payment.paymentDetails.paymentType,
			paymentMethod: response.data.payment.paymentDetails.paymentMethod,
			maskedPan: response.data.payment.paymentDetails.cardDetails.maskedPan,
			expiryDate: response.data.payment.paymentDetails.cardDetails.expiryDate
		});
		updateLoader(i + 1, amount, "Fetching payments");
	}
	console.log('')
	console.table(responses);
};