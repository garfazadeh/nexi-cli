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
