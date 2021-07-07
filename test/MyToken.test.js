require('dotenv').config({path: '../.env'})

const MyToken = artifacts.require('MyToken')

const chai = require('./ChaiSetup')
const {BN} = web3.utils
const {expect} = chai

contract('MyToken Test', async (accounts) => {
  const [deployer, alice] = accounts

  beforeEach(async () => {
    this.myToken = await MyToken.new();
  })

  it('should be possible to mint tokens', async () => {
    const instance = this.myToken
    await instance.mint(deployer, 42)

    expect(await instance.balanceOf(deployer)).to.be.bignumber.equal(new BN(42))
  })

  it('should not be possible to mint a lot of tokens', async () => {
    const instance = this.myToken
    await expect(instance.mint(deployer, 43)).to.be.rejectedWith(Error)
    await instance.mint(deployer, 42)
    await expect(instance.mint(deployer, 1)).to.be.rejectedWith(Error)
    expect(await instance.balanceOf(deployer)).to.be.bignumber.equal(new BN(42))
    await instance.mint(alice, 1)
    await instance.mint(alice, 3)
    await expect(instance.mint(alice, 39)).to.be.rejectedWith(Error)
    await instance.mint(alice, 10)
    expect(await instance.balanceOf(alice)).to.be.bignumber.equal(new BN(14))
  })

  it('should not be possible to mint tokens from account without minter role', async () => {
    const instance = this.myToken
    await expect(instance.mint(alice, 42, {from: alice})).to.be.rejectedWith(Error)
  })

  it('should be possible to grant minter role to alice and mint tokens on her behalf', async () => {
    const instance = this.myToken
    const minterRole = await instance.MINTER_ROLE()
    await expect(instance.grantRole(minterRole, alice)).to.be.fulfilled
    await expect(instance.mint(alice, 42, {from: alice})).to.be.fulfilled
  })

  it('should not be possible to burn tokens', async () => {
    const instance = this.myToken
    await instance.mint(deployer, 42)
    await expect(instance.burn(42)).to.be.rejectedWith(Error)
  })

  it('should be possible to send tokens between accounts', async () => {
    const instance = this.myToken
    await instance.mint(deployer, 42)

    await instance.transfer(alice, 1)
    expect(await instance.balanceOf(deployer)).to.be.bignumber.equal(new BN(41))
    expect(await instance.balanceOf(alice)).to.be.a.bignumber.equal(new BN(1))
  })

  it('should not be possible to send more tokens than available in total', async () => {
    const instance = this.myToken
    await instance.mint(deployer, 42)
    const balanceOfDeployer = await instance.balanceOf(deployer)

    await instance.transfer(alice, 1)
    await expect(instance.transfer(alice, new BN(balanceOfDeployer + 1))).to.be.rejectedWith(Error)
    expect(await instance.balanceOf(deployer)).to.be.bignumber.equal((new BN(balanceOfDeployer - 1)))
  })
})