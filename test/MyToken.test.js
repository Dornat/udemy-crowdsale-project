require('dotenv').config({path: '../.env'})

const MyToken = artifacts.require('MyToken')

const chai = require('./ChaiSetup')
const {BN} = web3.utils
const {expect} = chai

contract('MyToken Test', async (accounts) => {
  const [deployer, alice, bob] = accounts

  beforeEach(async () => {
    this.myToken = await MyToken.new(process.env.INITIAL_TOKENS);
  })

  it('should put all tokens in first account', async () => {
    const instance = this.myToken
    const totalSupply = await instance.totalSupply()

    expect(await instance.balanceOf(deployer)).to.be.bignumber.equal(totalSupply)
  })

  it('should be possible to send tokens between accounts', async () => {
    const instance = this.myToken
    const totalSupply = await instance.totalSupply()
    expect(await instance.balanceOf(deployer)).to.be.bignumber.equal(totalSupply)

    await instance.transfer(alice, 1)
    expect(await instance.balanceOf(deployer)).to.be.bignumber.equal(totalSupply.sub(new BN(1)))
    expect(await instance.balanceOf(alice)).to.be.a.bignumber.equal(new BN(1))
  })

  it('should not be possible to send more tokens than available in total', async () => {
    const instance = this.myToken
    const totalSupply = await instance.totalSupply()
    const balanceOfDeployer = await instance.balanceOf(deployer)

    await instance.transfer(alice, 1)
    await expect(instance.transfer(alice, new BN(balanceOfDeployer + 1))).to.be.rejectedWith(Error)
    expect(await instance.balanceOf(deployer)).to.be.bignumber.equal(totalSupply.sub(new BN(1)))
  })
})