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
$ nexi-cli
Usage: nexi-cli [options] [command]

Nexi Checkout CLI
A CLI tool to interact with Nexi Checkout Payment API

Options:
  -V, --version                                 output the version number
  -h, --help                                    display help for command

Commands:
  fetch-payment [options] [paymentId]           Fetch payment information individually or in bulk
  create-checkout [options]                     Create a checkout URL
  create-completed-checkout [options] [number]  Create completed checkout in test
  create-subscriptions [options]                Create subscriptions in test
  help [command]                                display help for command
```

### fetch-payment

```zsh
$ nexi-cli fetch-payment -h
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

### create-checkout

```zsh
$ nexi-cli create-checkout -h
Usage: nexi-cli create-checkout [options]

Create a checkout URL

Options:
  -c, --currency <string>     Set checkout currency (default: "SEK")
  -l, locale <string>         Set consumer locale (default: "sv")
  --lang <string>             Set checkout language (default: "sv-SE")
  --charge                    Charge payment automatically if reserved (default: false)
  --prod-secret-key <string>  Your production secret API key
  --test-secret-key <string>  Your test secret API key
  -p, --production            Use production environment (default: false)
  -h, --help                  display help for command
```

### create-completed-checkout

```zsh
$ nexi-cli create-completed-checkout -h
Usage: nexi-cli create-completed-checkout [options] [number]

Create completed checkout in test

Arguments:
  number                   Number of checkouts

Options:
  -c, --currency <string>  Set currency (default: "SEK")
  -l, locale <string>      Set consumer locale (default: "sv")
  --charge                 Charge payment automatically if reserved (default: false)
  --test-secret-key <key>  Your test secret API key
  -s, --save               Save table to CSV-file (default: false)
  -h, --help               display help for command
```

### create-subscriptions

```zsh
nexi-cli create-subscriptions -h
Usage: nexi-cli create-subscriptions [options] [number]

Create subscriptions in test

Arguments:
  number                     Number of checkouts

Options:
  -u, --unscheduled          Create unscheduled subscription
  -c, --currency <currency>  Set subscription currency (default: "SEK")
  -l, locale <locale>        Set consumer locale (default: "sv")
  --test-secret-key <key>    Your test secret API key
  -s, --save                 Save table to CSV-file (default: false)
  -h, --help                 display help for command
```

## Examples

```zsh
nexi-cli fetch-payment 53b84252bde14ba48759e6d30ce9ecf5
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
          },
          [length]: 1
        ]
      },
      [length]: 1
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
$ nexi-cli create-checkout --lang=en-GB
Payment ID:
9a8e571c8e024f0da5f7c3ec221ed6db
URL:
https://test.checkout.dibspayment.eu/hostedpaymentpage/?checkoutKey=e8ec1ad7898343caa92126b7691224cc&pid=9a8e571c8e024f0da5f7c3ec221ed6db&language=en-GB
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
- [ ] Create checkout
    - [ ] Create embedded checkout
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
