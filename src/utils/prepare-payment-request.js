import { Faker, faker, sv } from '@faker-js/faker';

function createRandomConsumer() {
    const customFaker = new Faker({
        locale: [sv],
    });
    const firstName = customFaker.person.firstName();
    const lastName = customFaker.person.lastName();

    return {
        reference: faker.string.alpha(10),
        email: faker.internet.email({
            firstName: firstName.toLowerCase(),
            lastName: lastName.toLowerCase(),
        }),
        shippingAddress: {
            addressLine1:
                customFaker.location.street() +
                ' ' +
                faker.string.numeric({ length: { min: 1, max: 2 } }),
            postalCode: faker.string.numeric({ length: { min: 5, max: 5 } }),
            city: customFaker.location.city(),
            country: 'SWE',
        },
        phoneNumber: {
            prefix: '+46',
            number: '7' + faker.string.numeric({ length: { min: 8, max: 8 } }),
        },
        privatePerson: {
            firstName: firstName,
            lastName: lastName,
        },
    };
}

function generateOrderItems(number) {
    const items = [];
    for (let i = 0; i < number; i++) {
        const productName = faker.commerce.productName();
        const amount = faker.commerce.price({ min: 300, max: 100000, dec: 0 });
        const quantity = Math.ceil(Math.random() * 6);
        items.push({
            reference: productName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, ''),
            name: productName,
            quantity: quantity,
            unit: 'pcs',
            unitPrice: amount,
            taxRate: 0,
            taxAmount: 0,
            netTotalAmount: quantity * amount,
            grossTotalAmount: quantity * amount,
        });
    }
    return items;
}

function createPaymentRequest(consumer, currency, charge, subscription) {
    // generate random amount of order items
    const items = generateOrderItems(Math.ceil(Math.random() * 6));
    // calculate total order value from items
    const totalValue = items
        .map(item => item.netTotalAmount)
        .reduce((sum, value) => sum + value, 0);

    const payload = {
        order: {
            items,
            amount: totalValue,
            currency: currency,
            reference: faker.string.hexadecimal({ length: 8, prefix: '#' }),
        },
        checkout: {
            termsUrl: 'https://shop.easy.nets.eu/terms',
            integrationType: 'EmbeddedCheckout',
            merchantHandlesConsumerData: true,
            url: 'https://shop.easy.nets.eu/checkout',
            charge,
            consumer,
        },
    };

    if (subscription === 1) {
        payload.subscription = {
            endDate: '2099-12-31T23:59:59.999Z',
            interval: 0,
        };
    }
    if (subscription === 2) {
        payload.unscheduledSubscription = {
            create: true,
        };
    }

    return payload;
}

export default function preparePaymentRequest(currency, charge, subscription) {
    const consumer = createRandomConsumer();
    const payload = createPaymentRequest(
        consumer,
        currency,
        charge,
        subscription
    );
    return payload;
}
