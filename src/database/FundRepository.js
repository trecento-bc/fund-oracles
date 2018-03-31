
var Model = require('../../src/models/Fund');


function FundRepository() {
    this.funds = [
        new Model("TRCOF", "openfund")
    ];
}

FundRepository.prototype.findAll = function () {
    return this.funds;
    // load funds ( simulate async using promise)
    //return Promise.resolve(this.funds);
};
FundRepository.prototype.findOne = function (token) {
    // load fund 
    var foundFund = undefined;
    this.funds.forEach(function (fund) {
        if (fund.token === token)
            foundFund = fund;
    });
    return foundFund;
};
FundRepository.prototype.save = function (fund) {
    //  save a fund 
    this.funds.push(fund);
    return fund;
};
FundRepository.prototype.remove = function (token) {
    // remove a fund  
    var fund = this.findOne(token);
    if (fund)
        this.funds.splice(this.funds.indexOf(fund), 1);
    return fund;
};


module.exports = FundRepository; 
