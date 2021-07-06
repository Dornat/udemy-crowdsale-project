require('dotenv').config({path: '../.env'})

const MyToken = artifacts.require('MyToken')
const MyTokenSale = artifacts.require('MyTokenSale')
const KYCHAndler = artifacts.require('KYCHandler')

const chai = require('./ChaiSetup')
const {BN} = web3.utils
const {expect} = chai

contract('MyTokenSale Test', async (accounts) => {
  const [deployer, alice, bob] = accounts

  it('should verify that deployer account has no tokens', async () => {
    const myTokenInstance = await MyToken.deployed()

    expect(await myTokenInstance.balanceOf(deployer)).to.be.bignumber.equal(new BN(0))
  })

  it('should check that all of the tokens are in the contract', async () => {
    const myTokenInstance = await MyToken.deployed()
    const totalSupply = await myTokenInstance.totalSupply()

    expect(await myTokenInstance.balanceOf(MyTokenSale.address)).to.be.bignumber.equal(totalSupply)
  })

  it('should be possible to buy tokens', async () => {
    const myTokenInstance = await MyToken.deployed()
    const myTokenSaleInstance = await MyTokenSale.deployed()
    const kycHandlerInstance = await KYCHAndler.deployed()
    const accountBalanceBeforeTransfer = await myTokenInstance.balanceOf(alice)
    const amount = new BN(1)

    await kycHandlerInstance.setKycCompleted(alice)
    await myTokenSaleInstance.sendTransaction({from: alice, value: web3.utils.toWei(amount, 'wei')})
    expect(await myTokenInstance.balanceOf(alice)).to.be.bignumber.equal(accountBalanceBeforeTransfer.add(amount))
  })
})
