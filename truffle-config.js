require('dotenv').config({path: './.env'})
const path = require('path')
const HDWalletProvider = require('truffle-hdwallet-provider-privkey')

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 8545
    },
    // development: {
    //   host: "localhost",
    //   port: 7545,
    //   network_id: 5777
    // }
    ropsten: {
      provider: () => {
        return new HDWalletProvider(
          [process.env.TESTNET_DEPLOYER_PRIVATE_KEY],
          process.env.ROPSTEN_NODE_URL
        )
      },
      network_id: 3
    }
  },
  compilers: {
    solc: {
      version: "^0.8.0"
    }
  },
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY
  }
}
