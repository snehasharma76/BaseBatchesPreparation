// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/VotingContract.sol";

/// @title Voting Tests
/// @notice Tests for voting functionality
contract VotingTest is Test {
    VotingContract public votingContract;
    address public owner;
    address public voter1;
    address public voter2;
    address public voter3;

    event VoteCast(uint256 proposalId, address voter);

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

    /// @notice Test user can vote yes on active proposal
    function test_VoteYesOnActiveProposal() public {
        uint256 proposalId = createProposal(1 days);
        
        vm.prank(voter1);
        votingContract.vote(proposalId, true);
        
        (, uint256 yesVotes, uint256 noVotes, , , ) = votingContract.getProposal(proposalId);
        
        assertEq(yesVotes, 1, "Yes votes should be 1");
        assertEq(noVotes, 0, "No votes should be 0");
        assertTrue(votingContract.hasVoted(proposalId, voter1), "Voter1 should be marked as voted");
    }

    /// @notice Test user can vote no on active proposal
    function test_VoteNoOnActiveProposal() public {
        uint256 proposalId = createProposal(1 days);
        
        vm.prank(voter1);
        votingContract.vote(proposalId, false);
        
        (, uint256 yesVotes, uint256 noVotes, , , ) = votingContract.getProposal(proposalId);
        
        assertEq(yesVotes, 0, "Yes votes should be 0");
        assertEq(noVotes, 1, "No votes should be 1");
        assertTrue(votingContract.hasVoted(proposalId, voter1), "Voter1 should be marked as voted");
    }

    /// @notice Test VoteCast event is emitted correctly
    function test_VoteEmitsEvent() public {
        uint256 proposalId = createProposal(1 days);
        
        vm.expectEmit(true, true, false, false);
        emit VoteCast(proposalId, voter1);
        
        vm.prank(voter1);
        votingContract.vote(proposalId, true);
    }

    /// @notice Test multiple users can vote on same proposal
    function test_MultipleUsersCanVote() public {
        uint256 proposalId = createProposal(1 days);
        
        vm.prank(voter1);
        votingContract.vote(proposalId, true);
        
        vm.prank(voter2);
        votingContract.vote(proposalId, true);
        
        vm.prank(voter3);
        votingContract.vote(proposalId, false);
        
        (, uint256 yesVotes, uint256 noVotes, , , ) = votingContract.getProposal(proposalId);
        
        assertEq(yesVotes, 2, "Yes votes should be 2");
        assertEq(noVotes, 1, "No votes should be 1");
    }

    /// @notice Test user cannot vote twice on same proposal
    function test_CannotVoteTwice() public {
        uint256 proposalId = createProposal(1 days);
        
        vm.startPrank(voter1);
        votingContract.vote(proposalId, true);
        
        vm.expectRevert("Already Voted");
        votingContract.vote(proposalId, false);
        vm.stopPrank();
    }

    /// @notice Test cannot vote on non-existent proposal
    function test_CannotVoteOnNonExistentProposal() public {
        vm.prank(voter1);
        vm.expectRevert("Proposal does not exist");
        votingContract.vote(999, true);
    }

    /// @notice Test cannot vote on inactive proposal
    function test_CannotVoteOnInactiveProposal() public {
        uint256 proposalId = createProposal(1 days);
        
        // Fast forward past end time
        vm.warp(block.timestamp + 2 days);
        
        // Close the proposal
        votingContract.closeProposal(proposalId);
        
        vm.prank(voter1);
        vm.expectRevert("Proposal is not active");
        votingContract.vote(proposalId, true);
    }

    /// @notice Test cannot vote after voting period ended
    function test_CannotVoteAfterEndTime() public {
        uint256 proposalId = createProposal(1 days);
        
        // Fast forward past end time
        vm.warp(block.timestamp + 2 days);
        
        vm.prank(voter1);
        vm.expectRevert("Voting ended");
        votingContract.vote(proposalId, true);
    }

    /// @notice Test voting at the last moment before end time
    function test_VoteAtLastMoment() public {
        uint256 proposalId = createProposal(1 days);
        
        // Fast forward to just before end time
        vm.warp(block.timestamp + 1 days - 1);
        
        vm.prank(voter1);
        votingContract.vote(proposalId, true);
        
        (, uint256 yesVotes, , , , ) = votingContract.getProposal(proposalId);
        assertEq(yesVotes, 1, "Vote should be counted");
    }

    /// @notice Test cannot vote exactly at end time
    function test_CannotVoteAtEndTime() public {
        uint256 proposalId = createProposal(1 days);
        
        // Fast forward to exactly end time
        vm.warp(block.timestamp + 1 days);
        
        vm.prank(voter1);
        vm.expectRevert("Voting ended");
        votingContract.vote(proposalId, true);
    }

    /// @notice Test voting on proposal with zero duration
    function test_VoteOnZeroDurationProposal() public {
        uint256 proposalId = createProposal(0);
        
        // At current timestamp, voting should have ended
        vm.prank(voter1);
        vm.expectRevert("Voting ended");
        votingContract.vote(proposalId, true);
    }

    /// @notice Test same user can vote on different proposals
    function test_SameUserCanVoteOnDifferentProposals() public {
        uint256 proposalId1 = createProposal(1 days);
        uint256 proposalId2 = createProposal(1 days);
        
        vm.startPrank(voter1);
        votingContract.vote(proposalId1, true);
        votingContract.vote(proposalId2, false);
        vm.stopPrank();
        
        assertTrue(votingContract.hasVoted(proposalId1, voter1), "Should have voted on proposal 1");
        assertTrue(votingContract.hasVoted(proposalId2, voter1), "Should have voted on proposal 2");
    }

    /// @notice Test owner can vote on proposals
    function test_OwnerCanVote() public {
        uint256 proposalId = createProposal(1 days);
        
        votingContract.vote(proposalId, true);
        
        (, uint256 yesVotes, , , , ) = votingContract.getProposal(proposalId);
        assertEq(yesVotes, 1, "Owner's vote should be counted");
    }

    /// @notice Test proposer can vote on their own proposal
    function test_ProposerCanVoteOnOwnProposal() public {
        address proposer = makeAddr("proposer");
        votingContract.approveProposer(proposer);
        
        vm.prank(proposer);
        uint256 proposalId = votingContract.createProposal("Self Vote", 1 days);
        
        vm.prank(proposer);
        votingContract.vote(proposalId, true);
        
        (, uint256 yesVotes, , , , ) = votingContract.getProposal(proposalId);
        assertEq(yesVotes, 1, "Proposer's vote should be counted");
    }

    /// @notice Test vote counts are accurate with many voters
    function test_VoteCountsWithManyVoters() public {
        uint256 proposalId = createProposal(1 days);
        
        // Create 10 voters, 7 yes, 3 no
        for (uint i = 0; i < 10; i++) {
            address voter = makeAddr(string(abi.encodePacked("voter", i)));
            vm.prank(voter);
            votingContract.vote(proposalId, i < 7); // First 7 vote yes, last 3 vote no
        }
        
        (, uint256 yesVotes, uint256 noVotes, , , ) = votingContract.getProposal(proposalId);
        assertEq(yesVotes, 7, "Should have 7 yes votes");
        assertEq(noVotes, 3, "Should have 3 no votes");
    }

    /// @notice Fuzz test for voting with random voters
    function testFuzz_VoteWithRandomVoter(address voter, bool voteChoice) public {
        vm.assume(voter != address(0));
        uint256 proposalId = createProposal(1 days);
        
        vm.prank(voter);
        votingContract.vote(proposalId, voteChoice);
        
        assertTrue(votingContract.hasVoted(proposalId, voter), "Voter should be marked as voted");
    }

    /// @notice Test hasVoted mapping is correctly updated
    function test_HasVotedMappingUpdated() public {
        uint256 proposalId = createProposal(1 days);
        
        assertFalse(votingContract.hasVoted(proposalId, voter1), "Should not have voted initially");
        
        vm.prank(voter1);
        votingContract.vote(proposalId, true);
        
        assertTrue(votingContract.hasVoted(proposalId, voter1), "Should have voted after voting");
        assertFalse(votingContract.hasVoted(proposalId, voter2), "Voter2 should not have voted");
    }

    /// @notice Test voting on proposal ID 0
    function test_VoteOnProposalIdZero() public {
        uint256 proposalId = createProposal(1 days);
        assertEq(proposalId, 0, "First proposal should be ID 0");
        
        vm.prank(voter1);
        votingContract.vote(0, true);
        
        (, uint256 yesVotes, , , , ) = votingContract.getProposal(0);
        assertEq(yesVotes, 1, "Vote should be counted on proposal 0");
    }
}
