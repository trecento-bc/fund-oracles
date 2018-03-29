const joi = require('joi');
const express = require('express');
const app = express();
app.use(express.json());
var Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

var investorRoutes = require('../src/routes/investors');
var fundRoutes = require('../src/routes/funds');
var rateRoutes = require('../src/routes/rates');
var subscriptionRoutes = require('../src/routes/subscriptions');

//var models = require('../src/models')

const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
// cross origin options
const cors = require('cors')

var corsOptions = {
  origin: 'localhost',  
  optionsSuccessStatus: 200 // for old brwosers
}
app.use(cors(corsOptions))

// home
app.get('/', (req,res) =>{
  res.send ('Welcome to Subscription Service')
});

// Mock Data
const investors = [  {id: 1, firstName: 'Jane', lastName:'Doe'}];
const funds = [  { token: 'TRCOF', name: 'openfund'}];
const subscriptions = [  { id:1, investorId: 1, token: 'TRCOF', quantity:2, subScriptionDate:'2018-03-28T15:09:16Z' }];
const rates = [{  token: 'TRCOF' , valueInEther: 1 }];

// Routing  
app.use ('/api', 
  function (req, res, next) {
    req.investors = investors;
    next();
  }
  ,investorRoutes);

app.use ('/api', 
  function (req, res, next) {
    req.funds = funds;
    next();
  }
,fundRoutes);

app.use ('/api', 
  function (req, res, next) {
    req.rates = rates;
    next();
  }
,rateRoutes);

app.use ('/api', 
  function (req, res, next) {
    req.investors = investors;
    req.funds = funds;
    req.rates = rates;
    req.subscriptions = subscriptions;
    next();
  }
,subscriptionRoutes);

// Start Server on PORT ( example, export PORT = 3000)
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server started on ${port}!`);
  });

