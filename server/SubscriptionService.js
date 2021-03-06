/**
 * Subscription Service.
 *   Service pour la gestion entrée des investisseurs :
 * - Service pour récolter la liste des investisseurs et les montants 
 * - Ce service sera appelé manuellement pour les investisseurs en EUR
 * - Reprise du service qui fait la liste agrégée par contributeur et le 
 * 
 */

const joi = require('joi');
const express = require('express');
const app = express();
const config = require('./config');
app.use(express.json());


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

var SubscriptionRepositoryInstance = new SubscriptionRepository()
var subscriptions = [];


const RateRepositoryInstance = new RateRepository()
const rates = RateRepositoryInstance.findAll();

/**
 * Add Subscription for OpenFundTokens
 *
 *  investor Subscription to subscribe for buying shares (OpenFundTokens)
 * 
 * @param {Subscription}   subscription
 * @param {list}   list of all subscriptions
 * 
 * @return
 *   subscription object in success case and a string with error message 
 *  in error case
 */
function addSubscription(req, list) {
  var ret = null;
  const subscription = {
    id: list.length + 1,
    investorId: parseInt(req.body.investorId),
    token: req.body.token,
    depositedAmount: parseInt(req.body.depositedAmount),
    subScriptionDate: new Date(),
    address:req.body.address
  };
  const result = validateSubscription(subscription);
  if (!result) {
    var investor = investors.find(arg => arg.id === subscription.investorId)

    if (!investor) {
      // add investor if not yet existing
      investor = addInvestorCandidate(investor);
    }
    if (investor) {
      SubscriptionRepositoryInstance.save(subscription);
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
    depositedAmount: joi.number().greater(0).required(),
    subScriptionDate: joi.allow(),
    address:joi.string().min(20).required()
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
 * Returns all subscriptions.
 * @return
 *   Subscription[]
 */
function getSubscriptions() {
  return SubscriptionRepositoryInstance.findAll();
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
  validateSubscription: validateSubscription,
  addSubscription: addSubscription,
  getSubscriptions: getSubscriptions,
  getRates: getRates,
  getFunds: getFunds,
  getInvestors: getInvestors
};
