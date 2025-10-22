// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/VotingContract.sol";

/// @title Proposer Management Tests
/// @notice Tests for approving and removing proposers
contract ProposerManagementTest is Test {
    VotingContract public votingContract;
    address public owner;
    address public user1;
    address public user2;
    address public user3;

    event ProposerApproved(address proposer);
    event ProposerRemoved(address proposer);

    function setUp() public {
        owner = address(this);
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        user3 = makeAddr("user3");
        votingContract = new VotingContract();
    }

    /// @notice Test owner can approve a new proposer
    function test_OwnerCanApproveProposer() public {
        assertFalse(votingContract.isApprovedProposer(user1), "User1 should not be approved initially");
        
        votingContract.approveProposer(user1);
        
        assertTrue(votingContract.isApprovedProposer(user1), "User1 should be approved after approval");
    }

    /// @notice Test ProposerApproved event is emitted correctly
    function test_ApproveProposerEmitsEvent() public {
        vm.expectEmit(true, false, false, false);
        emit ProposerApproved(user1);
        
        votingContract.approveProposer(user1);
    }

    /// @notice Test non-owner cannot approve proposer
    function test_NonOwnerCannotApproveProposer() public {
        vm.prank(user1);
        vm.expectRevert("Not authorized");
        votingContract.approveProposer(user2);
    }

    /// @notice Test owner can remove a proposer
    function test_OwnerCanRemoveProposer() public {
        votingContract.approveProposer(user1);
        assertTrue(votingContract.isApprovedProposer(user1), "User1 should be approved");
        
        votingContract.removeProposer(user1);
        
        assertFalse(votingContract.isApprovedProposer(user1), "User1 should not be approved after removal");
    }

    /// @notice Test ProposerRemoved event is emitted correctly
    function test_RemoveProposerEmitsEvent() public {
        votingContract.approveProposer(user1);
        
        vm.expectEmit(true, false, false, false);
        emit ProposerRemoved(user1);
        
        votingContract.removeProposer(user1);
    }

    /// @notice Test non-owner cannot remove proposer
    function test_NonOwnerCannotRemoveProposer() public {
        votingContract.approveProposer(user1);
        
        vm.prank(user2);
        vm.expectRevert("Not authorized");
        votingContract.removeProposer(user1);
    }

    /// @notice Test owner can remove themselves as proposer
    function test_OwnerCanRemoveThemselves() public {
        assertTrue(votingContract.isApprovedProposer(owner), "Owner should be approved initially");
        
        votingContract.removeProposer(owner);
        
        assertFalse(votingContract.isApprovedProposer(owner), "Owner should not be approved after removal");
    }

    /// @notice Test approving already approved proposer (idempotent)
    function test_ApprovingAlreadyApprovedProposer() public {
        votingContract.approveProposer(user1);
        assertTrue(votingContract.isApprovedProposer(user1), "User1 should be approved");
        
        // Approve again
        votingContract.approveProposer(user1);
        assertTrue(votingContract.isApprovedProposer(user1), "User1 should still be approved");
    }

    /// @notice Test removing already removed proposer (idempotent)
    function test_RemovingAlreadyRemovedProposer() public {
        assertFalse(votingContract.isApprovedProposer(user1), "User1 should not be approved");
        
        // Remove non-approved proposer
        votingContract.removeProposer(user1);
        assertFalse(votingContract.isApprovedProposer(user1), "User1 should still not be approved");
    }

    /// @notice Test approving multiple proposers
    function test_ApproveMultipleProposers() public {
        votingContract.approveProposer(user1);
        votingContract.approveProposer(user2);
        votingContract.approveProposer(user3);
        
        assertTrue(votingContract.isApprovedProposer(user1), "User1 should be approved");
        assertTrue(votingContract.isApprovedProposer(user2), "User2 should be approved");
        assertTrue(votingContract.isApprovedProposer(user3), "User3 should be approved");
    }

    /// @notice Test approving zero address
    function test_ApproveZeroAddress() public {
        votingContract.approveProposer(address(0));
        assertTrue(votingContract.isApprovedProposer(address(0)), "Zero address should be approved");
    }

    /// @notice Fuzz test for approving random addresses
    function testFuzz_ApproveProposer(address proposer) public {
        votingContract.approveProposer(proposer);
        assertTrue(votingContract.isApprovedProposer(proposer), "Proposer should be approved");
    }

    /// @notice Fuzz test for removing random addresses
    function testFuzz_RemoveProposer(address proposer) public {
        votingContract.approveProposer(proposer);
        votingContract.removeProposer(proposer);
        assertFalse(votingContract.isApprovedProposer(proposer), "Proposer should not be approved");
    }
}
