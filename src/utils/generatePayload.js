async function loadFakerLocale(consumerLocale) {
    let faker;
    try {
        // Dynamically import the appropriate locale based on customerLocale
        switch (consumerLocale) {
            case 'da':
                faker = await import('@faker-js/faker/locale/da');
                break;
            case 'de':
                faker = await import('@faker-js/faker/locale/de');
                break;
            case 'de_AT':
                faker = await import('@faker-js/faker/locale/de_AT');
                break;
            case 'en':
                faker = await import('@faker-js/faker/locale/en');
                break;
            case 'nb_NO':
                faker = await import('@faker-js/faker/locale/nb_NO');
                break;
            case 'sv':
                faker = await import('@faker-js/faker/locale/sv');
                break;
            default:
                throw new Error(`Unsupported locale: ${consumerLocale}`);
        }
    } catch (error) {
        console.error('Failed to load faker locale:', error);
        throw error;
    }

    // Access the faker object based on the module structure
    if (faker && faker.default) {
        faker = faker.default; // Default export
    } else if (faker && faker.faker) {
        faker = faker.faker; // Named export
    } else {
        throw new Error('Unable to resolve faker object from the imported module.');
    }
    return faker;
}

const localeSpecifics = {
    da: { countryCodeAlpha: 'DNK', countryCodeNumeric: '45' },
    de: { countryCodeAlpha: 'DEU', countryCodeNumeric: '49' },
    de_AT: { countryCodeAlpha: 'AUT', countryCodeNumeric: '43' },
    en: { countryCodeAlpha: 'USA', countryCodeNumeric: '1' },
    nb_NO: { countryCodeAlpha: 'NOR', countryCodeNumeric: '47' },
    sv: { countryCodeAlpha: 'SWE', countryCodeNumeric: '46' },
};

function getSpecificsFromLocale(locale) {
    return (
        localeSpecifics[locale] || {
            countryCodeAlpha: '',
            countryCodeNumeric: '',
        }
    );
}

async function createRandomConsumer(options, faker) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const specifics = getSpecificsFromLocale(options.consumerLocale);
    const includeAddressLine2 = Math.random() < 0.5;
    const phoneNumber = faker.phone.number({ style: 'international' });
    const [prefix, number] =
        options.consumerLocale === 'en'
            ? [phoneNumber.substring(0, 2), phoneNumber.substring(2)]
            : [phoneNumber.substring(0, 3), phoneNumber.substring(3)];

    const consumer = {
        reference: faker.string.alpha(10),
        email: faker.internet.email({
            firstName: firstName.toLowerCase(),
            lastName: lastName.toLowerCase(),
        }),
        shippingAddress: {
            addressLine1: faker.location.street() + ' ' + faker.location.buildingNumber(),
            addressLine2: includeAddressLine2 ? faker.location.secondaryAddress() : '',
            postalCode: faker.location.zipCode(),
            city: faker.location.city(),
            country: specifics.countryCodeAlpha,
        },
        phoneNumber: { prefix, number },
    };
    if (options.consumerType === 'B2C') {
        consumer.privatePerson = { firstName, lastName };
    } else if (options.consumerType === 'B2B') {
        consumer.company = {
            name: faker.company.name(),
            contact: { firstName, lastName },
        };
    }
    return consumer;
}

function generateOrderItems(number, faker, totalNetAmount = null) {
    if (number <= 0) {
        return []; // Return an empty array if no items are requested
    }

    const items = Array.from({ length: number }, () => {
        const productName = faker.commerce.productName();
        const amount = Math.floor(faker.commerce.price({ min: 300, max: 100000, dec: 0 }));
        const quantity = Math.ceil(Math.random() * 6);

        return {
            reference: productName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, ''),
            name: productName,
            quantity,
            unit: 'pcs',
            unitPrice: amount,
            taxRate: 0,
            taxAmount: 0,
            netTotalAmount: quantity * amount,
            grossTotalAmount: quantity * amount,
        };
    });

    if (totalNetAmount !== null) {
        const currentTotal = items.reduce((sum, item) => sum + item.netTotalAmount, 0);
        const adjustmentFactor = totalNetAmount / currentTotal;

        items.forEach(item => {
            item.unitPrice = Math.floor(item.unitPrice * adjustmentFactor);
            item.netTotalAmount = item.quantity * item.unitPrice;
            item.grossTotalAmount = item.netTotalAmount;
        });

        const adjustedTotal = items.reduce((sum, item) => sum + item.netTotalAmount, 0);

        const roundingDifference = totalNetAmount - adjustedTotal;

        if (roundingDifference !== 0) {
            items.push({
                reference: 'rounding-adjustment',
                name: 'Rounding Adjustment',
                quantity: 1,
                unit: 'pcs',
                unitPrice: roundingDifference,
                taxRate: 0,
                taxAmount: 0,
                netTotalAmount: roundingDifference,
                grossTotalAmount: roundingDifference,
            });
        }
    }

    return items;
}

