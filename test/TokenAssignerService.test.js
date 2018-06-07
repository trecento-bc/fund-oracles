/* Loading all libraries from common */

const helpers = require('../test/helpers');

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const tokenAssignerService = require('../server/TokenAssignerService');
const should = chai.should();
const assert = require('chai').assert;

chai.use(chaiHttp);
var contractInstance;
var accountFrom;
var web3;

chai.use(require('chai-as-promised')).should();//To enable should chai style


describe('Assign tokens to subscribed investor (assignOpenFundTokenForSubscription) ', () => {

    it('it should assign 10000 token to subscribed investor ', async () => {
        let subscription = { "id": 1, "investorId": 1, "token": "TRCOF", "depositedAmount": 10000, "subScriptionDate": "2018-04-19T07:36:36.454Z", "address": "0x205161cec3b55ca9a5997eeaf983b798d5dc8408" };
        var subscriptions = [];
        subscriptions[0] = subscription;
        accountTo = subscription.address;
        var balanceBefore;
        var balanceAfter;
        console.log(helpers);
        return helpers.initWeb3AndOpenFundTokenContract()
            .then(function (result) {
                accountFrom = result.accountFrom;
                contractInstance = result.contractInstance;
                web3 = result.web3;
                return contractInstance.methods.balanceOf(accountTo).call({ from: accountFrom, gas: 300000 })
                    .then(function (result) {
                        console.log("balanceBefore:", result);
                        balanceBefore = result;
                        return tokenAssignerService.assignOpenFundTokenForSubscription(subscriptions, contractInstance, web3)
                            .then(function (result) {
                                return contractInstance.methods.balanceOf(accountTo).call({ from: accountFrom, gas: 300000 });
                            }).then(function (result) {
                                console.log("balanceAfter:", result);
                                balanceAfter = result;
                                var diff = balanceAfter - balanceBefore;
                                console.log("diff:", diff);
                                assert.equal(diff, 10000);                                
                            });
                    });
            });
    });
});