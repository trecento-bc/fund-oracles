const express = require('express');
const router = express.Router();
var FundRepository = require('../../src/database/FundRepository');
const funds = new FundRepository().findAll();

//funds ( get, list, add, delete)

router.get ('/funds/:token', function (req, res) {
    const fund = funds.find(arg => arg.token ===  req.params.token);
    if (!fund){
      res.status(404).send('fund not found');
    }else{
      res.send(fund);
    }
  });

router.get ('/funds', function (req, res) { 
    res.send(funds);
});
 
router.post('/funds' , function(req, res)  {});
router.delete('/funds', function(req, res)  {});
  
module.exports = router;
  