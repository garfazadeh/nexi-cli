import { checkoutPay, pares } from '../nexi-api/checkout-api.js';

const testCardNumber = [
    '4268270087374847',
    '4925000000000079',
    '5213199803453465',
    '5544330000000235',
];

// check date for CC expiry
const currentDate = new Date();

function generateCardExpiry(currentDate) {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    let expiryYear, expiryMonth;
    expiryYear = Math.floor(currentYear - 2000 + Math.random() * 5);
    if (expiryYear === currentYear - 2000) {
        expiryMonth =
            currentMonth + Math.floor(Math.random() * (12 - currentMonth));
    } else {
        expiryMonth = 1 + Math.floor(Math.random() * 11);
    }
    if (expiryMonth <= 9) {
        expiryMonth = expiryMonth.toString().padStart(2, '0');
    }

    return { expiryYear, expiryMonth };
}

export default async function finalizeCheckout(paymentId, amount) {
    // get expiry date for card
    const { expiryYear, expiryMonth } = generateCardExpiry(currentDate);

    const redirectUrl = await checkoutPay(
        paymentId,
        amount,
        expiryYear,
        expiryMonth,
        testCardNumber[Math.floor(Math.random() * testCardNumber.length)]
    );

    // extract session id from redirect URL
    const ThreedsSessionId = redirectUrl.split('/')[4];

    // simulate 3DS callback
    const paidPayment = await pares(paymentId, ThreedsSessionId);

    return paidPayment;
}
