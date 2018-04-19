# TrecentoServicesProject

This project contains the services which will be used as middleware for the trecento Platform.

The project is implemented in nodejs using the express framework, and will host all the needed backend services for the platform.

The Services use the web3 JS libray to commuicate with smart contracts.

This project doesn't use truffle. 

## Details



### Server.js
A test restful http-server to allow calling the services from the browser to display subscriptions, investors, funds and to add new subscriptions through a basic HTML Form.

* Example to Get existing subscriptions 
```
http://localhost:8000/api/subscriptions

```
![Server](/images/server_home.png)

* POST new subscriptions  requests can be send through a Simple Form.


![addSubscription](/images/addSubscription.png)
----


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

The rest of the data ( master Data) like rates , investors, funds is for now mock data.

>The structure of the data is defined in the models folder.

>The data is defined in the database folder, a database (for example mongoDb) can be added later to persist the data.


#### example master data:
```
const investors = [  {id: 1, firstName: 'Jane', lastName:'Doe'}];
const funds = [  { token: 'TRCOF', name: 'openfund'}];
..
```

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

* Step2: adpat Smart contract address in config.js File

* Step3: Install NodeJS  ( only needed on First Run)


* Step4: start Server and add subscriptions


### Step1: Blockchain & SmartContracts Deployment
* download SmartContracts from repo

```
https://github.com/trecento-bc/fund-smart-contract
```

* start terminal in the directory of downloaded "fund-smart-contract" project



* start ganache local test Blockchain with prefilled Accounts

```
sh runTestRpc.sh
```


* start another terminal console in the directory of downloaded "fund-smart-contract" project

* deploy smart contracts on Blockchain 

```
truffle deploy
```

### Step2: adpat Smart contract address in config
* copy smart "contract address" (see example in screenshot below) into config.js File:

![truffle deploy](/images/truffleDeploy.png)

Adapt openFundTokenContract "contractAddress" with copied in the config.js File:

```
//Example ( Snippet from config.js File)
..
openFundTokenContract: {
        contractAddress: '0xabcaffd96f3af726faca423705f036e55d497190',
       ...
    }
```
>This manual step will be replaced by setting ENV variables in a build script, or doing it analog to truffle 

### Step3: Install NodeJS  ( only needed on First Run)
* install nodeJs

```
download and install from  https://nodejs.org/en/
```

* install dependencies  ( check package.json)
```
npm install
```

### Step3: start Server 

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



## Security Aspects
tbd

## Installation TEST
### Server 
tbd

### Blockchain & SmartContracts Rinkeby
tbd


## Installation PROD
### Server 
tbd

### Blockchain & SmartContracts main-net
tbd

