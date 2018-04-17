/**
 * TokenAssigner Service.
 * - les investisseurs peuvent acheter des parts uniquement dans une des monnaies de la NAV
 * - Juste après le calcul de la NAV, les tokens sont distribués selon la valeur du moment
 * 
 */
const joi = require('joi');
const express = require('express');
const app = express();
const fs = require('fs');
app.use(express.json());
var schedule = require('node-schedule');
var Web3 = require('web3');
var web3;
var SubscriptionRepository = require('../src/database/SubscriptionRepository');
var SubscriptionRepositoryInstance = new SubscriptionRepository()
var subscriptions = [];

const LocalProvider = require('web3-local-signing-provider');
var subscriberAccounts = [];
var subscriberKeys = [];

/**
 * initWeb3LocalProvider
 *
 * Get the List of Subscriptions and build sorted array with hexPrivateKeys
 *
 */
function initWeb3LocalProvider() {
 
  //TODO First Account is the Default Owner Account
  //TODO:  Get Private Key for local Providers from KeyStores
  subscriberAccounts[0] = "0x0f21f6fb13310ac0e17205840a91da93119efbec";
  subscriberKeys[0] = "fdb2886b1ff5a0e60f9a4684e385aa7b77f064730304143f08ba96ca1a17effa";

  //get Subscriber Accounts and keys
  SubscriptionRepositoryInstance.findAll().then(
    function (result) {
      subscriptions = result
      var i = 1;
      subscriptions.forEach(subscription => {
        subscriberAccounts[i] = subscription.address;
        subscriberKeys[i] = subscription.hexPrivateKey;
        i++;
      });
      // Use LocalProvider (from "web3-local-signing-provider") & configured geth node  
      // TODO:  Get url and PORT of geth node form configuration 
      const provider = new LocalProvider(subscriberKeys,
        new Web3.providers.HttpProvider('http://localhost:8544'));
       web3 = provider.web3;
       //console.log('web3:', web3);
    });
  return Promise.resolve();
}

// Schedule distribuion of tokens

function scheduleDaily() {
  // Call Job to assign tokens for the new subscribers daily on 18:00
  var j = schedule.scheduleJob('18 * * *', function () {
    assignOpenFundToken()
  });
}

// distribute tokens for a ALL Subscriptions

function assignOpenFundToken() {
  // init Web3
  initWeb3LocalProvider().then(
    function () {
      // declare contract 
      const OpenFund_json = require('../contracts_api/OpenFundToken.json');
      abi = OpenFund_json.abi;
      //console.log(abi);
      //TODO: configure the address of the contract ( now is  local address on local chain ganache)
      console.log("***Instantiate OpenFundToken****");
      var contractInstance = new web3.eth.Contract(abi, '0xef03118e3e60d9003b6c622a2e94c39ebb6985f2', {
        from: '0x0f21f6fb13310ac0e17205840a91da93119efbec', // account 0
        gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
      });
      subscriptions.forEach(subscription => {
        assignOpenFundTokenForSubscription(subscription, contractInstance, web3);
      });

    }
  );

}

// distribute tokens for a single Subscription

/**
 * assignOpenFundTokenForSubscription
 *
 * Calls OpenFundToken Smart contract and Transfer Ether to buy tokens for 
 * all subscribed investors
 * 
 * @param {Subscription}   subscription   
 * @param {contractInstance}   Token smart contract     .
 *
 */

function assignOpenFundTokenForSubscription(subscription, contractInstance, web3) {
  var accounts;
  var accountFrom;
  var accountTo;

  if (subscription) {
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
      accountTo = subscription.address;
      console.log(`accountTo: ${accountTo}`);

      console.log(`contractInstance: ${contractInstance}`);
      console.log(contractInstance.options.address);


      // Check Token balance of accountFrom Before
      web3.eth.call({
        to: contractInstance.options.address,
        data: contractInstance.methods.balanceOf(accountFrom).encodeABI()
      }).then(balanceFrom => {
        console.log('balance of accountFrom Before: ', balanceFrom);

      }).catch((err) => {
        console.log(err);
      });

      // Check Token balance of accountTo Before
      web3.eth.call({
        to: contractInstance.options.address,
        data: contractInstance.methods.balanceOf(accountTo).encodeABI()
      }).then(balanceTo => {
        console.log('balance of accountTo Before: ', balanceTo);

      }).catch((err) => {
        console.log(err);
      });

      // sendTransaction, Transfer tokens to accountTo 

      web3.eth.sendTransaction({
        to: contractInstance.options.address,
        data: contractInstance.methods.transfer(accountTo, 1).encodeABI()
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



module.exports = {
  assignOpenFundToken: assignOpenFundToken

}; 