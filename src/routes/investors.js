const express = require('express');
const router = express.Router();



// investors  ( get, list, add, delete)
router.get ('/investors/:id', function (req, res) {
    var investors = req.investors;
    const investor = investors.find(arg => arg.id === parseInt( req.params.id));
    if (!investor){
      res.status(404).send('Investor not found');
    }else{
      res.send(investor);
    }
  });


router.get ('/investors', function (req, res) {
    var investors = req.investors;
    res.send(investors);
  });

router.post('/investors' , function(req, res)  {});
router.delete('/investors', function(req, res)  {});

module.exports = router;
  