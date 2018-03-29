const express = require('express');
const router = express.Router();


//funds ( get, list, add, delete)

router.get ('/funds/:token', function (req, res) {
    var funds = req.funds;
    const fund = funds.find(arg => arg.token ===  req.params.token);
    if (!fund){
      res.status(404).send('fund not found');
    }else{
      res.send(fund);
    }
  });

router.get ('/funds', function (req, res) { 
    var funds = req.funds;
    res.send(funds);
});
 
router.post('/funds' , function(req, res)  {});
router.delete('/funds', function(req, res)  {});
  
module.exports = router;
  