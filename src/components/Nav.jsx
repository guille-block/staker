import React from 'react'
import Web3 from 'web3'
import './App.css'

const Nav = ({deposit, ethAmount, bgcAmount, withdraw, key}) => {

    const web3 = new Web3(window.ethereum)
    
    return (
        <nav class = "nav">
        <div className = "box box-rem" key={key}>
          <h1>Welcome to BGC staker</h1>
          <div class = 'flex-btn flex-padding'>
          <button class = 'btn btn-lg btn-nav' onClick = {e => {
                                            deposit()}}>Deposit</button>
          <button class = 'btn btn-lg btn-nav' onClick = {e => {
                                            withdraw()}}>Withdraw</button>
          </div>
          
          </div>
          <div className = "box box-amounts" key={key}>
            <h5 className = 'text-h'>ETH deposited:</h5>
            <h5 className = 'text-h'>{web3.utils.fromWei(ethAmount.toString(), 'Ether')}</h5>
          </div>
          <div className = "box box-amounts" key={key}>
          <h5 className = 'text-h'>BGC earned:</h5>
          <h5 className = 'text-h'>{Math.round(parseFloat(web3.utils.fromWei(bgcAmount.toString(), 'Gwei')))}</h5>
          </div>
        </nav>
    )

}


export default Nav