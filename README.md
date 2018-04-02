# TrecentoServicesProject

This project contains the services which will be used as middleware for the trecento Platform.

The project is implemented in nodejs using the express framework, and will host all the needed backend services for the platform.

The Services use the web3 JS libray to commuicate with smart contracts.

This project doesn't use truffle. 

## Details



### Server.js
A test restful http-server to allow calling the services from the browser to display subscriptions or added investors ( GET requests).

* Example to Get existing subscriptions 
```
http://localhost:8000/api/subscriptions

```
![Server](/images/server_home.png)

POST requests can be send using "Postman" tool.

* Example to POST new subscriptions 

![addSubscription](/images/postman_addSubscription.png)
----

The test server will be extended with simple forms to allow POST /PUT/ Delete without the need of POSTMAN.

### Models & Database

The model and the data used in the services is defined in the models und the database classes under the following Folders:
* models
* database

### Data
the services uses mock data which is not persisted.
The data will be lost bewteen the restarts of the services.

>The structure of the data is defined in the models folder.

>The data is defined in the database folder, a database (for example mongoDb) can be added later to persist the data.


Example:
```
const investors = [  {id: 1, firstName: 'Jane', lastName:'Doe'}];
const funds = [  { token: 'TRCOF', name: 'openfund'}];
const subscriptions = [  { id:1, investorId: 1, token: 'TRCOF', quantity:2, subScriptionDate:'2018-03-28T15:09:16Z' }];
```


### SubscriptionService.js

Service for investors to subscribe for buying OpenFundTokens (can be extended to support other Tokens).

The service implements the following features ( see also the bpmn Process diagramm linked below "OpenFundContract_Subscribe_Process.bpmn":

* validate subscription

* add investors to list ( whitelist check is in smart contract)

* add subscription for a fund to subscription list 

* call NAV to calculate the value of the fund in Euro ( mock rates instead of NAV for the first version) and convert euro value to Ether

* call smart contract to transfer ether in exchange of the ERC20 OpenFund tokens 


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

### Server 
* install nodeJs

```
download and install from  https://nodejs.org/en/
```

* install dependencies  ( check package.json)
```
npm install
```

* start server  
```
node server/Server.js
```
* start Browser under Default port 8000
or set other Port in the termina with the command
```
mac: export PORT=XXXX
Windows: set PORT=XXXX
```
Example:

![SubscriptionService](/images/localhost.png)


### Blockchain & SmartContracts  DEV
* download SmartContracts from Bitbucket repo

```
https://bitbucket.org/mobh/trecentoproject
```
* start ganache local test Blockchain with prefilled Accounts

```
sh runTestRpc.sh
```

* deploy smart contracts on Blockchain

```
truffle deploy
```

* copy smart "contract address" (see example in screenshot below) into "SubscriptionRepository.js" code:

![truffle deploy](/images/truffleDeploy.png)

Replace XXX with copied "contract address" in the following code:

```
var contractInstance = new web3.eth.Contract(abi,'XXXXX'
```
>This manual step will be replaced by setting ENV variables in a build script, or doing it analog to truffle 


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

