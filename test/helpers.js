const fs = require('fs');
const config = require('../server/config');
var Web3 = require('web3');
var web3;
const LocalProvider = require('web3-local-signing-provider');
var contractInstance;
var accountFrom;



const Commons = {
  initWeb3AndOpenFundTokenContract: async function () {
    accountFrom = config.openFundTokenContract.minterAccount;
    // init Web3
    const { ethereumNode: { host, port } } = config;
    const connectionString = `http://${host}:${port}`;

    // Get the Minter Account
    var minterAccount = config.openFundTokenContract.minterAccount;
    var minterAccountKey = config.openFundTokenContract.ownerKey;

    // instantiate LocalProvider (from "web3-local-signing-provider") 
    // using configured geth node and the signing key of the minter
    const provider = new LocalProvider(minterAccountKey,
      new Web3.providers.HttpProvider(connectionString));
    web3=  provider.web3;

     // declare contract 
     const OpenFund_json = require('../contracts_api/OpenFundToken.json');
     abi = OpenFund_json.abi;
     console.log("****************  ********************** ****");
     //TODO Get contract adress from JSON ( Build Folder) instead of config File
     var contractInstance = new web3.eth.Contract(abi, config.openFundTokenContract.contractAddress, {
       from: config.openFundTokenContract.minterAccount
     });
     //console.log(contractInstance);
     return {
      web3: web3,
      contractInstance: contractInstance,
      accountFrom: accountFrom
    }
  },
  initWeb3LocalProvider: function () {
    const { ethereumNode: { host, port } } = config;
    const connectionString = `http://${host}:${port}`;

    // Get the Minter Account
    var minterAccount = config.openFundTokenContract.minterAccount;
    var minterAccountKey = config.openFundTokenContract.ownerKey;

    // instantiate LocalProvider (from "web3-local-signing-provider") 
    // using configured geth node and the signing key of the minter
    const provider = new LocalProvider(minterAccountKey,
      new Web3.providers.HttpProvider(connectionString));
    return provider.web3;
  }
}


/* Exporting CommonVars */
module.exports = Commons