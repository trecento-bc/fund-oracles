/**
 * Subscription Service.
 *
 *
 *   Service pour la gestion entrée des investisseurs :
 * - les investisseurs peuvent acheter des parts uniquement dans une des monnaies de la NAV
 * - Service pour récolter la liste des investisseurs et les montants 
 * - Ce service sera appelé manuellement pour les investisseurs en EUR
 * - Reprise du service qui fait la liste agrégée par contributeur et le 
 * - modifier pour qu’il envoie cette liste au service de récolte
 * - Juste après le calcul de la NAV, les tokens sont distribués selon la valeur du moment
 * 
 */

const joi = require('joi');
const express = require('express');
const app = express();
app.use(express.json());
var schedule = require('node-schedule');


//Database
var InvestorRepository = require('../src/database/InvestorRepository');
var FundRepository = require('../src/database/FundRepository');
var RateRepository = require('../src/database/RateRepository');
var SubscriptionRepository = require('../src/database/SubscriptionRepository');

// Retrieve Data
const InvestorRepositoryInstance = new InvestorRepository()
const investors = InvestorRepositoryInstance.findAll();

const FundRepositoryInstance = new FundRepository()
const funds = new FundRepository().findAll();

const SubscriptionRepositoryInstance = new SubscriptionRepository()
const subscriptions = SubscriptionRepositoryInstance.findAll();

const RateRepositoryInstance = new RateRepository()
const rates = RateRepositoryInstance.findAll();
let web3;

// Call Job to assign tokens for the new subscribers daily on 18:00
var j = schedule.scheduleJob('18 * * *', function () {
  subscriptions.forEach(subscription => {
    assignOpenFundToken(subscription);
  });
});

/**
 * set web3 provider 
 *
 * @param {Subscription}   subscription
 * @param {web3}   web3 instance
 * 
 */

function setWeb3Provider(value) {
  web3 = value;
}

/**
 * Add Subscription for OpenFundTokens
 *
 *  investor Subscription to subscribe for buying shares (OpenFundTokens)
 * 
 * @param {Subscription}   subscription
 * 
 * @return
 *   subscription object in success case and a string with error message 
 *  in error case
 */
function addSubscription(req) {
  var ret = null;
  console.log(req.body);
  const subscription = {
    id: subscriptions.length + 1,
    investorId: parseInt(req.body.investorId),
    token: req.body.token,
    quantity: parseInt(req.body.quantity),
    subScriptionDate: new Date()
  };
  const result = validateSubscription(subscription);
  console.log(result);
  if (!result) {
    var investor = investors.find(arg => arg.id === subscription.investorId)

    if (!investor) {
      // add investor if not yet existing
      investor = addInvestorCandidate(investor);
    }
    console.log(`investor:${investor}`);
    if (investor) {
      SubscriptionRepositoryInstance.save(subscription);
      // TODO : assignOpenFundToken call should be scheduled only once a day
      assignOpenFundToken(subscription);
      return subscription;
    }
  } else {
    // error
    ret = result;
  }
  return ret;
}



/**
 * Subscription Validation
 *
 *  validate input data and returns message in error case
 * 
 * @param {Subscription}   subscription
 * 
 * @return
 *   String with message of validation
 */

function validateSubscription(subscription) {

  var errorMessage = null;
  const schema = {
    id: joi.allow(),
    investorId: joi.number().required(),
    token: joi.string().min(3).required(),
    quantity: joi.number().greater(0).required(),
    subScriptionDate: joi.allow()
  };
  const result = joi.validate(subscription, schema);
  if (result.error) {
    return result.error.details[0].message;
  }
  const investor = investors.find(arg => arg.id === parseInt(subscription.investorId))
  if (!investor) {
    return 'investor not found';
  }
  const fund = funds.find(arg => arg.token === subscription.token);
  if (!fund) {
    return 'fund/token not found';
  }
  return errorMessage
}

/**
 * Add Investor to Investor list
 *
 *  Add Investor to Investor list
 * 
 * @param {Investor}   investor
 * @param {Investor[]}   investors
 * 
 * @return
 *   investor 
 */
function addInvestorCandidate(investor) {
  InvestorRepositoryInstance.save(investor);
  return investor;
}

/**
 * Returns the value of the given token widget.
 *
 * call NAV to get the token value in Euro
 * 
 * @param {String}   token Name
 * 
 * @return
 *   The value of the token as uint
 */
