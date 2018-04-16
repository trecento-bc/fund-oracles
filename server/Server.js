const joi = require('joi');
const express = require('express');
const app = express();
const fs = require('fs');
app.use(express.json());
var Web3 = require('web3');
const LocalProvider = require('web3-local-signing-provider'); 
//const LocalProvider = require('../local-provider');

var web3;
// Use LocalProvider (from "web3-local-signing-provider") & configured geth node  
// TODO:  Get url and PORT of geth node form configuration 
// TODO:  Get Private Key for local Providers from KeyStores
const provider = new LocalProvider([
  'fdb2886b1ff5a0e60f9a4684e385aa7b77f064730304143f08ba96ca1a17effa',
  '8d8697970c933b856a02c5c2a9e1ead92b434d6cb724a0635219a1568a4cfd51'
],
new Web3.providers.HttpProvider('http://localhost:8544'));
web3 = provider.web3;

//routes
var investorRoutes = require('../src/routes/investors');
var fundRoutes = require('../src/routes/funds');
var rateRoutes = require('../src/routes/rates');
var subscriptionRoutes = require('../src/routes/subscriptions');

const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
// cross origin options
const cors = require('cors')

var corsOptions = {
  origin: 'localhost',
  optionsSuccessStatus: 200 // for old brwosers
}
app.use(cors(corsOptions))

// home
app.get('/', (req, res) => {
  var homeUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  var getInvestorsUrl = '<a href="' + req.protocol + '://' + req.get('host') + '/api/investors' + '">Investors list </a>';
  var getFundsUrl = '<a href="' + req.protocol + '://' + req.get('host') + '/api/funds' + '">Funds list </a>';
  var getratesUrl = '<a href="' + req.protocol + '://' + req.get('host') + '/api/rates' + '">Rates list </a>';
  var getSubcriptionsUrl = '<a href="' + req.protocol + '://' + req.get('host') + '/api/subscriptions' + '">Subcriptions list </a>';
  var addSubcriptionsUrl = '<a href="' + req.protocol + '://' + req.get('host') + '/form' + '">Add Subcription Form</a>';


  res.send('<h1>Welcome to Subscription Service</h1> <br><ul><li>' + getInvestorsUrl + '</li><li>' + getFundsUrl + '</li><li>' + getratesUrl + '</li><li>' + getSubcriptionsUrl + '</li><br><li>' + addSubcriptionsUrl + '</li></ul>');

});



// Routing  
app.use('/api',
  function (req, res, next) {
    next();
  }
  , investorRoutes);

app.use('/api',
  function (req, res, next) {
    next();
  }
  , fundRoutes);

app.use('/api',
  function (req, res, next) {
    next();
  }
  , rateRoutes);

app.use('/api',
  function (req, res, next) {
    req.web3 = web3;
    next();
  }
  , subscriptionRoutes);

  // open Form
  
  app.get('/form', function(req, res) {
    fs.readFile('./server/form.html', function(error, content) {
        if (error) {
          console.log(error);
            res.writeHead(500);
            res.end();
        }
        else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
        }
    });
});


// Start Server on PORT ( example, export PORT = 3000)
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server started on ${port}!`);
});

module.exports = {
  app: app

}; 