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

    function checkSender(address addr) internal view returns(bool) { 
        for(uint256 i = 0; i < donators.length; i++) {
            if(donators[i] == addr) return true;
        }
        return false;
    }

    function getDonation() external {
        require(msg.sender == owner);
        owner.transfer(address(this).balance);
    }

    function Donators() public view returns (address[] memory) {
        return donators;
    }

    function totalDonation(address addr) public view returns (uint256) {
        return money[addr];
    } 

}