function getNavValuationsInEuro(token) {
  // Mock data
  const euroValue = 100;
  return euroValue;
}

/**
 * Returns the Amount of ethers.
 *
 * Amount of ether for the given euroValue
 * 
 * @param {integer}   assetValue        .
 * @return
 *   ether amount
 */
function etherAmount(euroValue) {
  // Mock data
  var amount = 10;
  return amount;
}


/**
 * Returns the transaction reciept.
 *
 * Calls OpenFundToken Smart contract and Transfer Ether to buy tokens for 
 * all subscribed investors
 * 
 * @param {Subscription}   subscription        .
 * @return
 *   transactionReciept
 */
function assignOpenFundToken(subscription) {
  // declare contract 
  const OpenFund_json = require('../contracts_api/OpenFundToken.json');
  abi = OpenFund_json.abi;
  console.log(abi);
  //TODO: just for test , fix address at local chain ( ganache)
  console.log("***Instantiate OpenFundToken****");
  var contractInstance = new web3.eth.Contract(abi, '0xef03118e3e60d9003b6c622a2e94c39ebb6985f2', {
    from: '0x0f21f6fb13310ac0e17205840a91da93119efbec', // account 0
    gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
  });

  var accounts;
  var accountFrom;
  var accountTo;

  if (subscription) {
    console.log(subscription);
    // token value in Euro  
    const euroValue = getNavValuationsInEuro(subscription.token);
    console.log(euroValue);
    //convert euroValue to ether
    const valueInEther = etherAmount(euroValue);
    //const valueInWei = web3.toWei(valueInEther, 'ether');
    console.log(valueInEther);
    // Get the accounts 
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        console.log("There was an error fetching accounts.");
        return;
      }

      if (accs.length == 0) {
        console.log("Couldn't get any accounts! Make sure  Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      accountFrom = accounts[0];
      console.log(`accountFrom: ${accountFrom}`);
      accountTo = accounts[1];
      console.log(`accountTo: ${accountTo}`);

      console.log(`contractInstance: ${contractInstance}`);
      console.log(contractInstance.options.address);


      // Check Token balance of accountFrom Before
      web3.eth.call({
        to: contractInstance.options.address,
        data: contractInstance.methods.balanceOf(accountFrom).encodeABI()
      }).then(balance => {
        console.log('balance of accountFrom: ', balance);

      }).catch((err) => {
        console.log(err);
      });

      // Check Token balance of accountTo Before
      web3.eth.call({
        to: contractInstance.options.address,
        data: contractInstance.methods.balanceOf(accountTo).encodeABI()
      }).then(balance => {
        console.log('balance of accountTo Before: ', balance);

      }).catch((err) => {
        console.log(err);
      });
    
      // dry Run, Transfer tokens to accountTo 
      web3.eth.call({
        to: contractInstance.options.address,
        data: contractInstance.methods.transfer(accountTo, 1 ).encodeABI()
      }).then(balance => {
        console.log('balance of accountTo: ', balance);

      }).catch((err) => {
        console.log(err);
      });


       // sendTransaction, Transfer tokens to accountTo 

      web3.eth.sendTransaction({
        to: contractInstance.options.address,
        data: contractInstance.methods.transfer(accountTo, 1 ).encodeABI()
      }).then(reciept => {
        console.log('TRX reciept: ', reciept);

      }).catch((err) => {
        console.log(err);
      });

       // Check Token balance of accountTo After
       web3.eth.call({
        to: contractInstance.options.address,
        data: contractInstance.methods.balanceOf(accountTo).encodeABI()
      }).then(balance => {
        console.log('balance of accountTo After: ', balance);

      }).catch((err) => {
        console.log(err);
      });

    });




  }
}

/**
 * Returns all subscriptions.
 * @return
 *   Subscription[]
 */
function getSubscriptions() {
  return subscriptions;
}

/**
 * Returns all rates.
 * @return
 *   Rate[]
 */
function getRates() {
  return rates;
}

/**
 * Returns all Investors.
 * @return
 *   Investor[]
 */
function getInvestors() {
  return investors;
}

/**
 * Returns all funds.
 * @return
 *   Fund[]
 */
function getFunds() {
  return funds;
}


module.exports = {
  setWeb3Provider: setWeb3Provider,
  validateSubscription: validateSubscription,
  addSubscription: addSubscription,
  getSubscriptions: getSubscriptions,
  getRates: getRates,
  getFunds: getFunds,
  getInvestors: getInvestors
};
