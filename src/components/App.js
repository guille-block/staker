import React, { Component } from 'react';
import './App.css';
import LineGraph from './Apexchart'
import Web3 from 'web3'
import Cerebro from '../abis/Cerebro.json'
import Bgc from '../abis/Bgc.json'
import Nav from './Nav.jsx'


class App extends Component {

  //cargo todo en la app
  componentDidMount = async () => {
    await this.loadBlockchain()
    this.arrayCreator()
  }

  //llamado a la blockchain
  loadBlockchain = async () => {
    if(typeof window.ethereum !== 'undefined') {
         const web3 = new Web3(window.ethereum);
         window.ethereum.enable()
         const netId = await web3.eth.net.getId()
         //console.log(netId)
         const account = await web3.eth.getAccounts()
         this.setState({account: account[0]})
         //console.log(Cerebro.networks[netId].address)
         if(Cerebro.networks[netId]) {
          const cerebro = await web3.eth.Contract(Cerebro.abi, Cerebro.networks[netId].address)
          const bgc = await web3.eth.Contract(Bgc.abi, Bgc.networks[netId].address)
          const amountOfBgc = await bgc.methods.balanceOf(account.toString()).call()
          const amountOfEth = await cerebro.methods.depositEth(account.toString()).call()
          const depositTime = await cerebro.methods.depositTime(account.toString()).call()
          this.setState({bgcAmount: parseFloat(amountOfBgc.toString())})
          this.setState({ethAmount: parseFloat(amountOfEth.toString())})
          this.setState({depositTime: depositTime.toString()})
          this.setState({bgc})
          this.setState({cerebro})
         } else {
           alert('connect to a different Blockchain')
         }
     } else {
       window.alert('Please install metamask :)')
     }
    }

    constructor(props){
      super(props) 
        this.state = {
          account: '',
          ethAmount: 0,
          bgcAmount: 0,
          depositTime: '',
          dateArr: [],
          intArr: [], 
          key: 0,
          refrescar: true
    }
  }

  //depositar función de cerebro
    deposit = (amount) => {
      this.state.cerebro.methods.deposit().send({from: this.state.account, value: '1000000000000000000'})
      //.once('transactionHash', (transactionHash) => {
      //  //window.location.reload()
      //  this.forceUpdate()
      //})
      //
      //this.state.refrescar ? this.setState({refrescar:false}) : this.setState({refrescar: true})
    }

    //retirar función de cerebro
    withdraw = (amount) => {
      this.state.cerebro.methods.withdraw().send({from: this.state.account})
      //.once('transactionHash', (transactionHash) => {
      //  this.forceUpdate()
      //})
      //this.state.refrescar ? this.setState({refrescar:false}) : this.setState({refrescar: true})
    }


    //generador de fechas para el gráfico
    arrayCreator = () => {
      var inicio = parseFloat(this.state.depositTime *1000)
      var startDate = new Date(inicio)
      console.log(startDate.getTime())
      var endDate = new Date()
      //endDate.setDate(endDate.getDate() + 7)
      console.log(endDate.getTime())

      const getDateArray = (start, end) => {
          var
            arr = new Array(),
            arrInt = new Array(),
            intIni = (endDate - startDate)  * (parseFloat(this.state.ethAmount)/1000000000000000000) * 3 / 86400000,
            dt = new Date(start);


            
          while (dt <= end) {
              arr.push(dt.toLocaleDateString('en-US'));
              arrInt.unshift(intIni)
              dt.setDate(dt.getDate() + 1);
              intIni = (endDate - dt)  * (parseFloat(this.state.ethAmount)/1000000000000000000) * 3 / 86400000
          }
        
          console.log(arrInt)
      return {
        first: arr,
        second: arrInt,
      }
    }

  var arrays = getDateArray(startDate, endDate)

    this.setState({dateArr: arrays.first})
    this.setState({intArr: arrays.second})

    this.setState({key: 1})
    }
    
    
//rendereo la app
  render() {
    console.log('render() method')
    return (
      <div>
        <Nav deposit = {this.deposit}
             ethAmount = {this.state.ethAmount}
             bgcAmount = {this.state.bgcAmount}
             withdraw = {this.withdraw}
             key = {this.state.key}/>
        <div className="box graph-size">
          { parseFloat(this.state.ethAmount) === 0 
            ? <h2>No estas suscripto al staker</h2>
            : <LineGraph dateArr = {this.state.dateArr}
                     intArr = {this.state.intArr}
                     key = {this.state.key}/>}
        </div>
      </div>
    );
  }
}

export default App;
