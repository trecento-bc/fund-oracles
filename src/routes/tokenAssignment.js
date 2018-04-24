const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

var urlencodedParser = bodyParser.urlencoded({ extended: true });

var TokenAssignerService = require('../../server/TokenAssignerService');


router.get('/assignOpenFundTokens', function (req, res) {
  TokenAssignerService.assignOpenFundToken();
  res.status(200).send('Assignment of Token triggered, watch for contract Events '); 
});



module.exports = router;
