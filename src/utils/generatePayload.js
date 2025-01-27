import { Faker, faker, sv } from '@faker-js/faker';

import configPromise from './config.js';

const config = await configPromise;

const generateSwedishPhoneNumber = () => {
    const phoneFormats = [
        '020######',
        '8######',
        '73#######',
        '72#######',
        '76#######',
        '70#######',
    ];

    const randomFormat =
        phoneFormats[Math.floor(Math.random() * phoneFormats.length)];
    const randomDigits = () => Math.floor(Math.random() * 10);

    return [...randomFormat]
        .map(char => (char === '#' ? randomDigits() : char))
        .join('');
};

function createRandomConsumer(options) {
    const customFaker = new Faker({
        locale: [sv],
    });
    const firstName = customFaker.person.firstName();
    const lastName = customFaker.person.lastName();

    const consumer = {
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
            number: generateSwedishPhoneNumber(),
        },
    };
    if (options.consumerType === 'B2C') {
        consumer.privatePerson = {
            firstName: firstName,
            lastName: lastName,
        };
    }
    if (options.consumerType === 'B2B') {
        consumer.company = {
            name: faker.company.name(),
            contact: {
                firstName: firstName,
                lastName: lastName,
            },
        };
    }
    return consumer;
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

export default function generatePayload(options) {
    // generate random amount of order items
    const charge = options.charge;
    const items = generateOrderItems(Math.ceil(Math.random() * 3));
    // calculate total order value from items
    const totalValue = items
        .map(item => item.netTotalAmount)
        .reduce((sum, value) => sum + value, 0);

    const payload = {
        order: {
            items,
            amount: totalValue,
            currency: options.currency,
            reference: faker.string
                .hexadecimal({ length: 8, prefix: '#' })
                .toUpperCase(),
        },
        checkout: {
            termsUrl: `http://localhost:${config.port}/terms`,
            integrationType: options.hosted
                ? 'HostedPaymentPage'
                : 'EmbeddedCheckout',
            merchantHandlesConsumerData: options.mhcd,
            url: `http://localhost:${config.port}`,
            charge,
        },
    };
    if (options.consumer) {
        payload.checkout.consumer = createRandomConsumer(options);
    }

    if (options.consumerType === 'B2B') {
        payload.checkout.consumerType = {
            default: 'B2B',
            supportedTypes: ['B2B'],
        };
    }

    if (options.scheduled) {
        payload.subscription = {
            endDate: '2099-12-31T23:59:59.999Z',
            interval: 0,
        };
    }
    if (options.unscheduled) {
        payload.unscheduledSubscription = {
            create: true,
        };
    }
    return payload;
}
