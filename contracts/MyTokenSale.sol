// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MintedCrowdsale.sol";
import "./KYCHandler.sol";

contract MyTokenSale is MintedCrowdsale {
    KYCHandler kyc;

    constructor (
        uint256 _rate,
        address payable _wallet,
        IERC20 _token,
        KYCHandler _kyc
    ) MintedCrowdsale(_rate, _wallet, _token) {
        kyc = _kyc;
    }

    function _preValidatePurchase(address _beneficiary, uint256 _weiAmount) internal view override {
        super._preValidatePurchase(_beneficiary, _weiAmount);
        require(kyc.isKycCompleted(msg.sender), "MyTokenSale: KYC is not completed.");
    }
}
