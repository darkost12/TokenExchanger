pragma solidity >=0.5.0;


import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "../node_modules/openzeppelin-solidity/contracts/lifecycle/Pausable.sol";


/// @title Exchanger
/// @dev Smart contract for exchanging custom tokens 1 to 1.
contract Exchanger is Ownable, Pausable {

    /// @dev Structure which contains the info about particular transfer.
    struct Transfer {
        address contract_;
        address to_;
        uint amount_;
        bool failed_;
    }

    /// @dev Array of struct elements representing transactions.
    Transfer[] public transactions;

    mapping(address => uint[]) public transactionIndexesToSender;
    mapping(string => address) public tokens;
    address public exchangerOwner;

    /// @dev Current amount of transactions.
    uint internal transactionId;

    event TransferSuccessful(
        address indexed from_,
        address indexed to_,
        uint256 amount_
    );

    event TransferFailed(
        address indexed from_,
        address indexed to_,
        uint256 amount_
    );

    constructor() public {
        exchangerOwner = msg.sender;
    }

    /// @dev Function to add new custom tokens into the exchanger.
    /// @param symbol_ The acronym of token (e.g. FIRE, OMG, etc);
    /// @param address_ The address of token contract.
    /// @return (bool) true If the operation was successful.
    function addNewToken(
        string memory symbol_,
        address address_
    ) public onlyOwner returns (bool) {
        tokens[symbol_] = address_;
        return true;
    }

    /// @dev Function to remove existing token from the exchanger.
    /// @param symbol_ The acronym of the existing token.
    /// @return (bool) true If the operation was successful.
    function removeToken(
        string memory symbol_
    ) public onlyOwner returns (bool) {
        require(tokens[symbol_] != address(0));
        delete (tokens[symbol_]);
        return true;
    }

    /// @dev Function of token transfering
    /// @param symbolTake Symbol of token to be taken from the trade initiator;
    /// @param symbolGive Symbol of token to be granted to initiator of trade;
    /// @param to_ Address with which the initiator wants to trade;
    /// @param amount_ Amount of tokens to be traded (1 to 1).
    function transferTokens(
        string memory symbolTake,
        string memory symbolGive,
        address to_,
        uint256 amount_
    ) public whenNotPaused {
        address contractTake = tokens[symbolTake];
        address contractGive = tokens[symbolGive];
        require(contractTake != address(0));
        require(contractGive != address(0));
        ERC20 interfaceTake = ERC20(contractTake);
        ERC20 interfaceGive = ERC20(contractGive);
        require(amount_ > 0);
        address from_ = msg.sender;

        /// @dev Checks that requirements on both sides are met.
        if ((tryOneWayTransfer(symbolTake, from_, to_, amount_) == true) &&
            (tryOneWayTransfer(symbolGive, to_, from_, amount_) == true)) {
            interfaceTake.transferFrom(from_, to_, amount_);
            transactions[transactionId - 2].failed_ = false;
            emit TransferSuccessful(from_, to_, amount_);
            interfaceGive.transferFrom(to_, from_, amount_);
            transactions[transactionId - 1].failed_ = false;
            emit TransferSuccessful(to_, from_, amount_);
        } else {
            emit TransferFailed(from_, to_, amount_);
            emit TransferFailed(to_, from_, amount_);
            revert();
        }
    }

    /// @dev Function which checks the requirements on one side only.
    /// @param symbol Symbol of token to be taken from this person;
    /// @param from_ Person that will give this type of token;
    /// @param to_ Person that will receive this type of token;
    /// @param amount_ Amount of trade.
    /// @return result Posibility of proceeding further on this side.
    function tryOneWayTransfer(
        string memory symbol,
        address from_,
        address to_,
        uint amount_
    ) internal returns (bool result) {
        address contractAddress = tokens[symbol];
        ERC20 interfaceToken = ERC20(contractAddress);
        transactionId = transactions.push(
            Transfer({
                contract_:  contractAddress,
                to_: to_,
                amount_: amount_,
                failed_: true
            })
        );
        transactionIndexesToSender[from_].push(transactionId - 1);
        if (amount_ > interfaceToken.allowance(from_, address(this))) {
            result = false;
        } else {
            result = true;
        }
        return result;
    }
}
