import {
    Faker,
    base,
    da,
    de,
    de_AT,
    de_CH,
    en,
    en_GB,
    faker,
    fi,
    nb_NO,
    sv,
} from '@faker-js/faker';

import configPromise from './config.js';

const localeMapping = {
    da,
    de,
    de_AT,
    en,
    nb_NO,
    sv,
};

const config = await configPromise;

function getLocaleFromCountryCode(countryCode) {
    switch (locale) {
        case 'da':
            return { countryCodeAlpha: 'DNK', countryCodeNumeric: '45' }; // Denmark
        case 'de':
            return { countryCodeAlpha: 'DEU', countryCodeNumeric: '49' }; // Germany
        case 'de_AT':
            return { countryCodeAlpha: 'AUT', countryCodeNumeric: '43' }; // Austria
        case 'en':
            return { countryCodeAlpha: 'USA', countryCodeNumeric: '1' }; // United States
        case 'nb_NO':
            return { countryCodeAlpha: 'NOR', countryCodeNumeric: '47' }; // Norway
        case 'sv':
            return { countryCodeAlpha: 'SWE', countryCodeNumeric: '46' }; // Sweden
        default:
            return { countryCodeAlpha: '', countryCodeNumeric: '' }; // Default case if locale is not recognized
    }
}

function getSpecificsFromLocale(locale) {
    switch (locale) {
        case 'da':
            return { countryCodeAlpha: 'DNK', countryCodeNumeric: '45' }; // Denmark
        case 'de':
            return { countryCodeAlpha: 'DEU', countryCodeNumeric: '49' }; // Germany
        case 'de_AT':
            return { countryCodeAlpha: 'AUT', countryCodeNumeric: '43' }; // Austria
        case 'en':
            return { countryCodeAlpha: 'USA', countryCodeNumeric: '1' }; // United States
        case 'nb_NO':
            return { countryCodeAlpha: 'NOR', countryCodeNumeric: '47' }; // Norway
        case 'sv':
            return { countryCodeAlpha: 'SWE', countryCodeNumeric: '46' }; // Sweden
        default:
            return { countryCodeAlpha: '', countryCodeNumeric: '' }; // Default case if locale is not recognized
    }
}

function createRandomConsumer(options) {
    const customFaker = new Faker({
        locale: [localeMapping[options.consumerLocale]],
    });
    const firstName = customFaker.person.firstName();
    const lastName = customFaker.person.lastName();
    const specifics = getSpecificsFromLocale(options.consumerLocale);
    let prefix = '';
    let phoneNumber = customFaker.phone.number({ style: 'international' });
    if (options.consumerLocale === 'en') {
        prefix = phoneNumber.substring(0, 2);
        phoneNumber = phoneNumber.substring(2);
    } else {
        prefix = phoneNumber.substring(0, 3);
        phoneNumber = phoneNumber.substring(3);
    }

    const includeAddressLine2 = Math.random() < 0.5;

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
                customFaker.location.buildingNumber(),
            addressLine2: includeAddressLine2
                ? customFaker.location.secondaryAddress()
                : '',
            postalCode: customFaker.location.zipCode(),
            city: customFaker.location.city(),
            country: specifics.countryCodeAlpha,
        },
        phoneNumber: {
            prefix: prefix,
            number: phoneNumber,
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
