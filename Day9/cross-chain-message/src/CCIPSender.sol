// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol"; 

/**
 * @title CCIPSender
 * @notice This contract enables sending cross-chain messages using Chainlink CCIP (Cross-Chain Interoperability Protocol)
 * @dev Inherits from Ownable to restrict certain functions to the contract owner
 * @dev Uses LINK tokens to pay for cross-chain message fees
 */
contract CCIPSender is Ownable{

    /// @notice The Chainlink CCIP router client interface for sending messages
    /// @dev Immutable to save gas and ensure router cannot be changed after deployment
    IRouterClient private immutable i_router;
    
    /// @notice The LINK token interface used for paying CCIP fees
    /// @dev Immutable to save gas and ensure token address cannot be changed after deployment
    IERC20 private immutable i_linkToken;

    /**
     * @notice Emitted when a cross-chain message is successfully sent
     * @param messageId The unique identifier of the CCIP message
     * @param destinationChainSelector The CCIP chain selector of the destination chain
     * @param receiver The address of the receiver contract on the destination chain
     * @param message The text message that was sent
     * @param fee The amount of LINK tokens paid for the message transmission
     */
    event MessageSent(
        bytes32 indexed messageId,
        uint64 indexed destinationChainSelector,
        address receiver,
        string message,
        uint256 fee
    );

    /**
     * @notice Error thrown when the contract doesn't have enough LINK tokens to pay for fees
     * @param currentBalance The current LINK token balance of the contract
     * @param calculatedFees The required fee amount for the message
     */
    error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees);

    /**
     * @notice Constructor to initialize the CCIPSender contract
     * @param _router The address of the Chainlink CCIP router contract
     * @param _linkToken The address of the LINK token contract
     * @dev Sets the deployer as the owner of the contract
     */
    constructor(address _router, address _linkToken) Ownable(msg.sender) {
        i_router = IRouterClient(_router);
        i_linkToken = IERC20(_linkToken);
    }

    /**
     * @notice Sends a cross-chain message to a receiver contract on another chain
     * @param _destinationChainSelector The CCIP chain selector of the destination blockchain
     * @param _receiver The address of the receiver contract on the destination chain
     * @param _message The text message to send cross-chain
     * @return messageId The unique identifier of the sent CCIP message
     * @dev Only the contract owner can call this function
     * @dev Requires sufficient LINK token balance to cover the message fees
     * @dev The gas limit is set to 20,000 for the receiver contract execution
     */
    function sendMessage(uint64 _destinationChainSelector, address _receiver, string calldata _message) external onlyOwner returns (bytes32 messageId){

        // Construct the CCIP message with all required parameters
        Client.EVM2AnyMessage memory evm2AnyMessage = Client.EVM2AnyMessage({
            receiver: abi.encode(_receiver), // ABI-encode the receiver address
            data: abi.encode(_message), // ABI-encode the message string
            tokenAmounts: new Client.EVMTokenAmount[](0), // No tokens being transferred
            extraArgs: Client._argsToBytes(
                Client.EVMExtraArgsV1({gasLimit: 200_00}) // Set gas limit for receiver execution
            ),
            feeToken: address(i_linkToken) // Pay fees in LINK tokens
        });

        // Calculate the fee required for this cross-chain message
        uint256 fees = i_router.getFee(_destinationChainSelector,evm2AnyMessage);

        // Check if contract has sufficient LINK balance to pay fees
        if(fees > i_linkToken.balanceOf(address(this))){
            revert NotEnoughBalance(i_linkToken.balanceOf(address(this)),fees);
        }

        // Approve the router to spend LINK tokens for fees
        i_linkToken.approve(address(i_router), fees);

        // Send the CCIP message and receive the message ID
        messageId = i_router.ccipSend(_destinationChainSelector,evm2AnyMessage);

        // Emit event with message details
        emit MessageSent(
            messageId,
            _destinationChainSelector,
            _receiver,
            _message,
            fees

        );

        return messageId;


    }

    /**
     * @notice Withdraws all LINK tokens from the contract to a specified address
     * @param _owner The address to receive the withdrawn LINK tokens
     * @dev Only the contract owner can call this function
     * @dev Transfers the entire LINK balance of the contract
     */
    function withdrawLink(address _owner) external onlyOwner{
        uint256 amount = i_linkToken.balanceOf(address(this));
        i_linkToken.transfer(_owner,amount);
    }

    /**
     * @notice Returns the current LINK token balance of the contract
     * @return The amount of LINK tokens held by this contract
     * @dev This is a view function that doesn't modify state
     */
    function getLinkBalance() external  view returns(uint256){
        return  i_linkToken.balanceOf(address(this));
    }

}
