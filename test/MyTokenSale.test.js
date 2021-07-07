require('dotenv').config({path: '../.env'})

const MyToken = artifacts.require('MyToken')
const MyTokenSale = artifacts.require('MyTokenSale')
const KYCHAndler = artifacts.require('KYCHandler')

const chai = require('./ChaiSetup')
const {BN} = web3.utils
const {expect} = chai

contract('MyTokenSale Test', async (accounts) => {
  const [deployer, alice] = accounts

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

  it('should not be possible to buy more than allowed amount', async () => {
    const myTokenInstance = await MyToken.deployed()
    const myTokenSaleInstance = await MyTokenSale.deployed()
    const amount = new BN(42)

    await expect(myTokenSaleInstance.sendTransaction({from: alice, value: web3.utils.toWei(amount, 'wei')})).to.be.rejectedWith(Error)
    expect(await myTokenInstance.balanceOf(alice)).to.be.bignumber.equal(new BN(1))

    const nextAmount = new BN(41)
    await expect(myTokenSaleInstance.sendTransaction({from: alice, value: web3.utils.toWei(nextAmount, 'wei')})).to.be.fulfilled
    expect(await myTokenInstance.balanceOf(alice)).to.be.bignumber.equal(amount)
    await expect(myTokenSaleInstance.sendTransaction({from: alice, value: web3.utils.toWei(new BN(1), 'wei')})).to.be.rejectedWith(Error)
    expect(await myTokenInstance.totalSupply()).to.be.bignumber.equal(amount)
  })
})
