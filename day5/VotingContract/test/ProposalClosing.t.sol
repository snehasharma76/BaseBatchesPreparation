// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/VotingContract.sol";

/// @title Proposal Closing Tests
/// @notice Tests for closing proposals and determining approval
contract ProposalClosingTest is Test {
    VotingContract public votingContract;
    address public owner;
    address public voter1;
    address public voter2;
    address public voter3;

    event ProposalClosed(uint256 proposalId, bool approved);

    function setUp() public {
        owner = address(this);
        voter1 = makeAddr("voter1");
        voter2 = makeAddr("voter2");
        voter3 = makeAddr("voter3");
        votingContract = new VotingContract();
    }

    /// @notice Helper function to create a proposal
    function createProposal(uint256 duration) internal returns (uint256) {
        return votingContract.createProposal("Test Proposal", duration);
    }

    /// @notice Test closing proposal after voting period ends
    function test_CloseProposalAfterEndTime() public {
        uint256 proposalId = createProposal(1 days);
        
        // Fast forward past end time
        vm.warp(block.timestamp + 2 days);
        
        votingContract.closeProposal(proposalId);
        
        (, , , bool active, , ) = votingContract.getProposal(proposalId);
        assertFalse(active, "Proposal should be inactive after closing");
    }

    /// @notice Test proposal is approved when yes votes > no votes
    function test_ProposalApprovedWhenYesWins() public {
        uint256 proposalId = createProposal(1 days);
        
        // 2 yes votes, 1 no vote
        vm.prank(voter1);
        votingContract.vote(proposalId, true);
        vm.prank(voter2);
        votingContract.vote(proposalId, true);
        vm.prank(voter3);
        votingContract.vote(proposalId, false);
        
        vm.warp(block.timestamp + 2 days);
        votingContract.closeProposal(proposalId);
        
        (, , , , , bool approved) = votingContract.getProposal(proposalId);
        assertTrue(approved, "Proposal should be approved");
    }

    /// @notice Test proposal is not approved when no votes > yes votes
    function test_ProposalRejectedWhenNoWins() public {
        uint256 proposalId = createProposal(1 days);
        
        // 1 yes vote, 2 no votes
        vm.prank(voter1);
        votingContract.vote(proposalId, true);
        vm.prank(voter2);
        votingContract.vote(proposalId, false);
        vm.prank(voter3);
        votingContract.vote(proposalId, false);
        
        vm.warp(block.timestamp + 2 days);
        votingContract.closeProposal(proposalId);
        
        (, , , , , bool approved) = votingContract.getProposal(proposalId);
        assertFalse(approved, "Proposal should not be approved");
    }

    /// @notice Test proposal is not approved when votes are tied
    function test_ProposalRejectedWhenTied() public {
        uint256 proposalId = createProposal(1 days);
        
        // 2 yes votes, 2 no votes
        vm.prank(voter1);
        votingContract.vote(proposalId, true);
        vm.prank(voter2);
        votingContract.vote(proposalId, true);
        vm.prank(voter3);
        votingContract.vote(proposalId, false);
        address voter4 = makeAddr("voter4");
        vm.prank(voter4);
        votingContract.vote(proposalId, false);
        
        vm.warp(block.timestamp + 2 days);
        votingContract.closeProposal(proposalId);
        
        (, , , , , bool approved) = votingContract.getProposal(proposalId);
        assertFalse(approved, "Proposal should not be approved when tied");
    }

    /// @notice Test proposal is not approved when no votes cast
    function test_ProposalRejectedWhenNoVotes() public {
        uint256 proposalId = createProposal(1 days);
        
        vm.warp(block.timestamp + 2 days);
        votingContract.closeProposal(proposalId);
        
        (, , , , , bool approved) = votingContract.getProposal(proposalId);
        assertFalse(approved, "Proposal should not be approved with no votes");
    }

    /// @notice Test ProposalClosed event is emitted correctly when approved
    function test_CloseProposalEmitsEventWhenApproved() public {
        uint256 proposalId = createProposal(1 days);
        
        vm.prank(voter1);
        votingContract.vote(proposalId, true);
        
        vm.warp(block.timestamp + 2 days);
        
        vm.expectEmit(true, false, false, true);
        emit ProposalClosed(proposalId, true);
        
        votingContract.closeProposal(proposalId);
    }

    /// @notice Test ProposalClosed event is emitted correctly when rejected
    function test_CloseProposalEmitsEventWhenRejected() public {
        uint256 proposalId = createProposal(1 days);
        
        vm.prank(voter1);
        votingContract.vote(proposalId, false);
        
        vm.warp(block.timestamp + 2 days);
        
        vm.expectEmit(true, false, false, true);
        emit ProposalClosed(proposalId, false);
        
        votingContract.closeProposal(proposalId);
    }

    /// @notice Test cannot close proposal before end time
    function test_CannotCloseProposalBeforeEndTime() public {
        uint256 proposalId = createProposal(1 days);
        
        vm.expectRevert("Voting ongoing");
        votingContract.closeProposal(proposalId);
    }

    /// @notice Test can close proposal exactly at end time
    function test_CanCloseProposalAtEndTime() public {
        uint256 proposalId = createProposal(1 days);
        
        vm.warp(block.timestamp + 1 days);
        
        votingContract.closeProposal(proposalId);
        
        (, , , bool active, , ) = votingContract.getProposal(proposalId);
        assertFalse(active, "Proposal should be closed");
    }

    /// @notice Test cannot close non-existent proposal
    function test_CannotCloseNonExistentProposal() public {
        vm.expectRevert("Proposal does not exist");
        votingContract.closeProposal(999);
    }

    /// @notice Test cannot close already closed proposal
    function test_CannotCloseAlreadyClosedProposal() public {
        uint256 proposalId = createProposal(1 days);
        
        vm.warp(block.timestamp + 2 days);
        votingContract.closeProposal(proposalId);
        
        vm.expectRevert("Proposal is not active");
        votingContract.closeProposal(proposalId);
    }

    /// @notice Test anyone can close proposal after end time
    function test_AnyoneCanCloseProposal() public {
        uint256 proposalId = createProposal(1 days);
        
        vm.warp(block.timestamp + 2 days);
        
        vm.prank(voter1);
        votingContract.closeProposal(proposalId);
        
        (, , , bool active, , ) = votingContract.getProposal(proposalId);
        assertFalse(active, "Proposal should be closed");
    }

    /// @notice Test closing multiple proposals
    function test_CloseMultipleProposals() public {
        uint256 proposalId1 = createProposal(1 days);
        uint256 proposalId2 = createProposal(2 days);
        
        // Close first proposal
        vm.warp(block.timestamp + 1 days);
        votingContract.closeProposal(proposalId1);
        
        (, , , bool active1, , ) = votingContract.getProposal(proposalId1);
        assertFalse(active1, "Proposal 1 should be closed");
        
        // Second proposal should still be active
        (, , , bool active2, , ) = votingContract.getProposal(proposalId2);
        assertTrue(active2, "Proposal 2 should still be active");
        
        // Close second proposal
        vm.warp(block.timestamp + 1 days);
        votingContract.closeProposal(proposalId2);
        
        (, , , bool active2After, , ) = votingContract.getProposal(proposalId2);
        assertFalse(active2After, "Proposal 2 should be closed");
    }

    /// @notice Test proposal with only yes votes is approved
    function test_ProposalWithOnlyYesVotesApproved() public {
        uint256 proposalId = createProposal(1 days);
        
        vm.prank(voter1);
        votingContract.vote(proposalId, true);
        vm.prank(voter2);
        votingContract.vote(proposalId, true);
        
        vm.warp(block.timestamp + 2 days);
        votingContract.closeProposal(proposalId);
        
        (, uint256 yesVotes, uint256 noVotes, , , bool approved) = votingContract.getProposal(proposalId);
        assertEq(yesVotes, 2, "Should have 2 yes votes");
        assertEq(noVotes, 0, "Should have 0 no votes");
        assertTrue(approved, "Proposal should be approved");
    }

    /// @notice Test proposal with only no votes is rejected
    function test_ProposalWithOnlyNoVotesRejected() public {
        uint256 proposalId = createProposal(1 days);
        
        vm.prank(voter1);
        votingContract.vote(proposalId, false);
        vm.prank(voter2);
        votingContract.vote(proposalId, false);
        
        vm.warp(block.timestamp + 2 days);
        votingContract.closeProposal(proposalId);
        
        (, uint256 yesVotes, uint256 noVotes, , , bool approved) = votingContract.getProposal(proposalId);
        assertEq(yesVotes, 0, "Should have 0 yes votes");
        assertEq(noVotes, 2, "Should have 2 no votes");
        assertFalse(approved, "Proposal should not be approved");
    }

    /// @notice Test closing proposal with zero duration
    function test_CloseZeroDurationProposal() public {
        uint256 proposalId = createProposal(0);
        
        // Should be able to close immediately
        votingContract.closeProposal(proposalId);
        
        (, , , bool active, , ) = votingContract.getProposal(proposalId);
        assertFalse(active, "Proposal should be closed");
    }

    /// @notice Test proposal state after closing
    function test_ProposalStateAfterClosing() public {
        uint256 proposalId = createProposal(1 days);
        
        vm.prank(voter1);
        votingContract.vote(proposalId, true);
        
        vm.warp(block.timestamp + 2 days);
        votingContract.closeProposal(proposalId);
        
        (
            string memory description,
            uint256 yesVotes,
            uint256 noVotes,
            bool active,
            uint256 endTime,
            bool approved
        ) = votingContract.getProposal(proposalId);
        
        assertEq(description, "Test Proposal", "Description should remain unchanged");
        assertEq(yesVotes, 1, "Yes votes should remain unchanged");
        assertEq(noVotes, 0, "No votes should remain unchanged");
        assertFalse(active, "Proposal should be inactive");
        assertEq(endTime, block.timestamp - 1 days, "End time should remain unchanged");
        assertTrue(approved, "Proposal should be approved");
    }

    /// @notice Fuzz test for closing proposals at various times after end time
    function testFuzz_CloseProposalAtVariousTimes(uint256 timeAfterEnd) public {
        vm.assume(timeAfterEnd < 365 days);
        
        uint256 proposalId = createProposal(1 days);
        
        vm.warp(block.timestamp + 1 days + timeAfterEnd);
        
        votingContract.closeProposal(proposalId);
        
        (, , , bool active, , ) = votingContract.getProposal(proposalId);
        assertFalse(active, "Proposal should be closed");
    }
}
