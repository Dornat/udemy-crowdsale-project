// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

contract MyToken is ERC20PresetMinterPauser {
    uint8 MAX_MINTABLE_AMOUNT = 42;

    mapping (address => uint256) private _mintedAmount;

    constructor() ERC20PresetMinterPauser("StarDucks Cappuccino Token", "CAPPU") {
    }

    function mint(address to, uint256 amount) public override {
        require(_mintedAmount[to] + amount <= MAX_MINTABLE_AMOUNT, "CAPPU: Maximum mintable amount for address is reached.");
        super.mint(to, amount);
        _mintedAmount[to] = _mintedAmount[to] + amount;
    }

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }

    function burn(uint256) public override pure {
        revert("CAPPU: Those CAPPU tokens are too precious to be burned!");
    }

    function burnFrom(address, uint256) public override pure {
        revert("CAPPU: Those CAPPU tokens are too precious to be burned!");
    }
}
