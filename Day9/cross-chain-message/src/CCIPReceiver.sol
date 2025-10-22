// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol"; 

/**
 * @title CCIPReceivercontract
 * @notice This contract receives cross-chain messages sent via Chainlink CCIP
 * @dev Inherits from CCIPReceiver to handle incoming CCIP messages
 * @dev Inherits from Ownable for access control functionality
 * @dev Stores the details of the last received message for retrieval
 */
contract CCIPReceivercontract is CCIPReceiver, Ownable{

    /// @notice The message ID of the last received CCIP message
    /// @dev Stored as bytes32 for efficient storage and comparison
    bytes32 private s_lastReceivedMessageId;
    
    /// @notice The text content of the last received message
    /// @dev Stored as a string to preserve the original message format
    string private s_lastReveivedText;
    
    /// @notice The chain selector of the source chain that sent the last message
    /// @dev Used to identify which blockchain the message originated from
    uint64 private s_lastReceivedChainSelector;
    
    /// @notice The address of the sender contract that sent the last message
    /// @dev Decoded from the CCIP message sender field
    address private s_lastReceivedSender;


    /**
     * @notice Emitted when a cross-chain message is received
     * @param messageId The unique identifier of the received CCIP message
     * @param sourceChainSelector The CCIP chain selector of the source blockchain
     * @param sender The address of the sender contract on the source chain
     * @param message The text message that was received
     */
    event MessageReceived(
        bytes32 indexed messageId,
        uint64 indexed sourceChainSelector,
        address sender,
        string message
    );

    /**
     * @notice Constructor to initialize the CCIPReceiver contract
     * @param _router The address of the Chainlink CCIP router contract
     * @dev Initializes the parent CCIPReceiver with the router address
     * @dev Sets the deployer as the owner of the contract
     */
    constructor(address _router) CCIPReceiver(_router) Ownable(msg.sender){}

    /**
     * @notice Internal function called by CCIP router when a message is received
     * @param any2EvmMessage The CCIP message structure containing all message details
     * @dev This function is automatically called by the CCIP router
     * @dev Overrides the _ccipReceive function from the CCIPReceiver parent contract
     * @dev Stores all message details in state variables for later retrieval
     * @dev Emits MessageReceived event with the message details
     */
    function _ccipReceive(Client.Any2EVMMessage memory any2EvmMessage) internal override {
        // Store the unique message identifier
        s_lastReceivedMessageId = any2EvmMessage.messageId;
        
        // Store the source chain selector
        s_lastReceivedChainSelector = any2EvmMessage.sourceChainSelector;
        
        // Decode and store the sender address from the message
        s_lastReceivedSender = abi.decode(any2EvmMessage.sender,(address));
        
        // Decode and store the message text from the message data
        s_lastReveivedText = abi.decode(any2EvmMessage.data, (string));

        // Emit event to log the received message
        emit MessageReceived(s_lastReceivedMessageId, s_lastReceivedChainSelector, s_lastReceivedSender, s_lastReveivedText);



    }

    /**
     * @notice Retrieves the details of the last received cross-chain message
     * @return messageId The unique identifier of the last received message
     * @return text The text content of the last received message
     * @return sourceChainSelector The chain selector of the source blockchain
     * @return sender The address of the sender contract on the source chain
     * @dev This is a view function that doesn't modify state
     * @dev Returns all stored details from the most recent message received
     */
    function getLastReceivedMessageDetails() external view returns(
        bytes32 messageId,
        string memory text,
        uint64 sourceChainSelector,
        address sender
    ){
        return (
            s_lastReceivedMessageId,
            s_lastReveivedText,
            s_lastReceivedChainSelector,
            s_lastReceivedSender
        );
    }
}