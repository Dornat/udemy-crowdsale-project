require('dotenv').config({path: '../.env'})

const MyToken = artifacts.require("./MyToken")
const MyTokenSale = artifacts.require("./MyTokenSale")
const KYCHandler = artifacts.require("./KYCHandler")

module.exports = async (deployer) => {
  const [deployerAcc] = await web3.eth.getAccounts()
  await deployer.deploy(MyToken, process.env.INITIAL_TOKENS)
  await deployer.deploy(KYCHandler)
  await deployer.deploy(MyTokenSale, 1, deployerAcc, MyToken.address, KYCHandler.address)
  const myTokenInstance = await MyToken.deployed()
  await myTokenInstance.transfer(MyTokenSale.address, process.env.INITIAL_TOKENS)
};
