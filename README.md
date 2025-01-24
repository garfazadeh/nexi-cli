# nexi-cli

This is a CLI tool to make it easy to interact with Nexi Checkout Payment API.

## Pre-requisites

-   Install [Node.js](https://nodejs.org/en/)

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
  -V, --version                            output the version number
  -h, --help                               display help for command

Commands:
  fetch-payment [options]                  Fetch payments from a list of payment ID
  create-checkout [options]                Create a checkout URL
  create-subscriptions [options] <amount>  Create subscriptions
  help [command]                           display help for command
```

## Example

```zsh
$ nexi-cli fetch-payment -p -f paymentIds.txt
Fetching payments: ██████████████████████████████████████████████████ 9/9

┌─────────┬──────────────────────────────────┬────────────────────────────────────┬─────────────┬──────────┬─────────────┬───────────────┬────────────────┬───────────────┬────────────────┬─────────────────┐
│ (index) │ created                          │ paymentId                          │ reference   │ currency │ paymentType │ paymentMethod │ reservedAmount │ chargedAmount │ refundedAmount │ cancelledAmount │
├─────────┼──────────────────────────────────┼────────────────────────────────────┼─────────────┼──────────┼─────────────┼───────────────┼────────────────┼───────────────┼────────────────┼─────────────────┤
│ 0       │ '2025-01-23T18:42:48.0047+00:00' │ '74f28104c5ab4ccdb9a1ffde4c331e00' │ '0bca3463'  │ 'SEK'    │ ''          │ ''            │ ''             │ ''            │ ''             │ ''              │
│ 1       │ '2025-01-23T12:42:10.2737+00:00' │ '512d4af40fb5cf01bf2dbd7537c4cdc4' │ '30fc915f'  │ 'SEK'    │ ''          │ ''            │ ''             │ ''            │ ''             │ ''              │
│ 2       │ '2025-01-23T16:50:04.1391+00:00' │ '78a72e48a0304b5ba5b4a0dcbdcc7daa' │ '02d378b8'  │ 'SEK'    │ 'CARD'      │ 'Visa'        │ '10232.50'     │ '10232.50'    │ ''             │ ''              │
│ 3       │ '2025-01-22T18:19:11.3667+00:00' │ '14feaa805fb149c2ac9ce8574d91d25e' │ 'c55dc754'  │ 'SEK'    │ 'CARD'      │ 'MasterCard'  │ '122.50'       │ '122.50'      │ ''             │ ''              │
│ 4       │ '2025-01-22T11:50:26.7938+00:00' │ 'cff9943ca9214f108b1acfc3f1e0f17d' │ 'b25751c4'  │ 'SEK'    │ ''          │ ''            │ ''             │ ''            │ ''             │ ''              │
│ 5       │ '2025-01-22T11:32:19.7499+00:00' │ '158ffa2606c64ba0b3eaf721eec7388a' │ 'baf2523c'  │ 'SEK'    │ 'A2A'       │ 'Swish'       │ ''             │ '283.50'      │ ''             │ ''              │
│ 6       │ '2025-01-21T16:12:09.6557+00:00' │ 'ce5b55a7aae54131a699ad93e91c287c' │ 'f64abb81'  │ 'SEK'    │ 'CARD'      │ 'MasterCard'  │ '385.50'       │ '385.50'      │ ''             │ ''              │
│ 7       │ '2025-01-21T13:59:16.2741+00:00' │ '30952dc2155c44ada1302052410a8f75' │ '216c46c0'  │ 'SEK'    │ 'A2A'       │ 'Swish'       │ ''             │ '419.50'      │ ''             │ ''              │
│ 8       │ '2025-01-21T11:27:38.1894+00:00' │ 'a10d672ebc5641e5922665d5c7ece61d' │ 'c7f030bc'  │ 'SEK'    │ ''          │ ''            │ ''             │ ''            │ ''             │ ''              │
└─────────┴──────────────────────────────────┴────────────────────────────────────┴─────────────┴──────────┴─────────────┴───────────────┴────────────────┴───────────────┴────────────────┴─────────────────┘
```

```zsh
$ nexi-cli create-checkout
Payment ID:
b7e7336ea14c4dafabcfc07d4aca3e16
URL:
https://test.checkout.dibspayment.eu/hostedpaymentpage/?checkoutKey=e8ec1ad7898343caa92126b7691224cc&pid=b7e7336ea14c4dafabcfc07d4aca3e16
```

```zsh
$ nexi-cli create-subscriptions 2
Creating subscriptions: ██████████████████████████████████████████████████ 2/2
┌─────────┬────────────────────────────────────┬──────────┬─────────────┬───────────────┬────────────────────┬────────────┐
│ (index) │ subscriptionId                     │ currency │ paymentType │ paymentMethod │ maskedPan          │ expiryDate │
├─────────┼────────────────────────────────────┼──────────┼─────────────┼───────────────┼────────────────────┼────────────┤
│ 0       │ '007ebdc585a9407bb6c76d74854c952f' │ 'SEK'    │ 'CARD'      │ 'Visa'        │ '49250000****0061' │ '0528'     │
│ 1       │ 'd0e9ea75ea1a42ba95faeb1b1d37ecf8' │ 'SEK'    │ 'CARD'      │ 'Visa'        │ '49250000****0079' │ '1127'     │
└─────────┴────────────────────────────────────┴──────────┴─────────────┴───────────────┴────────────────────┴────────────┘
```

## Todo

-   [x] Retrieve payment information
-   [ ] Create checkout
    -   [ ] Create embedded checkout
    -   [x] Create hosted checkout
-   [ ] Create subscriptions
    -   [x] Create scheduled subscriptions
    -   [ ] Create unscheduled subscriptions
-   [ ] Webhooks support
-   [ ] Cancel payments
-   [ ] Charge payments
    -   [ ] Single one-off charges
    -   [ ] Bulk subscription charges
    -   [ ] Single subscription charges
-   [ ] Refund payments
-   [ ] Verify subscriptions
-   [ ] Retrieve bulk
-   [ ] Reconciliate payments
