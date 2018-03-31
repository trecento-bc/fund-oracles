var Model = require('../../src/models/Rate');


function RateRepository() {
    this.rates = [
        new Model("TRCOF", 1)
    ];
}


RateRepository.prototype.findAll = function () {
    return this.rates;
    // load rates ( simulate async using promise)
    //return Promise.resolve(this.rates);
};
RateRepository.prototype.findOne = function (token) {
    // load rate 
    var foundRate = undefined;
    this.rates.forEach(function (rate) {
        if (rate.token === token)
            foundRate = rate;
    });
    return foundRate;
};
RateRepository.prototype.save = function (rate) {
    //  save a rate 
    this.rates.push(rate);
    return rate;
};
RateRepository.prototype.remove = function (token) {
    // remove a rate  
    var rate = this.findOne(token);
    if (rate)
        this.rates.splice(this.rates.indexOf(rate), 1);
    return rate;
};


module.exports = RateRepository;  
