pragma solidity >=0.5.0;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";


/// @title FireToken - simple ERC20 token, used as supplement in this project
contract FireToken is ERC20, Ownable {
    uint256 public initialSupply = 1000000000;
    string public name = "FireToken";
    string public symbol = "FIRE";
    uint32 public decimals = 3;

    constructor() public {
        _mint(msg.sender, initialSupply);
        emit Transfer(address(0), msg.sender, initialSupply);
    }
}
