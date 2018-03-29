const joi = require('joi');
const express = require('express');
const app = express();
app.use(express.json());



function validateSubscription(subscription){
    // Validate input data
  const schema ={
    investorId: joi.number().required(),
    token: joi.string().min(3).required(),
    quantity: joi.number().greater(0).required()
  };
  const result = joi.validate(subscription, schema);
  return result;
} 

function addInvestorCandidate(subscription){

}

function getNavValuations(subscription){
  // call Nav to get Assets values 
}

function calculateTokenAmount(subscription){
  // calculate Amount of token for the transfered Ether
}

function mintOpenFundToken(subscription){
  // Call OpenFundToken Smart contract and Transfer Ether
  
}




module.exports = {
  validateSubscription: validateSubscription
};