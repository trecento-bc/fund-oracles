const express = require('express');
const router = express.Router();


// rates for funds tokens / NAV calculation (  get, list, add, delete )
router.get ('/rates/:token', function (req, res) {
    var rates = req.rates;
    const rate = rates.find(arg => arg.token ===  req.params.token);
    if (!rate){
      res.status(404).send('rate not found');
    }else{
      res.send(rate);
    }
  });
  
  router.get ('/rates', function (req, res) {
    var rates = req.rates;
    res.send(rates);
  });
 
router.post('/rates' , function(req, res)  {});  
router.delete('/rates', function(req, res)  {});

module.exports = router;
  
  