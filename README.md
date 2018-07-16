# TrecentoServicesProject

This project contains the services which will be used as middleware for the trecento Platform.

The project is implemented in nodejs using the express framework, and will host all the needed backend services for the platform.

The Services use the web3 JS libray to commuicate with smart contracts.

This project doesn't use truffle. 

## Details



### Server.js
A test restful http-server to allow calling the services from the browser to display subscriptions, investors, funds and to add new subscriptions through a basic HTML Form.

#### Get Subscriptions
* Example to Get existing subscriptions 
```
http://localhost:8000/api/subscriptions

```
![Server](/images/server_home.png)

>ON first Run, Subscriptions Cache is empty ( Reload the browser, the issue will be fixed)

#### Add Subscriptions ( UI)
* Adding new subscriptions requests can be done through a Simple Form.
( use the Link "Add Subcription" in the GUI, to start the form)

![addSubscription](/images/addSubscription.png)

* Enter an existing investorId
----

#### Add Investors, Funds and Rates (No UI, static data)

For investors , funds and rates , the data is for "now" static in the application, and can be changed only by modifying application files:

To Add Investors:
* open the file fund-oracles/src/database/InvestorRepository.js
* edit the init method by adding data in the model as the example below:

```
//Before:
function InvestorRepository() {
    this.investors = [
        new Model(1, "Jane", "Doe")
    ];
}
//After adding 2 investors

function InvestorRepository() {
   this.investors = [
        new Model(1, "Jane", "Doe"),
		 new Model(1, "Fernando", "Gomez"),
		new Model(1, "Paulo", "Rossini")
    ];
}

```
The same gilt for adding funds and Rates. The Server need to be restarted after the changes.


### Models & Database

The model and the data used in the services is defined in the models and the database classes under the following Folders:

* models

* database

### Data
The services uses pre-defined sample data.
The Subscription data can be extended and is saved in a JSON File ( subscription.json ).

#### subscription.json
```
[{"id":1,"investorId":1,"token":"TRCOF","depositedAmount":900,"subScriptionDate":"2018-04-19T07:36:36.454Z","address":"0x205161cec3b55ca9a5997eeaf983b798d5dc8408"},{"id":2,"investorId":1,"token":"TRCOF","depositedAmount":800,"subScriptionDate":"2018-04-19T07:52:57.953Z","address":"0x205161cec3b55ca9a5997eeaf983b798d5dc8408"},{"id":3,"investorId":1,"token":"TRCOF","depositedAmount":500,"subScriptionDate":"2018-04-19T07:55:19.107Z","address":"0x205161cec3b55ca9a5997eeaf983b798d5dc8408"}]
```

The rest of the data ( master Data) like rates , investors, funds is for now is mock data.

>The structure of the data is defined in the models folder.

>The data is defined in the database folder, a database (for example mongoDb) can be added later to persist the data.


### Services
#### SubscriptionService.js

Service for investors ( or Backoffice) to subscribe for buying OpenFundTokens (can be extended to support other Tokens).

The service implements the following features ( see also the bpmn Process diagramm linked below):

* validate subscription

* add investors to list ( whitelist check is in smart contract)

* add subscription for a fund to subscription list 


#### TokenAssignerService.js

Service to assign the OpenFundTokens to the subscribers according to their deposit (can be extended to support other Tokens).

The service implements the following features ( see also the bpmn Process diagramm linked below):

* call NAV to get the value of the fund in Euro ( mock rates instead of NAV for the first version) and calculate the amount of tokens to be assigned to the investor address

* call smart contract to mint the ERC20 OpenFundtokens 



![SubscriptionService](/images/OpenFundContract_Subscribe_Process_v2.png)
----

## running tests
* mocha and chai framworks are used for testing.
* to start test use:

```
$ npm run test
```

## continous integration 

circleCi is used for continous integration 
configuration file "config.yml" is under the folder ".circleci"

tbd



## installation DEV (locally)
3 Steps are needed :

* Step1: deploy Smart Contract 

* Step2: Install NodeJS  ( only needed on First Run)

* Step3: install & start Server to add subscriptions


### Step1: Blockchain & SmartContracts Deployment
* download SmartContracts from repo

```
https://github.com/trecento-bc/fund-smart-contract
```

* start terminal in the directory of downloaded "fund-smart-contract" project

* check if npm is installed, and install if needed

```
npm version
```

* Install truffle
    
```
npm install -g truffle
```


* Install ganache-cli

```
npm install -g ganache-cli
```
more details under:   https://www.npmjs.com/package/ganache-cli


* start ganache local test Blockchain with prefilled Accounts

```
sh runTestRpc.sh
```


* start another terminal console in the directory of downloaded "fund-smart-contract" project

* deploy smart contracts on Blockchain 

```
truffle deploy
```
> JSON Files for the contracts ( containing the ABI) will be created
under build/contracts

### Step2: Install NodeJS  ( only needed on first Run)

* check if node is installed

```
node --version
```

* install nodeJs ( if needed)

```
download and install from  https://nodejs.org/en/
```



### Step3: install & start Server 

* download the server from this Repo

```
git clone https://github.com/trecento-bc/fund-oracles
```

* install dependencies  ( check package.json)
```
npm install
```


* adpat Smart contract address in config.js

1. cd into the new created directory fund-oracles

```
cd fund-oracles
```

2. set the environment variable "ethereumNode" in "config.js" to one of the values of the "eth-networks" ( development, test , kovan, mainnet..) 

```
//Example ( Snippet from config.js File, edit and save)
..
ethereumNode: {
        net:"development"
    },
```


>all possible values are listed in the file 
fund-oracles/src/utils/eth-networks.json  



* copy the generated JSON contracts files ABI  ( containing the ABI) from
"build/contracts" to the "contracts_api" folder ( this step will be automated in circleCi)


* start server  
```
node server/Server.js
(ONLY for dev  "nodemon server/Server.js" for automatic restart on changes)
```
* start Browser under the defined port in the config js File :

```
//Example ( Snippet from config.js File)
..
 app: {
        host: 'localhost',
        port: 8000
    },
```

* check if server is running under http://[ trecento server name]:8000

## Installation TEST ( Kovan Network)
### Server 
tbd

### Blockchain & SmartContracts 
tbd


## Installation mainNet
### Server 
tbd

### Blockchain & SmartContracts main-net
tbd
