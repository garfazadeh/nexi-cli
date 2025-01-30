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
requestLimit: 5
export: false
xApiKey:
currency: USD
charge: false
checkoutLanguage: en-GB
consumer: true
consumerLocale: en
consumerType: B2C
mhcd: true
port: 8080
themeDark:
    backgroundColor: rgb(20, 22, 26)
    buttonbackgroundColor: rgb(72, 199, 142)
    buttonTextColor: rgb(20, 22, 26)
    linkColor: rgb(72, 199, 142)
    outlineColor: rgb(31, 34, 41)
    panelColor: rgb(36, 41, 46)
    panelLinkColor: rgb(72, 199, 142)
    panelTextColor: rgb(200,200,200)
    primaryColor: rgb(72, 199, 142)
    primaryOutlineColor: rgb(72, 199, 142)
    textColor: rgb(200,200,200)
    useLightIcons: true
themeLight: {}
verbose: false
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
  terminate-payment [options] [paymentId]       Terminate payment information individually or in bulk
  help [command]                                display help for command
```

### fetch-payment

```
Usage: nexi-cli fetch-payment [options] [paymentId]

Fetch payment information individually or in bulk

Arguments:
  paymentId                Payment ID

Options:
  -f, --file <path>        Path to file containing list of payment ID
  -p, --production         Use production environment (default: false)
  --prod-secret-key <key>  Your production secret API key
  -e, --export             Export table to CSV-file (default: false)
  -t, --table              Display results in a table
  --test-secret-key <key>  Your test secret API key
  -h, --help               display help for command
```

### create-payload

```
Usage: nexi-cli create-payload [options]

Returns a payload for a create payment request

Options:
  -C, --charge                Charge payment automatically if reserved (default:
                              true)
  -c, --currency <code>       Set checkout currency (default: "SEK")
  --consumer                  Automatically adds consumer object (default: true)
  --consumer-locale <locale>  Available locales: 'da', 'de', 'de_AT', 'en',
                              'nb_NO', 'sv' (default: "sv")
  --consumer-type <type>      Set type of consumer generated (default: "B2C")
  -H, --hosted                Hosted mode provides checkout link
  -m, --mhcd                  Hides address fields in checkout (default: true)
  --no-charge                 Disables automatic charge
  --no-consumer               Automatically removes consumer object
  --no-mhcd                   Displays address fields in checkout
  -h, --help                  display help for command
```

### create-checkout

```
Usage: nexi-cli create-checkout [options]

Create a embedded checkout or URL

Options:
  -C, --charge                  Charge payment automatically if reserved
                                (default: true)
  -c, --currency <code>         Set checkout currency (default: "SEK")
  --consumer                    Automatically adds consumer object (default:
                                true)
  --consumer-locale <locale>    Set consumer locale (default: "sv")
  --consumer-type <type>        Set consumer type (default: "B2C")
  -f, --finalized-event         Sends payment-order-finalized as false
  -H, --hosted                  Hosted mode provides checkout link
  --lang <string>               Set checkout language (default: "sv-SE")
  -m, --mhcd                    Hides address fields in checkout (default: true)
  --no-charge                   Negate charge
  --no-consumer                 Negate consumer
  --no-mhcd                     Negate mhcd
  --no-production               Negate production
  --no-verbose                  Negate verbose
  -p, --production              Use production environment (default: false)
  --prod-checkout-key <string>  Your production checkout key
  --prod-secret-key <string>    Your production secret API key
  --test-checkout-key <string>  Your test checkout key
  --test-secret-key <string>    Your test secret API key
  -v, --verbose                 Output additional information (default: true)
  -h, --help                    display help for command
```

### create-completed-checkout

```
Usage: nexi-cli create-completed-checkout [options] [number]

Create completed checkout in test environment

Arguments:
  number                      Number of checkouts

Options:
  -C, --charge                Charge payment automatically if reserved (default:
                              true)
  -c, --currency <code>       Set checkout currency (default: "SEK")
  --consumer                  Automatically adds consumer object (default: true)
  --consumer-locale <locale>  Set consumer locale (default: "sv")
  --consumer-type <type>      Set consumer type (default: "B2C")
  -e, --export                Export table to CSV-file (default: false)
  -H, --hosted                Hosted mode provides checkout link
  -m, --mhcd                  Hides address fields in checkout (default: true)
  --no-charge                 Negate charge
  --no-consumer               Negate consumer
  --no-export                 Negate export
  --no-mhcd                   Negate mhcd
  --no-verbose                Negate verbose
  -S, --scheduled             Create scheduled subscription
  -t, --table                 Display results in a table
  --test-checkout-key <key>   Your test checkout API key
  --test-secret-key <key>     Your test secret API key
  -u, --unscheduled           Create unscheduled subscription
  -v, --verbose               Output additional information (default: true)
  -h, --help                  display help for command
```

### terminate-payment

```
Usage: nexi-cli terminate-payment [options] [paymentId]

Terminate payment information individually or in bulk

Arguments:
  paymentId                Payment ID

Options:
  -e, --export             Export table to CSV-file (default: false)
  -f, --file <path>        Path to file containing list of payment ID
  --no-export              Negate export
  --no-production          Negate production
  -p, --production         Use production environment (default: false)
  --prod-secret-key <key>  Your production secret API key
  -t, --table              Display results in a table
  --test-secret-key <key>  Your test secret API key
  -h, --help               display help for command
```

## Screenshots

![Screenshot of embedded checkout](./docs/embedded-checkout-dark.jpg?raw=true 'Embedded checkout')
![Screenshot of embedded checkout](./docs/embedded-checkout-light.jpg?raw=true 'Embedded checkout')

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
- [x] Terminate payment
- [ ] Cancel payments
- [ ] Charge payments
    - [ ] Single one-off charges
    - [ ] Bulk subscription charges
    - [ ] Single subscription charges
- [ ] Refund payments
- [ ] Verify subscriptions
- [ ] Retrieve bulk
- [ ] Reconciliate payments