export default async function generatePayload(options, tunnel) {
    const faker = await loadFakerLocale(options.consumerLocale);
    const consumer = options.consumer ? await createRandomConsumer(options, faker) : null;
    const items = generateOrderItems(Math.ceil(Math.random() * 3), faker, options.orderValue);
    const totalAmount = options.orderValue || calculateTotalAmount(items);

    const payload = {
        order: createOrder(items, totalAmount, options.currency, faker),
        checkout: createCheckout(options, consumer),
    };

    if (tunnel) {
        payload.notifications = createNotifications(tunnel, options);
    }

    addOptionalFields(payload, options, consumer);

    return payload;
}

function calculateTotalAmount(items) {
    return items.reduce((sum, item) => sum + item.netTotalAmount, 0);
}

function createOrder(items, totalAmount, currency, faker) {
    return {
        items,
        amount: totalAmount,
        currency,
        reference: faker.string.hexadecimal({ length: 8, prefix: '#' }).toUpperCase(),
    };
}

function createCheckout(options, consumer) {
    const checkout = {
        termsUrl: `http://localhost:${options.port}/terms`,
        integrationType: options.hosted ? 'HostedPaymentPage' : 'EmbeddedCheckout',
        merchantHandlesConsumerData: options.mhcd,
        charge: options.charge,
        ...(options.hosted
            ? {
                  returnUrl: `http://localhost:${options.port}/return`,
                  cancelUrl: `http://localhost:${options.port}/cancel`,
              }
            : {
                  url: `http://localhost:${options.port}`,
              }),
    };

    if (options.publicDevice) {
        checkout.publicDevice = true;
    }

    if (options.supportedConsumerType) {
        checkout.consumerType = checkout.consumerType || {};
        checkout.consumerType.supportedTypes = options.supportedConsumerType;
    }

    if (options.defaultConsumerType) {
        checkout.consumerType = checkout.consumerType || {};
        checkout.consumerType.default = options.defaultConsumerType;
    }

    if (options.shippingCountries) {
        checkout.shippingCountries = options.shippingCountries.map(code => ({ countryCode: code }));
    }

    if (options.countryCode) {
        checkout.countryCode = options.countryCode;
    }

    if (consumer) {
        checkout.consumer = consumer;
    }

    return checkout;
}

function addOptionalFields(payload, options) {
    if (options.scheduled) {
        payload.subscription = {
            endDate: '2099-12-31T23:59:59.999Z',
            interval: 0,
        };
    }

    if (options.unscheduled) {
        payload.unscheduledSubscription = { create: true };
    }
}

function createNotifications(tunnel, options) {
    const allEvents = [
        'payment.cancel.failed',
        'payment.cancel.created',
        'payment.charge.created',
        'payment.charge.created.v2',
        'payment.charge.failed',
        'payment.charge.failed.v2',
        'payment.created',
        'payment.refund.completed',
        'payment.refund.failed',
        'payment.refund.initiated',
        'payment.reservation.created',
        'payment.reservation.created.v2',
        'payment.reservation.failed',
    ];

    const selectedEvents = options.webhookEvents
        ? options.webhookEvents.split(',').map(event => event.trim())
        : allEvents;

    return {
        webHooks: selectedEvents.map(eventName => ({
            eventName,
            url: tunnel.url + '/webhook',
            authorization: 'abcdef1234567890',
        })),
    };
}

export async function generateChargePayload(options) {
    const faker = await loadFakerLocale(options.consumerLocale);
    const orderItems = generateOrderItems(Math.ceil(Math.random() * 3), faker, options.orderValue);
    if (!options.orderValue) {
        options.orderValue = orderItems.reduce((sum, item) => sum + item.netTotalAmount, 0);
    }

    const payload = {
        amount: options.orderValue,
        orderItems,
    };

    return payload;
}
