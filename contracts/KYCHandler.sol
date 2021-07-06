// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract KYCHandler is Ownable {
    mapping (address => bool) allowedAddresses;

    function setKycCompleted(address _address) public onlyOwner {
        allowedAddresses[_address] = true;
    }

    function revokeKyc(address _address) public onlyOwner {
        allowedAddresses[_address] = false;
    }

    function isKycCompleted(address _address) public view returns(bool) {
        return allowedAddresses[_address];
    }
}
