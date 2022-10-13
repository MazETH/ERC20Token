//SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract kek is ERC20, Pausable {
    address owner;
    uint256 immutable tax = 2;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor() ERC20("kek", "KEK") {
        owner = msg.sender;
        _mint(owner, 100000 * (10**18));
    }

    function pauseContract() public onlyOwner {
        _pause();
    }

    function unPauseContract() public onlyOwner {
        _unpause();
    }

    function getTaxed(uint256 _tokenAmount)
        public
        pure
        returns (uint256 _amountBack)
    {
        uint256 transferTax;
        transferTax = ((_tokenAmount / 100) * tax);
        _amountBack = _tokenAmount - transferTax;
        return _amountBack;
    }

    function transfer(address to, uint256 amount)
        public
        virtual
        override
        returns (bool)
    {
        address sender = msg.sender;
        uint256 afterTaxAmount = getTaxed(amount);
        super._transfer(sender, to, afterTaxAmount);
        return true;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }

    function burn(uint256 amount) public virtual whenNotPaused {
        _burn(msg.sender, amount);
    }
}
