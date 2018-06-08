
/**
 *   Server Console
 *   Simple Web Console to start Services and manage Master Data
 *
 */

const joi = require('joi');
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const config = require('./config');
app.use(express.json());
global.filePath = path.resolve(__dirname)

//routes
var investorRoutes = require('../src/routes/investors');
var fundRoutes = require('../src/routes/funds');
var rateRoutes = require('../src/routes/rates');
var subscriptionRoutes = require('../src/routes/subscriptions');
var tokenAssignmentRoutes = require('../src/routes/tokenAssignment');

const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
// cross origin options
const cors = require('cors')

var corsOptions = {
  origin: config.app.host,
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
  var addSubcriptionsUrl = '<a href="' + req.protocol + '://' + req.get('host') + '/form' + '">Add Subcription</a>';
  var assignOpenFundTokenUrl = '<a href="' + req.protocol + '://' + req.get('host') + '/api/assignOpenFundTokens' + '">Assign OpenFundTokens to Subscribers</a>';

  res.send('<h1>Service Console</h1> <br><h2>Subscription Service</h2><ul><li>' + addSubcriptionsUrl + '</li><li>' + getSubcriptionsUrl + '</li></ul><br><hr><h2>OpenFundToken Assignment</h2><ul><li>' + assignOpenFundTokenUrl + '</li></ul><br><hr><h2>Master data</h2><ul> <li>' + getInvestorsUrl + '</li><li>' + getFundsUrl + '</li><li>' + getratesUrl + '</li><br></ul>');

});

  // add Subscription router

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

//  Subscription list router
app.use('/api',
  function (req, res, next) {
    next();
  }
  , subscriptionRoutes);

//  Assign Tokens router

app.use('/api',
  function (req, res, next) {
    next();
  }
  , tokenAssignmentRoutes);


// Master Data routers
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



const port = config.app.port;
app.listen(port, () => {
  console.log(`Server started on ${port}!`);
});

module.exports = app