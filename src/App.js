import './App.css';
import { useState, useEffect } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import { loadContract } from './utils/load-contract';
import Web3 from "web3";

function App() {

  const [web3Api, setWeb3Api] = useState({
    provider:null,
    web3:null,
    contract:null
  })

  const [balance, setBalance] = useState(null)
  const [account, setAccount] = useState(null)

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider()
      const contract = await loadContract("Simplebank", provider)

      if(provider){
        setWeb3Api(
          {
            provider:provider,
            web3: new Web3(provider),
            contract:contract
          }
        )
      } else{
        console.log("Please install metamask")
      }
    }
  loadProvider()
  },[])

  useEffect(
    () => {
      const loadBalance = async () => {
        const {contract, web3} = web3Api
        const balance = await web3.eth.getBalance(contract.address)
        setBalance(web3.utils.fromWei(balance, "ether"))
      }
      loadBalance()
    },[web3Api])

  useEffect(
    () => {
      const getAccount = async () =>{
        const accounts = await web3Api.web3.eth.getAccounts()
      setAccount(accounts[0])
      }
      getAccount()
    },[web3Api.web3])

    const addFunds = async () =>{
      const {contract, web3} = web3Api
      await contract.addFunds({
        from:account,
        value:web3.utils.toWei("1","ether")
      })
    }

    const withdraw = async () => {
      const {contract, web3} = web3Api
      const withDrawAmount = web3.utils.toWei("0.1", "ether")
      await contract.withdraw(withDrawAmount, {from:account})
    }

  return (
    <div className="App">
      <div>Current balance is {balance} Ether</div>
      <div>Check that your account is {account}</div>
      <div>
        <button onClick={addFunds} >Add 1 ether</button>
        <button onClick={withdraw} >Withdraw 1 ether</button>
      </div>
    </div>
  );
}

export default App;
