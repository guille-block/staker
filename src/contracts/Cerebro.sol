pragma solidity ^0.8.0;

import './Bgc.sol';

contract Cerebro {
    
    uint public interest;
    mapping(address => uint) public depositEth;
    mapping(address => uint) public depositTime;
    mapping(address => bool) public depositState;
    
    Bgc private bgc;
    
    event Deposited(
        address payable staker,
        uint amount
        );
    
    constructor(Bgc _token) public {
        bgc = _token;
    }
    
    function deposit() payable public returns(bool) {
        require(msg.value > 0, 'Dale rata manda los eth');
        depositEth[msg.sender] += msg.value;
        depositTime[msg.sender] = block.timestamp;
        depositState[msg.sender] = true;
        return depositState[msg.sender];
    }
    
    
    function withdraw() public payable returns(bool) {
        require(depositState[msg.sender] == true);
        payable(msg.sender).transfer(depositEth[msg.sender]);
        interest = (block.timestamp - depositTime[msg.sender])  * depositEth[msg.sender] * 3 / 86400;
        bgc.mint(msg.sender, interest);
        depositState[msg.sender] = false;
        depositEth[msg.sender] = 0;
        depositTime[msg.sender] = 0;
        return depositState[msg.sender];
    }

}