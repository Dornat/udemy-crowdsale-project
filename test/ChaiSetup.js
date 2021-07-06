"use strict"
const chai = require('chai')
chai.should()
const {BN} = web3.utils
chai.use(require('chai-bn')(BN))
chai.use(require('chai-as-promised'))

module.exports = chai
