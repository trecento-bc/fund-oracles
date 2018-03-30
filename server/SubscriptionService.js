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
function addSubscription(subscription,investors){
  var transactionReciept = null;
  const result = SubscriptionService.validateSubscription(req.body);
  if(!result.error){
    const investor = investors.find(arg => arg.id === subscription.investorId)
    if(!investor){
        // add investor if not yet existing
        investor = addInvestorCandidate(investor, investors);
     }
     if (investor){
       // call NAV for Asset Value 
       const assetValue = getNavValuations(subscription.token);
       //calculate token Amount
       const resultAmount = calculateTokenAmount(assetValue);
       // Call Smartcontract
       transactionReciept = mintOpenFundToken(subscription);
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
function mintOpenFundToken(subscription){
  //Mock data
  var transactionReciept ={
      token: subscription.token
  };
  return transactionReciept;
}

module.exports = {
  validateSubscription: validateSubscription,
  addSubscription: addSubscription
};
