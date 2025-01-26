# nexi-cli

This is a CLI tool to make it easy to interact with Nexi Checkout Payment API.

## Pre-requisites

- Install [Node.js](https://nodejs.org/en/)

## Installation

1.  Clone the repository

```zsh
$ gh repo clone garfazadeh/nexi-cli
```

2.  Install dependencies

```zsh
$ cd nexi-cli
$ npm install
```

3.  Create `.env` from `.env.example` and add environment variables

```zsh
$ mv .env.example .env
$ vim .env
```

4.  Make CLI accessible globally

```zsh
$ npm link
```

 <!-- USAGE EXAMPLES -->

## Usage

To view all top-level Nexi CLI commands, enter `nexi-cli` without arguments.

```zsh
➜  ~ nexi-cli --help
Usage: nexi-cli [options] [command]

Nexi Checkout CLI
A CLI tool to interact with Nexi Checkout Payment API

Options:
  -V, --version                                 output the version number
  -h, --help                                    display help for command

Commands:
  fetch-payment [options] [paymentId]           Fetch payment information individually or in bulk
  create-payload [options]                      Returns a payload for a create payment request
  create-checkout [options]                     Create a embedded checkout or URL
  create-completed-checkout [options] [number]  Create completed checkout in test environment
  create-subscriptions [options] [number]       Create subscriptions in test environment
  help [command]                                display help for command
```

### fetch-payment

```zsh
➜  ~ nexi-cli fetch-payment --help
Usage: nexi-cli fetch-payment [options] [paymentId]

Fetch payment information individually or in bulk

Arguments:
  paymentId                Payment ID

Options:
  -f, --file <path>        Path to file containing list of payment ID
  --prod-secret-key <key>  Your production secret API key
  --test-secret-key <key>  Your test secret API key
  -p, --production         Use production environment (default: false)
  -s, --save               Save table to CSV-file (default: false)
  -h, --help               display help for command
```

### create-payload

```zsh
➜  ~ nexi-cli create-payload --help
Usage: nexi-cli create-payload [options]

Returns a payload for a create payment request

Options:
  -c, --currency <code>       Set checkout currency (default: "SEK")
  -h, --hosted                Hosted mode provides checkout link
  -m, --mhcd                  Hides address fields in checkout (default: true)
  --no-mhcd                   Displays address fields in checkout
  --consumer                  Automatically adds consumer object (default: true)
  --no-consumer               Automatically removes consumer object
  --consumer-locale <locale>  Set consumer locale (default: "sv")
  --consumer-type <type>      Set consumer type (default: "B2C")
  --charge                    Charge payment automatically if reserved (default: true)
  --help                      display help for command
```

### create-checkout

```zsh
➜  ~ nexi-cli create-checkout --help
Usage: nexi-cli create-checkout [options]

Create a embedded checkout or URL

Options:
  -c, --currency <code>       Set checkout currency (default: "SEK")
  -h, --hosted                Hosted mode provides checkout link
  -m, --mhcd                  Hides address fields in checkout (default: true)
  --no-mhcd                   Displays address fields in checkout
  --consumer                  Automatically adds consumer object (default: true)
  --no-consumer               Automatically removes consumer object
  --consumer-locale <locale>  Set consumer locale (default: "sv")
  --consumer-type <type>      Set consumer type (default: "B2C")
  --charge                    Charge payment automatically if reserved (default: true)
  --lang <string>             Set checkout language (default: "sv-SE")
  --prod-secret-key <string>  Your production secret API key
  --test-secret-key <string>  Your test secret API key
  -p, --production            Use production environment (default: false)
  --help                      display help for command
```

### create-completed-checkout

```zsh
➜  ~ nexi-cli create-completed-checkout --help
Usage: nexi-cli create-completed-checkout [options] [number]

Create completed checkout in test environment

Arguments:
  number                      Number of checkouts

Options:
  -c, --currency <code>       Set checkout currency (default: "SEK")
  -h, --hosted                Hosted mode provides checkout link
  -m, --mhcd                  Hides address fields in checkout (default: true)
  --no-mhcd                   Displays address fields in checkout
  --consumer                  Automatically adds consumer object (default: true)
  --no-consumer               Automatically removes consumer object
  --consumer-locale <locale>  Set consumer locale (default: "sv")
  --consumer-type <type>      Set consumer type (default: "B2C")
  --charge                    Charge payment automatically if reserved (default: true)
  --test-secret-key <key>     Your test secret API key
  -s, --save                  Save table to CSV-file (default: false)
  --help                      display help for command
```

### create-subscriptions

```zsh
➜  ~ nexi-cli create-subscriptions --help
Usage: nexi-cli create-subscriptions [options] [number]

Create subscriptions in test environment

Arguments:
  number                      Number of checkouts

Options:
  -u, --unscheduled           Create unscheduled subscription
  --scheduled                 Create scheduled subscription
  -c, --currency <code>       Set checkout currency (default: "SEK")
  -h, --hosted                Hosted mode provides checkout link
  -m, --mhcd                  Hides address fields in checkout (default: true)
  --no-mhcd                   Displays address fields in checkout
  --consumer                  Automatically adds consumer object (default: true)
  --no-consumer               Automatically removes consumer object
  --consumer-locale <locale>  Set consumer locale (default: "sv")
  --consumer-type <type>      Set consumer type (default: "B2C")
  --charge                    Charge payment automatically if reserved (default: true)
  --lang <string>             Set checkout language (default: "sv-SE")
  --test-secret-key <key>     Your test secret API key
  -s, --save                  Save table to CSV-file (default: false)
  --help                      display help for command
```

## Examples

```zsh
➜  ~ nexi-cli fetch-payment 53b84252bde14ba48759e6d30ce9ecf5
{
  payment: {
    paymentId: '53b84252bde14ba48759e6d30ce9ecf5',
    summary: { reservedAmount: 17769, chargedAmount: 17769 },
    consumer: {
      shippingAddress: {
        addressLine1: 'Norra Åkerallén 6',
        receiverLine: 'Pia Jakobsson',
        postalCode: '69067',
        city: 'Lyckköping',
        country: 'SWE',
        phoneNumber: { prefix: '+46', number: '705248586' }
      },
      company: { contactDetails: { phoneNumber: {} } },
      privatePerson: {
        merchantReference: 'FYWTcZHUnm',
        firstName: 'Pia',
        lastName: 'Jakobsson',
        email: 'pia_jakobsson49@yahoo.com',
        phoneNumber: { prefix: '+46', number: '705248586' }
      },
      billingAddress: {
        addressLine1: 'Norra Åkerallén 6',
        receiverLine: 'Pia Jakobsson',
        postalCode: '69067',
        city: 'Lyckköping',
        country: 'SWE',
        phoneNumber: { prefix: '+46', number: '705248586' }
      }
    },
    paymentDetails: {
      paymentType: 'CARD',
      paymentMethod: 'MasterCard',
      invoiceDetails: {},
      cardDetails: { maskedPan: '55443300****0235', expiryDate: '1029' }
    },
    orderDetails: { amount: 17769, currency: 'SEK', reference: '#4cDCe360' },
    checkout: { url: 'https://shop.easy.nets.eu/checkout' },
    created: '2025-01-26T00:07:28.2723+00:00',
    charges: [
      {
        chargeId: 'c701658939de4ca4bc25467841f005b2',
        amount: 17769,
        created: '2025-01-26T00:07:28.5922+00:00',
        orderItems: [
          {
            reference: 'fantastic-wooden-shirt',
            name: 'Fantastic Wooden Shirt',
            quantity: 3,
            unit: 'pcs',
            unitPrice: 5923,
            taxRate: 0,
            taxAmount: 0,
            grossTotalAmount: 17769,
            netTotalAmount: 17769
          }
        ]
      }
    ]
  }
}
```

```zsh
$ nexi-cli fetch-payment -f paymentIds.txt
Fetching payments: ██████████████████████████████████████████████████ 10/10

┌─────────┬────────────────────────────────────┬──────────┬─────────────┬───────────────┬────────────────┬───────────────┬────────────────┬─────────────────┐
│ (index) │ paymentId                          │ currency │ paymentType │ paymentMethod │ reservedAmount │ chargedAmount │ refundedAmount │ cancelledAmount │
├─────────┼────────────────────────────────────┼──────────┼─────────────┼───────────────┼────────────────┼───────────────┼────────────────┼─────────────────┤
│ 0       │ '9a212f9eaf914d41895d4b9c461ba11e' │ 'SEK'    │ 'CARD'      │ 'MasterCard'  │ '10108.34'     │ ''            │ ''             │ ''              │
│ 1       │ 'bbaa43a4be3d4393b9a521d54cc95a29' │ 'SEK'    │ 'CARD'      │ 'MasterCard'  │ '6778.25'      │ ''            │ ''             │ ''              │
│ 2       │ '21a1c6c4a0e24f42913d246b82b5b73a' │ 'SEK'    │ 'CARD'      │ 'Visa'        │ '2484.63'      │ ''            │ ''             │ ''              │
│ 3       │ '662066b4436845258c6301ad33a7c41e' │ 'SEK'    │ 'CARD'      │ 'Visa'        │ '8361.65'      │ ''            │ ''             │ ''              │
│ 4       │ '671a7599548643eba58d9ee993688201' │ 'SEK'    │ 'CARD'      │ 'MasterCard'  │ '3093.81'      │ ''            │ ''             │ ''              │
│ 5       │ '6346ea06255e4a07aa8450dc8966a429' │ 'SEK'    │ 'CARD'      │ 'MasterCard'  │ '4689.96'      │ ''            │ ''             │ ''              │
│ 6       │ '6cb7e2069c6a4884ab84cf26095e73ba' │ 'SEK'    │ 'CARD'      │ 'Visa'        │ '2319.60'      │ ''            │ ''             │ ''              │
│ 7       │ 'd6ea2216e4594467942cde0a3feebebd' │ 'SEK'    │ 'CARD'      │ 'MasterCard'  │ '6565.38'      │ ''            │ ''             │ ''              │
│ 8       │ '715d4ba0b00c4577acb5d784d92c8add' │ 'SEK'    │ 'CARD'      │ 'MasterCard'  │ '12147.03'     │ ''            │ ''             │ ''              │
│ 9       │ '91c2fe1b6c2d40c2ba3615e7de60152b' │ 'SEK'    │ 'CARD'      │ 'MasterCard'  │ '4058.67'      │ ''            │ ''             │ ''              │
└─────────┴────────────────────────────────────┴──────────┴─────────────┴───────────────┴────────────────┴───────────────┴────────────────┴─────────────────┘
```

```zsh
➜  ~ nexi-cli create-checkout --consumer --charge
Sent payload:
{
  order: {
    items: [
      {
        reference: 'incredible-bamboo-gloves',
        name: 'Incredible Bamboo Gloves',
        quantity: 2,
        unit: 'pcs',
        unitPrice: '99358',
        taxRate: 0,
        taxAmount: 0,
        netTotalAmount: 198716,
        grossTotalAmount: 198716
      },
      {
        reference: 'handcrafted-granite-shirt',
        name: 'Handcrafted Granite Shirt',
        quantity: 5,
        unit: 'pcs',
        unitPrice: '69504',
        taxRate: 0,
        taxAmount: 0,
        netTotalAmount: 347520,
        grossTotalAmount: 347520
      }
    ],
    amount: 546236,
    currency: 'SEK',
    reference: '#E5BBFFE3'
  },
  checkout: {
    termsUrl: 'http://localhost:3000/terms',
    integrationType: 'EmbeddedCheckout',
    merchantHandlesConsumerData: true,
    url: 'http://localhost:3000',
    charge: true,
    consumer: {
      reference: 'GPmoEmbwdD',
      email: 'jan_bergman@yahoo.com',
      shippingAddress: {
        addressLine1: 'Fabriksgränden 4',
        postalCode: '66925',
        city: 'Kristvik',
        country: 'SWE'
      },
      phoneNumber: { prefix: '+46', number: '8429879' },
      privatePerson: { firstName: 'Jan', lastName: 'Bergman' }
    }
  }
}

Received Payment ID: 0c125a9c793e4aa39eb4746b57f9b841

Checkout accessible on http://localhost:3000
{ event: 'iframe-loaded' }
{ event: 'pay-initialized' }
{ event: 'payment-order-finalized', value: true }
{ event: 'payment-completed' }

Fetching payment:
{
  payment: {
    paymentId: '0c125a9c793e4aa39eb4746b57f9b841',
    summary: { chargedAmount: 546236 },
    consumer: {
      shippingAddress: {
        addressLine1: 'Fabriksgränden 4',
        receiverLine: 'Jan Bergman',
        postalCode: '66925',
        city: 'Kristvik',
        country: 'SWE',
        phoneNumber: { prefix: '+46', number: '8429879' }
      },
      company: { contactDetails: { phoneNumber: {} } },
      privatePerson: {
        merchantReference: 'GPmoEmbwdD',
        firstName: 'Jan',
        lastName: 'Bergman',
        email: 'jan_bergman@yahoo.com',
        phoneNumber: { prefix: '+46', number: '8429879' }
      },
      billingAddress: {
        addressLine1: 'Fabriksgränden 4',
        receiverLine: 'Jan Bergman',
        postalCode: '66925',
        city: 'Kristvik',
        country: 'SWE',
        phoneNumber: { prefix: '+46', number: '8429879' }
      }
    },
    paymentDetails: {
      paymentType: 'A2A',
      paymentMethod: 'Swish',
      invoiceDetails: {},
      cardDetails: {}
    },
    orderDetails: { amount: 546236, currency: 'SEK', reference: '#E5BBFFE3' },
    checkout: { url: 'http://localhost:3000' },
    created: '2025-01-26T23:28:24.8214+00:00',
    charges: [
      {
        chargeId: 'a72ee4af99d54fcb8a797741fcde64f4',
        amount: 546236,
        created: '2025-01-26T23:28:29.4202+00:00',
        orderItems: [
          {
            reference: 'incredible-bamboo-gloves',
            name: 'Incredible Bamboo Gloves',
            quantity: 2,
            unit: 'pcs',
            unitPrice: 99358,
            taxRate: 0,
            taxAmount: 0,
            grossTotalAmount: 198716,
            netTotalAmount: 198716
          },
          {
            reference: 'handcrafted-granite-shirt',
            name: 'Handcrafted Granite Shirt',
            quantity: 5,
            unit: 'pcs',
            unitPrice: 69504,
            taxRate: 0,
            taxAmount: 0,
            grossTotalAmount: 347520,
            netTotalAmount: 347520
          }
        ]
      }
    ]
  }
}
```

```zsh
nexi-cli create-completed-checkout 10 --charge
Creating completed checkouts: ██████████████████████████████████████████████████ 10/10
┌─────────┬────────────────────────────────────┬──────────┬───────────────┬────────────────┬───────────────┐
│ (index) │ paymentId                          │ currency │ paymentMethod │ reservedAmount │ chargedAmount │
├─────────┼────────────────────────────────────┼──────────┼───────────────┼────────────────┼───────────────┤
│ 0       │ 'f8a5778bdb0843a1a04053842aa19e94' │ 'SEK'    │ 'Visa'        │ '5125.61'      │ '5125.61'     │
│ 1       │ '5202d5b7f2e34f45bc4f17ad45671eb6' │ 'SEK'    │ 'Visa'        │ '3595.14'      │ '3595.14'     │
│ 2       │ '1b5adb7551334c1b8d92e9efb4cf2da0' │ 'SEK'    │ 'Visa'        │ '6692.88'      │ '6692.88'     │
│ 3       │ '7f5f58192bd44c0faba74ad347d8bded' │ 'SEK'    │ 'Visa'        │ '1983.08'      │ '1983.08'     │
│ 4       │ '31167d20425240e1b9b031c3d98cbdd6' │ 'SEK'    │ 'MasterCard'  │ '16118.60'     │ '16118.60'    │
│ 5       │ '53b84252bde14ba48759e6d30ce9ecf5' │ 'SEK'    │ 'MasterCard'  │ '177.69'       │ '177.69'      │
│ 6       │ 'bb98fe17c2d54273927f74b5e1b571a1' │ 'SEK'    │ 'MasterCard'  │ '1462.50'      │ '1462.50'     │
│ 7       │ 'edd7095e9c4940b6b516e55082f189c6' │ 'SEK'    │ 'Visa'        │ '1039.68'      │ '1039.68'     │
│ 8       │ 'ca630fa754114c4193c7cfed05220aa5' │ 'SEK'    │ 'MasterCard'  │ '11479.78'     │ '11479.78'    │
│ 9       │ 'e5f4ee2a4098485d91dbf7356a717d48' │ 'SEK'    │ 'Visa'        │ '2460.64'      │ '2460.64'     │
└─────────┴────────────────────────────────────┴──────────┴───────────────┴────────────────┴───────────────┘
```

```zsh
nexi-cli create-subscriptions 5 -u
Creating subscriptions: ██████████████████████████████████████████████████ 5/5
┌─────────┬────────────────────────────────────┬──────────┬─────────────┬───────────────┬────────────────────┬────────────┐
│ (index) │ unscheduledSubscriptionId          │ currency │ paymentType │ paymentMethod │ maskedPan          │ expiryDate │
├─────────┼────────────────────────────────────┼──────────┼─────────────┼───────────────┼────────────────────┼────────────┤
│ 0       │ '03f0150a214b425b820745991b9165db' │ 'SEK'    │ 'CARD'      │ 'Visa'        │ '49250000****0079' │ '0227'     │
│ 1       │ 'a6ad699ec9ff4fe1870c6cbcb05dcc46' │ 'SEK'    │ 'CARD'      │ 'Visa'        │ '49250000****0079' │ '0729'     │
│ 2       │ '8a6336e6a25745ac88fc5f7808104a81' │ 'SEK'    │ 'CARD'      │ 'MasterCard'  │ '52131998****3465' │ '0729'     │
│ 3       │ '736797df79c14fd0b00bdc7c116243c7' │ 'SEK'    │ 'CARD'      │ 'Visa'        │ '49250000****0079' │ '0728'     │
│ 4       │ '02aed277ac7743e9a49db8c2b3eeffaf' │ 'SEK'    │ 'CARD'      │ 'MasterCard'  │ '55443300****0235' │ '0429'     │
└─────────┴────────────────────────────────────┴──────────┴─────────────┴───────────────┴────────────────────┴────────────┘
```

## Todo

- [x] Retrieve payment information
- [x] Create checkout
    - [x] Create embedded checkout
    - [x] Create hosted checkout
- [x] Create reservations
- [x] Create subscriptions
    - [x] Create scheduled subscriptions
    - [x] Create unscheduled subscriptions
- [ ] Webhooks support
- [ ] Cancel payments
- [ ] Charge payments
    - [ ] Single one-off charges
    - [ ] Bulk subscription charges
    - [ ] Single subscription charges
- [ ] Refund payments
- [ ] Verify subscriptions
- [ ] Retrieve bulk
- [ ] Reconciliate payments
