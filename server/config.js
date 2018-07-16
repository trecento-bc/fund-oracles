/** @file config.js
 * @author: mobh
 */


// config.js
const config = {
    app: {
        host: 'localhost',
        port: 8000
    },
    ethereumNode: {
        net:"development"
    },
    openFundTokenContract: {
        minterAccount: '0x0f21f6fb13310ac0e17205840a91da93119efbec',
        // TODO: move this key to a seperate config file (protected File storage )  
        ownerKey: 'fdb2886b1ff5a0e60f9a4684e385aa7b77f064730304143f08ba96ca1a17effa',
        defaultGasPrice: '20000000000'
    }
};

module.exports = config;
