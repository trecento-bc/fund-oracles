const joi = require('joi');
const express = require('express');
const app = express();
const fs = require('fs');
app.use(express.json());
var Web3 = require('web3');

var web3;
let web3Found = false
// Checking if Web3 has been injected by the browser (Mist/MetaMask)
if (typeof web3 !== 'undefined') {
  // Use Mist/MetaMask's provider (Chrome)
  web3Found = true
  web3 = new Web3(web3.currentProvider)
} else {
  // TODO: Fall back to local node ( or https://mainnet.infura.io/ )
  web3Found = false
  web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8544'));
}

console.log('Eth Node Version: ', web3.version.node);
console.log("Network: " ,web3.version.network, web3.version.ethereum);
console.log('Connected to : ', web3.currentProvider);

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