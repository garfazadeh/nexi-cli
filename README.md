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

3. When you run the script the first time it will create a config file located
   in your config folder `~/.config/nexi-cli/config.yml`. Edit it and include
   your keys.

```yml
prodSecretKey:
prodCheckoutKey:
testSecretKey:
testCheckoutKey:
isTest: true
requestLimit: 5
saveToCSV: false
xApiKey: 
currency: SEK
charge: true
checkoutLanguage: sv-SE
consumer: true
consumerLocale: sv
consumerType: B2C
mhcd: true
port: 8080
```

4.  Make CLI accessible globally

```zsh
$ npm link
```

 <!-- USAGE EXAMPLES -->

## Usage

To view all top-level Nexi CLI commands, enter `nexi-cli` without arguments.

```
~/ nexi-cli
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
  help [command]                                display help for command                  display help for command
```

### fetch-payment

```
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
  -t, --table              Display results in a table
  -h, --help               display help for command
```

### create-payload

```
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

```
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
  -p, --production            Use production environment
  -v, --verbose               Output additional information
  --help                      display help for command
```

### create-completed-checkout

```
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
  -u, --unscheduled           Create unscheduled subscription
  -S, --scheduled             Create scheduled subscription
  --test-secret-key <key>     Your test secret API key
  --test-checkout-key <key>   Your test checkout API key
  -s, --save                  Save table to CSV-file (default: false)
  -t, --table                 Display results in a table
  -v, --verbose               Output additional information
  --help                      display help for command
```

## Screenshots

![Screenshot of embedded checkout](./docs/embedded-checkout.png?raw=true 'Embedded checkout')

## Todo

- [x] Retrieve payment information
- [x] Create checkout
    - [x] Create embedded checkout
    - [x] Create hosted checkout
- [x] Create reservations
- [x] Create subscriptions
    - [x] Create scheduled subscriptions
    - [x] Create unscheduled subscriptions
- [x] Webhooks support
- [ ] Cancel payments
- [ ] Charge payments
    - [ ] Single one-off charges
    - [ ] Bulk subscription charges
    - [ ] Single subscription charges
- [ ] Refund payments
- [ ] Verify subscriptions
- [ ] Retrieve bulk
- [ ] Reconciliate payments
