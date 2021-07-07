// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CrowdSale.sol";
import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

/**
 * @title MintedCrowdsale
 * @dev Extension of Crowdsale contract whose tokens are minted in each purchase.
 * Token ownership should be transferred to MintedCrowdsale for minting.
 */
contract MintedCrowdsale is Crowdsale {

    constructor (uint256 _rate, address payable _wallet, IERC20 _token) Crowdsale(_rate, _wallet, _token) {}

    /**
     * @dev Overrides delivery by minting tokens upon purchase.
     * @param _beneficiary Token purchaser
     * @param _tokenAmount Number of tokens to be minted
     */
    function _deliverTokens(address _beneficiary, uint256 _tokenAmount) internal override {
        ERC20PresetMinterPauser(address(token)).mint(_beneficiary, _tokenAmount);
    }
}
