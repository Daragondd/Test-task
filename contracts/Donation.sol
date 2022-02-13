//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Donation {
    address payable private owner;
    address[] private donators;
    mapping(address => uint256) private money; 

    constructor () {
        owner = payable(msg.sender);
    }

    function giveDonation() public payable {
        require(msg.value >= .001 ether);

        if(!checkSender(msg.sender)) {
            donators.push(msg.sender);
            money[msg.sender] = msg.value;
        }
        else {
             money[msg.sender] = money[msg.sender] + msg.value;
        }

    }

    function checkSender(address addr) public view returns(bool) {
    return money[addr] > 0;
    }

    function getDonation(address payable addr, uint amount) external {
    // Transfer donates ONLY to contract owner
    require(msg.sender == owner);
    addr.transfer(amount);
    }

    function totalDonation(address addr) public view returns (uint256) {
        return money[addr];
    } 

}
