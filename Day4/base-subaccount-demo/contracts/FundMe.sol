// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title FundMe
 * @dev A simple contract that accepts exactly 0.00009 ETH per transaction
 * 
 * This contract demonstrates:
 * - Strict payment validation
 * - Balance tracking
 * - Protection against direct ETH transfers
 * 
 * Used in conjunction with Base Account SDK to showcase subaccount transactions
 */
contract FundMe {
    /// @notice The exact amount of ETH required for each funding transaction
    uint256 public constant REQUIRED_AMOUNT = 0.00009 ether;
    
    /**
     * @notice Fund the contract with exactly 0.00009 ETH
     * @dev Reverts if the sent amount doesn't match REQUIRED_AMOUNT exactly
     * 
     * This function is designed to be called from a subaccount using
     * the Base Account SDK's wallet_sendCalls method
     */
    function fundMe() public payable {
        require(msg.value == REQUIRED_AMOUNT, "Must send exactly 0.00009 ETH");
    }
    
    /**
     * @notice Get the current balance of the contract
     * @return The contract's ETH balance in wei
     */
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @notice Fallback function to reject direct ETH transfers
     * @dev Always reverts to prevent accidental ETH transfers
     * Users must call fundMe() explicitly
     */
    receive() external payable {
        revert("Use fundMe() function");
    }
}
