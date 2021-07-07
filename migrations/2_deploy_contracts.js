require('dotenv').config({path: '../.env'})

const MyToken = artifacts.require("./MyToken")
const MyTokenSale = artifacts.require("./MyTokenSale")
const KYCHandler = artifacts.require("./KYCHandler")

module.exports = async (deployer) => {
  const [deployerAcc] = await web3.eth.getAccounts()
  await deployer.deploy(MyToken)
  await deployer.deploy(KYCHandler)
  await deployer.deploy(MyTokenSale, 1, deployerAcc, MyToken.address, KYCHandler.address)
  const myTokenInstance = await MyToken.deployed()
  const minterRole = await myTokenInstance.MINTER_ROLE()
  myTokenInstance.grantRole(minterRole, MyTokenSale.address)
};
