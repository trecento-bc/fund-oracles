var Model = require('../../src/models/Investor');


function InvestorRepository() {
    this.investors = [
        new Model(1, "Jane", "Doe")
    ];
}


InvestorRepository.prototype.findAll = function () {
    return this.investors;
    // load investors ( simulate async using promise)
    //return Promise.resolve(this.investors);
};
InvestorRepository.prototype.findOne = function (id) {
    // load investor 
    var foundInvestor = undefined;
    this.investors.forEach(function (investor) {
        if (investor.id === id)
            foundInvestor = investor;
    });
    return foundInvestor;
};
InvestorRepository.prototype.save = function (investor) {
    //  save a investor 
    this.investors.push(investor);
    return investor;
};
InvestorRepository.prototype.remove = function (id) {
    // remove a investor  
    var investor = this.findOne(id);
    if (investor)
        this.investors.splice(this.investors.indexOf(investor), 1);
    return investor;
};

module.exports = InvestorRepository;  