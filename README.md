# Nexi Checkout CLI

This Node.js-based CLI tool interacts with
[Nexi Checkout APIs](https://developer.nexigroup.com/nexi-checkout/en-EU/api/) by automatically generating requests and
handling responses. It supports listening to webhooks and generating mock payments for testing purposes. Additionally,
it also includes functionality to initialize the
[Checkout JS SDK](https://developer.nexigroup.com/nexi-checkout/en-EU/api/checkout-js-sdk/) in a browser, making it
useful for troubleshooting and demo purposes.

## Features

- Retrieve payment information
- Create checkouts (embedded and hosted)
- Mock payments for testing
- Charge and refund payments
- Webhooks support
- Terminate payments

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

3. When you run the script the first time it will create a config file located in your config folder
   `~/.config/nexi-cli/config.yml`. Edit it and include your keys.

```yml
charge: false
checkoutLanguage: en-GB
consumer: true
consumerLocale: en
consumerType: B2C
currency: USD
export: false
mhcd: true
port: 8080
prodCheckoutKey:
prodSecretKey:
production: false
requestLimit: 5
testCheckoutKey:
testSecretKey:
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
xApiKey:
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
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  fetch           fetch information
  create          create payment
  charge          charge payment
  terminate       terminate payment
  init            initiate checkout
  mock            create mock payment
  help [command]  display help for command
```

### fetch payment

```
Usage: nexi-cli fetch payment [options] [paymentId]

Fetch payment information individually or in bulk

Arguments:
  paymentId                   Payment ID

Options:
  -p, --production            Use production environment (default: false)
  --no-production
  --prod-secret-key <string>  Your production secret API key
  --test-secret-key <string>  Your test secret API key
  -e, --export                Export table to CSV-file (default: false)
  --no-export
  -t, --table                 Display results in a table
  --no-table
  -v, --verbose               Output additional information (default: true)
  --no-verbose
  -f, --file <path>           Path to file containing list of payment ID
  -h, --help                  display help for command
```

### create payment

```
Usage: nexi-cli create payment [options]

Creates payment

Options:
  -c, --currency <code>              Set checkout currency (default: "SEK")
  -C, --charge                       Charge payment automatically if reserved
                                     (default: true)
  --no-charge
  -o, --order-value <amount>         Set the total order value of all order
                                     items
  -s, --scheduled                    Create scheduled subscription
  -u, --unscheduled                  Create unscheduled subscription
  --consumer                         Automatically adds consumer object
                                     (default: true)
  --no-consumer
  --consumer-locale <locale>         Available locales: 'da', 'de', 'de_AT',
                                     'en', 'nb_NO', 'sv' (default: "sv")
  --consumer-type <type>             Set type of consumer generated (default:
                                     "B2C")
  --default-consumer-type <type>     Set default consumer type
  --supported-consumer-type <types>  Set supported consumer types
  -H, --hosted                       Hosted mode provides checkout link
  -m, --mhcd                         Hides address fields in checkout (default:
                                     true)
  --no-mhcd
  --shipping-countries <codes>       Specify enabled shipping countries
  --country-code <code>              Set default country
  --public-device                    Prevents cookies from being read or saved
  --port                             Server port
  --webhook-events <events>          Comma-separated list of webhook events to
                                     include
  -e, --export                       Export table to CSV-file (default: false)
  --no-export
  -t, --table                        Display results in a table
  --no-table
  -v, --verbose                      Output additional information (default:
                                     true)
  --no-verbose
  -d, --dryrun                       Outputs generated request without sending
                                     it
  -h, --help                         display help for command
```

### charge payment

```
Usage: nexi-cli charge payment [options] [paymentId]

Charge a reserved payment

Arguments:
  paymentId                   Payment ID

Options:
  -e, --export                Export table to CSV-file (default: false)
  --no-export
  -t, --table                 Display results in a table
  --no-table
  -v, --verbose               Output additional information (default: true)
  --no-verbose
  -d, --dryrun                Outputs generated request without sending it
  -o, --order-value <amount>  Set the total order value of all order items
  -h, --help                  display help for command
```

### refund charge

```
Usage: nexi-cli refund charge [options] [chargeId]

Refund a charge

Arguments:
  chargeId                    Charge ID

Options:
  -e, --export                Export table to CSV-file (default: false)
  --no-export
  -t, --table                 Display results in a table
  --no-table
  -v, --verbose               Output additional information (default: true)
  --no-verbose
  -d, --dryrun                Outputs generated request without sending it
  -o, --order-value <amount>  Set the total order value of all order items
  -h, --help                  display help for command
```

### refund payment

```
Usage: nexi-cli refund payment [options] [paymentId]

Refund a charged payment

Arguments:
  paymentId                   Payment ID

Options:
  -e, --export                Export table to CSV-file (default: false)
  --no-export
  -t, --table                 Display results in a table
  --no-table
  -v, --verbose               Output additional information (default: true)
  --no-verbose
  -d, --dryrun                Outputs generated request without sending it
  -o, --order-value <amount>  Set the total order value of all order items
  -h, --help                  display help for command
```

### init checkout

```
Usage: nexi-cli init checkout [options]

Create a embedded checkout or URL

Options:
  -c, --currency <code>              Set checkout currency (default: "SEK")
  -C, --charge                       Charge payment automatically if reserved
                                     (default: true)
  --no-charge
  -o, --order-value <amount>         Set the total order value of all order
                                     items
  -s, --scheduled                    Create scheduled subscription
  -u, --unscheduled                  Create unscheduled subscription
  --consumer                         Automatically adds consumer object
                                     (default: true)
  --no-consumer
  --consumer-locale <locale>         Available locales: 'da', 'de', 'de_AT',
                                     'en', 'nb_NO', 'sv' (default: "sv")
  --consumer-type <type>             Set type of consumer generated (default:
                                     "B2C")
  --default-consumer-type <type>     Set default consumer type
  --supported-consumer-type <types>  Set supported consumer types
  -H, --hosted                       Hosted mode provides checkout link
  -m, --mhcd                         Hides address fields in checkout (default:
                                     true)
  --no-mhcd
  --shipping-countries <codes>       Specify enabled shipping countries
  --country-code <code>              Set default country
  --public-device                    Prevents cookies from being read or saved
  --port                             Server port
  --webhook-events <events>          Comma-separated list of webhook events to
                                     include
  -e, --export                       Export table to CSV-file (default: false)
  --no-export
  -t, --table                        Display results in a table
  --no-table
  -v, --verbose                      Output additional information (default:
                                     true)
  --no-verbose
  -p, --production                   Use production environment (default: false)
  --no-production
  --prod-secret-key <string>         Your production secret API key
  --test-secret-key <string>         Your test secret API key
  --test-checkout-key <string>       Your test checkout key
  --prod-checkout-key <string>       Your production checkout key
  -f, --finalized-event              Sends payment-order-finalized as false
  --lang <string>                    Set checkout language (default: "sv-SE")
  -h, --help                         display help for command
```

### mock payment

```
Usage: nexi-cli mock payment [options] [number]

Create mock payments for testing purposes in test environment

Arguments:
  number                             Number of completed payments

Options:
  -c, --currency <code>              Set checkout currency (default: "SEK")
  -C, --charge                       Charge payment automatically if reserved
                                     (default: true)
  --no-charge
  -o, --order-value <amount>         Set the total order value of all order
                                     items
  -s, --scheduled                    Create scheduled subscription
  -u, --unscheduled                  Create unscheduled subscription
  --consumer                         Automatically adds consumer object
                                     (default: true)
  --no-consumer
  --consumer-locale <locale>         Available locales: 'da', 'de', 'de_AT',
                                     'en', 'nb_NO', 'sv' (default: "sv")
  --consumer-type <type>             Set type of consumer generated (default:
                                     "B2C")
  --default-consumer-type <type>     Set default consumer type
  --supported-consumer-type <types>  Set supported consumer types
  -H, --hosted                       Hosted mode provides checkout link
  -m, --mhcd                         Hides address fields in checkout (default:
                                     true)
  --no-mhcd
  --shipping-countries <codes>       Specify enabled shipping countries
  --country-code <code>              Set default country
  --public-device                    Prevents cookies from being read or saved
  --port                             Server port
  --webhook-events <events>          Comma-separated list of webhook events to
                                     include
  -e, --export                       Export table to CSV-file (default: false)
  --no-export
  -t, --table                        Display results in a table
  --no-table
  -v, --verbose                      Output additional information (default:
                                     true)
  --no-verbose
  -p, --production                   Use production environment (default: false)
  --no-production
  --prod-secret-key <string>         Your production secret API key
  --test-secret-key <string>         Your test secret API key
  -h, --help                         display help for command
```

### terminate payment

```
Usage: nexi-cli terminate payment [options] [paymentId]

Terminate payment information individually or in bulk

Arguments:
  paymentId                   Payment ID

Options:
  -p, --production            Use production environment (default: false)
  --no-production
  --prod-secret-key <string>  Your production secret API key
  --test-secret-key <string>  Your test secret API key
  -e, --export                Export table to CSV-file (default: false)
  --no-export
  -t, --table                 Display results in a table
  --no-table
  -v, --verbose               Output additional information (default: true)
  --no-verbose
  -f, --file <path>           Path to file containing list of payment ID
  -h, --help                  display help for command
```

## Screenshots

![Screenshot of embedded checkout](./docs/embedded-checkout-dark.jpg?raw=true 'Embedded checkout')
![Screenshot of embedded checkout](./docs/embedded-checkout-light.jpg?raw=true 'Embedded checkout')

## Todo

- [x] Retrieve payment information
- [x] Create checkout
    - [x] Create embedded checkout
        - [x] Dark theme
        - [ ] Freeze / Thaw checkout
        - [ ] Checkout flows
            - [ ] Integrated cart
            - [ ] Shipping handling
            - [ ] Native forms
    - [x] Create hosted checkout
- [x] Mock
    - [x] Card payments
    - [ ] Swish payments
- [x] Create subscriptions
    - [x] Create scheduled subscriptions
    - [x] Create unscheduled subscriptions
- [x] Charge payments
    - [x] Single one-off charges
    - [ ] Bulk subscription charges
    - [ ] Single subscription charges
- [x] Refund
    - [x] Refund payments
    - [x] Refund charges
- [x] Webhooks support
- [x] Terminate payment
- [ ] Update payments
    - [ ] Update reference
    - [ ] Update order
    - [ ] Update myReference
- [ ] Cancel payments
- [ ] Verify subscriptions
- [ ] Retrieve bulk
- [ ] Reconciliate payments
