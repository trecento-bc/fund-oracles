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


// Call Job to assign tokens for the subscribers daily on 18:00
var j = schedule.scheduleJob('18 * * *', function(){
  assignOpenFundToken();
});

/**
 * Add Subscription for Fund
 *
 *  investor Subscription to buy funds shares ( tokens)
 * 
 * @param {Subscription}   subscription
 * @param {investors[]}   investors
 * 
 * @return
 *   transactionReciept in success case and null in error case
 */
function addSubscription(subscription,investors, web3){
  console.log("addSubscription");
  // declare contract 
  const OpenFund_json  = require ('../contracts_api/OpenFundToken.json');
  abi = OpenFund_json.abi;
  console.log(abi);
  var contractInstance = new web3.eth.Contract(abi, '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe');
  var accounts;
  var account;

  var transactionReciept = null;
  const result = validateSubscription(subscription);
  if(!result.error){
    const investor = investors.find(arg => arg.id === subscription.investorId)
    if(!investor){
        // add investor if not yet existing
        investor = addInvestorCandidate(investor, investors);
     }
     if (investor){
       console.log(investor);
       // call NAV for Asset Value 
       const assetValue = getNavValuations(subscription.token);
       console.log(assetValue);
       //calculate token Amount
       const resultAmount = calculateTokenAmount(assetValue);
       console.log(resultAmount);
       // Call Smartcontract
       transactionReciept = mintOpenFundToken(subscription, contractInstance);
       console.log(transactionReciept);
     }
  }
  return transactionReciept;
}




/**
 * Subscription Validation
 *
 *  Uses joi schemas to validate input data 
 * 
 * @param {Subscription}   subscription
 * 
 * @return
 *   result of validation ( joi)
 */

function validateSubscription(subscription){
   
  const schema ={
    investorId: joi.number().required(),
    token: joi.string().min(3).required(),
    quantity: joi.number().greater(0).required()
  };
  const result = joi.validate(subscription, schema);
  return result;
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
function addInvestorCandidate(investor, investors){
  investors.push (investor);
  return investor;
}

/**
 * Returns the value of the given token widget.
 *
 * call NAV to get the token value
 * 
 * @param {String}   token Name
 * 
 * @return
 *   The value of the token as uint
 */
function getNavValuations(token){
  // Mock data
  const assetValue = 100;
  return assetValue;
}

/**
 * Returns the Amount of tokens.
 *
 * calculate amount of tokens for the transfered Ether.
 * 
 * @param {integer}   assetValue        .
 * @return
 *   The value of the token as uint
 */
function calculateTokenAmount(assetValue){
  // Mock data
  var amount = 10;
  return amount;
}

/**
 * Returns the transaction reciept.
 *
 * Call OpenFundToken Smart contract and Transfer Ether to buy tokens
 * 
 * @param {Subscription}   subscription        .
 * @return
 *   transactionReciept
 */
function mintOpenFundToken(subscription, contractInstance){
  //Mock data
  var transactionReciept ={
      token: subscription.token
  };
  // TODO : sign Transaction manually ( private key needed) 
  // oruse Metamask/localNode
  //contractInstance.transfer();

  return transactionReciept;
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
function assignOpenFundToken(){
 
}


module.exports = {
  validateSubscription: validateSubscription,
  addSubscription: addSubscription
};
