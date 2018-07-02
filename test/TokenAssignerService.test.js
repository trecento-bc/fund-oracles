/* Loading all libraries from common */

const utils = require('../src/utils/ethereum-functions.js');
const config = require('../server/config');
var BigNumber = require('bignumber.js');
//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const tokenAssignerService = require('../server/TokenAssignerService');
const should = chai.should();
const assert = require('chai').assert;

chai.use(chaiHttp);
var contractInstance;
var accountFrom;
var minterAccountKey;
var web3;

chai.use(require('chai-as-promised')).should();//To enable should chai style





describe('Assign tokens to subscribed investor (assignOpenFundTokenForSubscription) ', () => {
    it('it should assign 1 token to subscribed investor ', async () => {
        let subscription = { "id": 1, "investorId": 1, "token": "TRCOF", "depositedAmount": 1, "subScriptionDate": "2018-04-19T07:36:36.454Z", "address": "0x205161cec3b55ca9a5997eeaf983b798d5dc8408" };
        var subscriptions = [];
        subscriptions[0] = subscription;
        accountTo = subscription.address;
        var balanceBefore;
        var balanceAfter;
        // declare contract & accountFrom (minter)
        accountFrom = config.openFundTokenContract.minterAccount;
        minterAccountKey = config.openFundTokenContract.ownerKey;

        web3 = await utils.getWeb3("development", minterAccountKey);
        const OpenFund_json = require('../contracts_api/OpenFundToken.json');
        abi = OpenFund_json.abi;
        console.log("****************  ********************** ****");
        var contractInstance = new web3.eth.Contract(abi, config.openFundTokenContract.contractAddress, {
            from: config.openFundTokenContract.minterAccount
        });
        balanceBefore = await contractInstance.methods.balanceOf(accountTo).call({ from: accountFrom, gas: 300000 });
        console.log("balanceBefore:", balanceBefore);
        results = await tokenAssignerService.assignOpenFundTokenForSubscription(subscriptions, contractInstance, web3);
        console.log("results: ", results);
        setTimeout(async function () {
            balanceAfter = await contractInstance.methods.balanceOf(accountTo).call({ from: accountFrom, gas: 300000 });
            console.log("balanceAfter:", balanceAfter);

            var balanceBeforeBG = new BigNumber(balanceBefore);
            var balanceAfterBG = new BigNumber(balanceAfter);
            var diff = balanceAfterBG.minus(balanceBeforeBG);
            console.log("diff:", diff);
            assert.equal(diff, 1 * 1e18);
        }, 2000);

    })

});