import './App.css'
import React, {useEffect, useState} from 'react'
import getWeb3 from './getWeb3'
import MyToken from './contracts/MyToken.json'
import MyTokenSale from './contracts/MyTokenSale.json'
import KYCHandler from './contracts/KYCHandler.json'
import {Button, TextField} from '@material-ui/core'

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [web3, setWeb3] = useState(null)
  const [accounts, setAccounts] = useState([])

  const [myToken, setMyToken] = useState(null)
  const [myTokenSale, setMyTokenSale] = useState(null)
  const [kycHandler, setKycHandler] = useState(null)
  const [tokenSaleContractAddress, setTokenSaleContractAddress] = useState('')

  const [kycAddress, setKycAddress] = useState('')
  const [kycCheckerAddress, setKycCheckerAddress] = useState('')

  const [currentUserTokenAmount, setCurrentUserTokenAmount] = useState(0)

  useEffect(() => {
    try {
      async function setUp() {
        const w3 = await getWeb3()
        setWeb3(w3)
        const accs = await w3.eth.getAccounts()
        setAccounts(accs)
        const networkId = await w3.eth.net.getId();

        const cappu = new w3.eth.Contract(MyToken.abi, MyToken.networks[networkId]?.address)
        setMyToken(cappu)
        setMyTokenSale(new w3.eth.Contract(MyTokenSale.abi, MyTokenSale.networks[networkId]?.address))
        setKycHandler(new w3.eth.Contract(KYCHandler.abi, KYCHandler.networks[networkId]?.address))
        setTokenSaleContractAddress(MyTokenSale.networks[networkId]?.address)
        setCurrentUserTokenAmount(await cappu.methods.balanceOf(accs[0]).call())
      }

      setUp().then(() => {
        setIsLoaded(true)
      })
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }, [])

  useEffect(() => {
    listenToTransferCappuTokensEvent()
  }, [myToken])

  window.ethereum.on('accountsChanged', async (accounts) => {
    setAccounts(accounts)
    myToken && await handleUpdateUserTokens(accounts)
  })

  const handleUpdateUserTokens = async (accounts) => {
    setCurrentUserTokenAmount(await myToken.methods.balanceOf(accounts[0]).call())
  }

  const listenToPaymentEvent = () => {
    // console.log('LISTENTOPAYMENTEVENT', itemManager)
    // if (itemManager) {
    //   itemManager.events.SupplyChainStep().on('data', async (e) => {
    //     if (e.returnValues._step === '1') {
    //       let item = await itemManager.methods.items(e.returnValues._itemIndex).call()
    //       console.log(item)
    //       alert(`Item ${item._identifier} was paid, deliver it now!`)
    //     }
    //     console.log(e)
    //   })
    // }
  }

  const listenToTransferCappuTokensEvent = () => {
    if (myToken) {
      myToken.events.Transfer({to: accounts[0]}).on('data', async () => {
        await handleUpdateUserTokens(accounts)
      })
    }
  }

  const handleKycAddressWhitelist = async () => {
    console.log('CLICKED!!', kycAddress)
    await kycHandler.methods.setKycCompleted(kycAddress).send({from: accounts[0]})
    console.log(`KYC for ${kycAddress} is completed!`)
  }

  const handleCheckKycStatus = async () => {
    const isKycCompleted = await kycHandler.methods.isKycCompleted(kycCheckerAddress).call()
    alert(`KYC for address ${kycCheckerAddress} is ${isKycCompleted ? 'completed' : 'not completed'}`)
  }

  const handleBuyMore = async () => {
    await myTokenSale.methods.buyTokens(accounts[0]).send({from: accounts[0], value: web3.utils.toWei('1', 'wei')})
  }

  return (
    <>
      {!isLoaded && (
        <div>Loading Web3, accounts, and contract...</div>
      )}
      {isLoaded && (
        <div className="App">
          <h1>StarDucks Cappuccino Token Sale!</h1>
          <h2>KYC Whitelisting</h2>

          <h2>Add address to whitelist below</h2>
          <div className="kyc-input">
            <TextField
              label="Address"
              variant="filled"
              onChange={e => setKycAddress(e.target.value)}
              style={{marginBottom: 20}}
            />
            <Button variant="contained" color="primary" onClick={() => handleKycAddressWhitelist()}>Add</Button>
          </div>

          <h2>Check if address is KYCed</h2>
          <div className="kyc-input">
            <TextField
              label="Address"
              variant="filled"
              onChange={e => setKycCheckerAddress(e.target.value)}
              style={{marginBottom: 20}}
            />
            <Button variant="contained" color="primary" onClick={() => handleCheckKycStatus()}>Check</Button>
          </div>

          <h2>If you want to by tokens, send tokens to address below</h2>
          <h3>{tokenSaleContractAddress}</h3>

          <h2>You currently have {currentUserTokenAmount} CAPPU tokens</h2>
          <Button variant="contained" color="primary" onClick={() => handleBuyMore()}>Buy 1 More CAPPU</Button>
        </div>
      )}
    </>
  )
}

export default App
