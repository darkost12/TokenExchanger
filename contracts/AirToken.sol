pragma solidity >=0.5.0;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";


/// @title AirToken - simple ERC20 token, used as supplement in this project
contract AirToken is ERC20, Ownable {
    uint256 public initialSupply = 10000000000;
    string public name = "AirToken";
    string public symbol = "Air";
    uint32 public decimals = 2;

    constructor() public {
        _mint(msg.sender, initialSupply);
        emit Transfer(address(0), msg.sender, initialSupply);
    }
}
