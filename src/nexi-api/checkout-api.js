import axios from "axios";

export async function checkoutPay(paymentId, expiryYear, expiryMonth, testCardNumber) {
	const url = 'https://test.checkout.dibspayment.eu/api/v1/pay'
	try {
		const response = await axios.post(url, {
			"type": "card",
			"paymentType": {
				"card": {
					"cardNumber": `${testCardNumber}`,
					"cardVerificationCode": "125",
					"expiryMonth": `${expiryMonth}`,
					"expiryYear": `${expiryYear}`,
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
			console.error(`Error posting ${url}\n` + error);
		}
	}
}

export async function pares(paymentId, ThreedsSessionId) {

	const url = 'https://test.checkout.dibspayment.eu/api/v1/callback/pares'
	try {
		const response = await axios.post(url, {
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
