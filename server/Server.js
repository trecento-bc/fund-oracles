const joi = require('joi');
const express = require('express');
const app = express();
app.use(express.json());
var Web3 = require('web3');

var web3 ;
let web3Found = false
// Checking if Web3 has been injected by the browser (Mist/MetaMask)
if (typeof web3 !== 'undefined') {
  // Use Mist/MetaMask's provider (Chrome)
  web3Found = true
  web3 = new Web3(web3.currentProvider)
} else {
  // TODO: Fall back to local node ( or https://mainnet.infura.io/ )
  web3Found = false
  web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
}

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
  var homeUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  var getInvestorsUrl = '<a href="'+req.protocol + '://' + req.get('host') + '/api/investors'+'">Investors list </a>';
  var getFundsUrl = '<a href="'+req.protocol + '://' + req.get('host') + '/api/funds'+'">Funds list </a>';
  var getratesUrl = '<a href="'+req.protocol + '://' + req.get('host') + '/api/rates'+'">Rates list </a>';
  var getSubcriptionsUrl = '<a href="'+req.protocol + '://' + req.get('host') + '/api/subscriptions'+'">Subcriptions list </a>';
  
  res.send ('<h1>Welcome to Subscription Service</h1> <br><ul><li>'+getInvestorsUrl + '</li><li>'+getFundsUrl + '</li><li>'+getratesUrl + '</li><li>'+getSubcriptionsUrl + '</li></ul><br><b>Note:</b> to Subscribe for buying <b>OpenFund</b> Tokens, Please check details in <b>README.md</b> File ');

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
    req.web3= web3;
    next();
  }
,subscriptionRoutes);

// Start Server on PORT ( example, export PORT = 3000)
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server started on ${port}!`);
  });

  module.exports = {
    app : app

  }; 