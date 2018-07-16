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
const utils = require('../src/utils/ethereum-functions.js');
const networks = require('../src/utils/eth-networks');
app.use(express.json());
var schedule = require('node-schedule');
var BigNumber = require('bignumber.js');
var Web3 = require('web3');
var web3;
var SubscriptionRepository = require('../src/database/SubscriptionRepository');
var SubscriptionRepositoryInstance = new SubscriptionRepository()
var subscriptions = [];

const LocalProvider = require('web3-local-signing-provider');
var subscriberAccounts = [];
var ethereumNodeNet = config.ethereumNode.net;
var ethereumNodeURL = networks[ethereumNodeNet].addr;
var ethereumNodeId = networks[ethereumNodeNet].id;


// Schedule distribuion of tokens

function scheduleDaily() {
  // Call Job to assign tokens for the new subscribers daily on 18:00
  var j = schedule.scheduleJob('18 * * *', function () {
    assignOpenFundToken()
  });
}

// distribute tokens for a ALL Subscriptions

async function assignOpenFundToken() {
  var minterAccountKey = config.openFundTokenContract.ownerKey;
  // init Web3
  web3 = await utils.getWeb3(ethereumNodeNet, minterAccountKey);
  var OpenFund_json = await utils.getContractJson("OpenFundToken");
  abi = OpenFund_json.abi;
  const openFundTokenContractAddress = OpenFund_json.networks[ethereumNodeId].address;
  console.log("openFundTokenContractAddress:", openFundTokenContractAddress);
  console.log("****************  ********************** ****");
  console.log("Instantiate OpenFundToken");
  var contractInstance = await utils.getDeployedInstance("OpenFundToken", openFundTokenContractAddress)
  var results = assignOpenFundTokenForAllSubscriptions(contractInstance, web3);

}


/**
 * assignOpenFundTokenForAllSubscriptions
 *
 * Calls OpenFundToken Smart contract and Transfer Ether to buy tokens for 
 * all subscribed investors
 * 
 * @param {contractInstance}   Token smart contract 
 * @param {web3}   web3       .
 *
 */

function assignOpenFundTokenForAllSubscriptions(contractInstance, web3) {
  var accounts;
  var accountFrom;
  var accountTo;
  let results = [];
  // Get minter Account
  accountFrom = config.openFundTokenContract.minterAccount;
  console.log(`Minter Account : ${accountFrom}`);

  SubscriptionRepositoryInstance.findAll().then(
    function (result) {
      subscriptions = result
      subscriptions.forEach(async (subscription) => {
        assignOpenFundTokenForSingleSubscription(subscription, contractInstance, web3)
      });
    });
  return results;
}


/**
 * assignOpenFundTokenForSingleSubscription
 *
 * Calls OpenFundToken Smart contract and Transfer Ether to buy tokens for 
 * a single Subscription
 * 
 * @param {Subscription}   subscription   
 * @param {contractInstance}   Token smart contract     .
 *
 */

async function assignOpenFundTokenForSingleSubscription(subscription, contractInstance, web3) {
  var accounts;
  var accountFrom;
  var accountTo;
  let results = [];
  // Get minter Account
  accountFrom = config.openFundTokenContract.minterAccount;
  console.log(`Minter Account : ${accountFrom}`);
  accountTo = subscription.address;
  console.log(`Subscriber Account: ${accountTo}`);
  // token value in Euro  
  const euroValue = getNavValuationsInEuro(subscription.token);
  const decimalPrecision = 18; // TODO: read from contractInstance.decimals;
  const amountOfTokens = subscription.depositedAmount / euroValue;
  console.log('amount Of Tokens :', amountOfTokens);
  //Amount to send in decimal
  var weiAmountOfTokens = amountOfTokens * (10 ** decimalPrecision);
  console.log('weiAmountOfTokens Of Tokens:', weiAmountOfTokens);
  //Amount to send as BigNumber
  var amountToSendTokens = new BigNumber(weiAmountOfTokens);
  console.log('amountToSendTokens to be assigned:', amountToSendTokens);

  let initialBalance = await contractInstance.methods.balanceOf(accountFrom).call();
  console.log('initialBalance:', initialBalance);
  //let result = await web3.eth.sendTransaction({ to: contractInstance.options.address, data: contractInstance.methods.mintFor(accountTo, amountToSendTokens).encodeABI() });
  let result = await contractInstance.methods.mintFor(accountTo, amountToSendTokens).send();
  results.push(result);
  let afterMintBalance = await contractInstance.methods.balanceOf(accountTo).call({ from: accountFrom, gas: 300000 });
  console.log('afterMintBalance:', afterMintBalance);
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
  assignOpenFundTokenForSingleSubscription: assignOpenFundTokenForSingleSubscription,
  assignOpenFundTokenForAllSubscriptions: assignOpenFundTokenForAllSubscriptions,
  assignOpenFundToken: assignOpenFundToken

}; 