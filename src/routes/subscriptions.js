const express = require('express');
const router = express.Router();

var SubscriptionService = require('../../server/SubscriptionService');

// subscriptions to invest  ( get, list, add, delete )
router.get ('/subscriptions/:id', function (req, res) {
    var subscriptions = req.subscriptions;
    const subscription = subscriptions.find(arg => arg.id === parseInt( req.params.id));
    if (!subscription){
      res.status(404).send('subscription not found');
    }else{
      res.send(subscription);
    }
  });
 
router.get ('/subscriptions', function (req, res) {  
    var subscriptions = req.subscriptions;
    res.send(subscriptions);
});
 
router.post('/subscriptions' , function(req, res)  {
    var investors = req.investors;
    var funds = req.funds;
    var rates = req.rates;
    var subscriptions = req.subscriptions;
    // Validate input data
    const result = SubscriptionService.validateSubscription(req.body);
    if(result.error){
      res.status(400).send(result.error.details[0].message);
      return;
    }
    const investor = investors.find(arg => arg.id === parseInt( req.body.investorId))
    if(!investor){
      res.status(400).send('investor not found');
      return;
    }
    const fund = funds.find(arg => arg.token ===  req.body.token);
   if(!fund){
      res.status(400).send('fund/token not found');
      return;
    }
    const subscription = {
      id: subscriptions.length + 1,
      investorId:req.body.investorId,
      token:req.body.token,
      quantity:req.body.quantity,
      subScriptionDate:new Date()
    };
  // add Subscription 
  const ret = SubscriptionService.addSubscription(subscription, investors);
  if (ret){
    subscriptions.push (subscription);
    res.send(subscription);
  }else{
    //error
    res.status(400).send('subscription could not be added');
  }
  
  });

router.delete('/subscriptions', function(req, res)  {});

module.exports = router;
  