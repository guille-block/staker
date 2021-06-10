// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Bgc is ERC20 {
  //add minter variable
  address public minter;

  //add minter changed event
  event PassedMinter(address minter);

  constructor() public payable ERC20("Belu Coin", "BGC") {
    //asign initial minter
    minter = msg.sender;
  }

  //Add pass minter role function
  function changeMinter(address newMinter) public returns(bool){
        require(minter == msg.sender);
        minter = newMinter;
        emit PassedMinter(msg.sender);
        return true;
  }

  function mint(address account, uint256 amount) payable public {
    //check if msg.sender have minter role
    require(minter == msg.sender);
		_mint(account, amount);
	}
}