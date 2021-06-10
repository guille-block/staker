const Bgc = artifacts.require("Bgc");
const Cerebro = artifacts.require("Cerebro");

module.exports = async function(deployer) {
	//deploy Token
	await deployer.deploy(Bgc)  
	//assign token into variable to get it's address
	const bgc = await Bgc.deployed()
	//pass token address for dBank contract(for future minting)
	await deployer.deploy(Cerebro, bgc.address)
	//assign dBank contract into variable to get it's address
	const cerebro = await Cerebro.deployed()
	//change token's owner/minter from deployer to dBank
	await bgc.changeMinter(cerebro.address)
};