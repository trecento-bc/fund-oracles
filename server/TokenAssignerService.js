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
const config = require('./config');
app.use(express.json());
var schedule = require('node-schedule');
var Web3 = require('web3');
var web3;
var SubscriptionRepository = require('../src/database/SubscriptionRepository');
var SubscriptionRepositoryInstance = new SubscriptionRepository()
var subscriptions = [];

const LocalProvider = require('web3-local-signing-provider');
var subscriberAccounts = [];


/**
 * initWeb3LocalProvider
 *
 * Get the List of Subscriptions and build sorted array with traget accounts
 *
 */
function initWeb3LocalProvider() {
  const { ethereumNode: { host, port } } = config;
  const connectionString = `http://${host}:${port}`;

  // Get the Minter Account
  var minterAccount = config.openFundTokenContract.minterAccount;
  var minterAccountKey = config.openFundTokenContract.ownerKey;

  //get all Subscriber Accounts and their resp. keys
  return SubscriptionRepositoryInstance.findAll().then(
    function (result) {
      subscriptions = result
      var i = 1;
      subscriptions.forEach(subscription => {
        subscriberAccounts[i] = subscription.address;
        i++;
      });
      // instantiate LocalProvider (from "web3-local-signing-provider") 
      // using configured geth node and array of signing keys 
      const provider = new LocalProvider(minterAccountKey,
        new Web3.providers.HttpProvider(connectionString));
      return provider.web3;
    });

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
    function (result) {
      web3 = result;
      // declare contract 
      //TODO : JSON from Build Folder
      const OpenFund_json = require('../contracts_api/OpenFundToken.json');
      abi = OpenFund_json.abi;
      console.log("***Instantiate OpenFundToken****");
      //TODO Get contract adress from JSON ( Build Folder) instead of config File
      var contractInstance = new web3.eth.Contract(abi, config.openFundTokenContract.contractAddress, {
        from: config.openFundTokenContract.minterAccount
      });
      assignOpenFundTokenForSubscription(subscriptions, contractInstance, web3);
    }
  );

}


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

function assignOpenFundTokenForSubscription(subscriptions, contractInstance, web3) {
  var accounts;
  var accountFrom;
  var accountTo;

  if (subscriptions) {

    // Get minter Account
    accountFrom = config.openFundTokenContract.minterAccount;
    console.log(`accountFrom: ${accountFrom}`);

    var callback = function (err, r) {
      if (err) {
        console.log(err);
      } else {
        console.log(r);
      }

    };
    var batch = new web3.BatchRequest();

    subscriptions.forEach(subscription => {
      accountTo = subscription.address;
      console.log(`accountTo: ${accountTo}`);

      // token value in Euro  
      const euroValue = getNavValuationsInEuro(subscription.token);
      // Calculate number of tokens to be assigned 
      // TODO: use bignumber.js ( npm package), and decimal 1e18 ( as in token contract)
      const amountOfTokens = subscription.depositedAmount / euroValue;
      //TODO round up , amount of token to uint
      console.log('amountOfTokens:', amountOfTokens);
      batch.add(contractInstance.methods.balanceOf(accountFrom).call.request({ from: accountFrom, gas: 300000 }, callback));
      batch.add(contractInstance.methods.balanceOf(accountTo).call.request({ from: accountFrom, gas: 300000 }, callback));
      //TODO : MINTFOR not Transfer
      batch.add(web3.eth.sendTransaction.request({ to: contractInstance.options.address, data: contractInstance.methods.transfer(accountTo, amountOfTokens).encodeABI() }, callback));
      batch.add(contractInstance.methods.balanceOf(accountTo).call.request({ from: accountFrom, gas: 300000 }, callback));
    });
    batch.execute();

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
  const euroValue = 1;
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
  var amount = "1";
  return amount;
}



module.exports = {
  assignOpenFundToken: assignOpenFundToken

}; 