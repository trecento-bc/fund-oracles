const express = require('express');
const router = express.Router();
var RateRepository = require('../../src/database/RateRepository');
const rates = new RateRepository().findAll();

// rates for funds tokens / NAV calculation (  get, list, add, delete )
router.get ('/rates/:token', function (req, res) {
    const rate = rates.find(arg => arg.token ===  req.params.token);
    if (!rate){
      res.status(404).send('rate not found');
    }else{
      res.send(rate);
    }
  });
  
  router.get ('/rates', function (req, res) {
    res.send(rates);
  });
 
router.post('/rates' , function(req, res)  {});  
router.delete('/rates', function(req, res)  {});

module.exports = router;
  
  