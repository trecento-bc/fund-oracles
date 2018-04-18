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
        host: 'localhost',
        port: 8544
    },
    openFundTokenContract: {
        contractAddress: '0xef03118e3e60d9003b6c622a2e94c39ebb6985f2',
        ownerAddress: '0x0f21f6fb13310ac0e17205840a91da93119efbec',
        // TODO: replace ownerKey with KeyStore File URL
        ownerKey: 'fdb2886b1ff5a0e60f9a4684e385aa7b77f064730304143f08ba96ca1a17effa',
        defaultGasPrice: '20000000000'
    }
};

module.exports = config;
