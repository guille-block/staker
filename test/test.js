
const {assert} = require('chai')
const Bgc = artifacts.require('./Bgc')
const Cerebro = artifacts.require('./Cerebro')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Cerebro', ([deployer, user, faker]) => {
    let cerebro, bgc 

    beforeEach(async () => {
        bgc = await Bgc.new()
        cerebro = await Cerebro.new(bgc.address)

        await bgc.changeMinter(cerebro.address, {from: deployer})
    })

    describe('testing token contract...', () => {
        describe('success', () => {
          it('checking token name', async () => {
            expect(await bgc.name()).to.be.eq('Belu Coin')
          })
          it('checking cerebro minter', async () => {
            expect(await bgc.minter()).to.eq(cerebro.address)
          })
        })
    }) 
    
    describe('Cerebro deposits', () => {
      let deposit, ethValue, amountDeposited, stateDeposited

      it('msg.value positive', async () => {
        await cerebro.deposit({from: user, value: web3.utils.toWei('0', 'Ether')}).should.be.rejected
      })

        before(async () => {
            deposit = await cerebro.deposit({from: user, value: web3.utils.toWei('1', 'Ether')})
            ethValue = web3.utils.toWei('1', 'Ether')
            ethValue = new web3.utils.BN(ethValue)
            amountDeposited = await cerebro.depositEth(user)
            stateDeposited = await cerebro.depositState(user)
        })
   
        it('deposit Status', async () => {
          assert.equal(stateDeposited, true)
        })

        it('balance equal msg.value', async () => {
          assert.equal(amountDeposited.toString(), ethValue.toString())
        })

        //it('deposit State', async () => {
        //  assert.equal(deposit, 'true')
        //})
    })

    


    describe('Cerebro withdraw', () => {
      let withdraw, 
      ethValue, 
      amountDeposited, 
      stateDeposited, 
      deposit, 
      oldBalance, 
      depositBalance,
      newBalance,
      bgcOldBalance,
      bgcNewBalance, 
      depositTimeG

      it('Reject faker reject', async () => {
        withdraw = await cerebro.withdraw({from: faker}).should.be.rejected
        })

      before(async () => {

        bgcOldBalance = await bgc.balanceOf(user)
        console.log(bgcOldBalance.toString())

        oldBalance = await web3.eth.getBalance(user)
        oldBalance = new web3.utils.BN(oldBalance)
        oldBalance = web3.utils.fromWei(oldBalance.toString(), 'ether')

        deposit = await cerebro.deposit({from: user, value: web3.utils.toWei('1', 'Ether')})

        depositBalance = await web3.eth.getBalance(user)
        depositBalance = new web3.utils.BN(depositBalance)
        depositBalance = web3.utils.fromWei(depositBalance.toString(), 'ether')

        withdraw = await cerebro.withdraw({from: user})

        newBalance = await web3.eth.getBalance(user)
        newBalance = new web3.utils.BN(newBalance)
        newBalance = web3.utils.fromWei(newBalance.toString(), 'ether')


        ethValue = web3.utils.toWei('0', 'Ether')
        ethValue = new web3.utils.BN(ethValue).toString()

        amountDeposited = await cerebro.depositEth(user)
        stateDeposited = await cerebro.depositState(user)

        bgcNewBalance = await bgc.balanceOf(user)

        depositTimeG = await cerebro.depositTime(user) 
        console.log(depositTimeG.toString())       
        console.log(bgcNewBalance.toString())
        console.log(depositTimeG.toString())
    })
    
    it('Eth after withdraw', async () => {
      assert.equal(amountDeposited.toString(), ethValue)
    })

    it('State after withdraw', async () => {
      assert.equal(stateDeposited, false)
    })

    describe('Balance movements', async() => {
      it('Balance after deposit is lower', async () => {
        assert.isBelow(parseFloat(depositBalance.toString()), parseFloat(oldBalance.toString()))
      })

      it('Balance after withdraw is higher', async () => {
        assert.isAbove(parseFloat(newBalance.toString()), parseFloat(depositBalance.toString()))
      })

      //it('Balance after withdraw is equal oldBalance', async () => {
      //  assert.equal(newBalance, oldBalance)
      //})
    })

    })
})