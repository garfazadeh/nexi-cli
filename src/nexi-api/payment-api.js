import axios from "axios";

export async function retrievePayment(paymentId, options) {
	const endpoint = options.production
		? "https://api.dibspayment.eu/v1/payments/"
		: "https://test.api.dibspayment.eu/v1/payments/";
	const key = options.production
		? options.prodSecretKey
		: options.testSecretKey;
	const url = endpoint + paymentId;
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

export async function createPayment(options, payload) {
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