const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

var urlencodedParser = bodyParser.urlencoded({ extended: true });

var SubscriptionService = require('../../server/SubscriptionService');

// subscriptions to invest  ( get, list, add, delete )
router.get('/subscriptions/:id', function (req, res) {
  var subscriptions = SubscriptionService.getSubscriptions();
  const subscription = subscriptions.find(arg => arg.id === parseInt(req.params.id));
  if (!subscription) {
    res.status(404).send('subscription not found');
  } else {
    res.send(subscription);
  }
});

router.get('/subscriptions', function (req, res) {
  var subscriptions = SubscriptionService.getSubscriptions();
  res.send(subscriptions);
});

router.post('/subscriptions', urlencodedParser,  function (req, res) {
  //Set web3 Provider
  SubscriptionService.setWeb3Provider(req.web3);
  // add Subscription 
  const ret = SubscriptionService.addSubscription(req);
  if (ret && Object.prototype.toString.call(ret) === "[object object]") {
    res.send(ret);
  } else if (ret) {
    //error
    console.log (Object.prototype.toString.call(ret));
    res.status(400).send(ret);
  } else {
    console.log (`ret :${ret}`);
    //error
    res.status(400).send('subscription could not be added');  
  }

});

router.delete('/subscriptions', function (req, res) { });

module.exports = router;
