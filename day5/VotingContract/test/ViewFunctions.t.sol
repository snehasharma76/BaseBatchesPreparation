// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/VotingContract.sol";

/// @title View Functions Tests
/// @notice Tests for view/getter functions
contract ViewFunctionsTest is Test {
    VotingContract public votingContract;
    address public owner;
    address public voter1;
    address public voter2;

    function setUp() public {
        owner = address(this);
        voter1 = makeAddr("voter1");
        voter2 = makeAddr("voter2");
        votingContract = new VotingContract();
    }

    /// @notice Helper function to create a proposal
    function createProposal(string memory description, uint256 duration) internal returns (uint256) {
        return votingContract.createProposal(description, duration);
    }

    /// @notice Test getProposalCount returns correct count
    function test_GetProposalCountInitial() public {
        assertEq(votingContract.getProposalCount(), 0, "Initial count should be 0");
    }

    /// @notice Test getProposalCount after creating proposals
    function test_GetProposalCountAfterCreation() public {
        createProposal("Proposal 1", 1 days);
        assertEq(votingContract.getProposalCount(), 1, "Count should be 1");
        
        createProposal("Proposal 2", 1 days);
        assertEq(votingContract.getProposalCount(), 2, "Count should be 2");
        
        createProposal("Proposal 3", 1 days);
        assertEq(votingContract.getProposalCount(), 3, "Count should be 3");
    }

    /// @notice Test getProposal returns correct data
    function test_GetProposalReturnsCorrectData() public {
        uint256 duration = 7 days;
        uint256 expectedEndTime = block.timestamp + duration;
        uint256 proposalId = createProposal("Test Proposal", duration);
        
        (
            string memory description,
            uint256 yesVotes,
            uint256 noVotes,
            bool active,
            uint256 endTime,
            bool approved
        ) = votingContract.getProposal(proposalId);
        
        assertEq(description, "Test Proposal", "Description should match");
        assertEq(yesVotes, 0, "Yes votes should be 0");
        assertEq(noVotes, 0, "No votes should be 0");
        assertTrue(active, "Proposal should be active");
        assertEq(endTime, expectedEndTime, "End time should match");
        assertFalse(approved, "Proposal should not be approved");
    }

    /// @notice Test getProposal reverts for non-existent proposal
    function test_GetProposalRevertsForNonExistent() public {
        vm.expectRevert("Proposal does not exist");
        votingContract.getProposal(0);
    }

    /// @notice Test getProposal after voting
    function test_GetProposalAfterVoting() public {
        uint256 proposalId = createProposal("Voting Test", 1 days);
        
        vm.prank(voter1);
        votingContract.vote(proposalId, true);
        
        vm.prank(voter2);
        votingContract.vote(proposalId, false);
        
        (, uint256 yesVotes, uint256 noVotes, , , ) = votingContract.getProposal(proposalId);
        
        assertEq(yesVotes, 1, "Yes votes should be 1");
        assertEq(noVotes, 1, "No votes should be 1");
    }

    /// @notice Test getProposal after closing
    function test_GetProposalAfterClosing() public {
        uint256 proposalId = createProposal("Closing Test", 1 days);
        
        vm.prank(voter1);
        votingContract.vote(proposalId, true);
        
        vm.warp(block.timestamp + 2 days);
        votingContract.closeProposal(proposalId);
        
        (, , , bool active, , bool approved) = votingContract.getProposal(proposalId);
        
        assertFalse(active, "Proposal should be inactive");
        assertTrue(approved, "Proposal should be approved");
    }

    /// @notice Test proposals public array getter
    function test_ProposalsPublicGetter() public {
        uint256 proposalId = createProposal("Public Getter Test", 1 days);
        
        (
            string memory description,
            uint256 yesVotes,
            uint256 noVotes,
            bool active,
            uint256 endTime,
            bool approved
        ) = votingContract.proposals(proposalId);
        
        assertEq(description, "Public Getter Test", "Description should match");
        assertEq(yesVotes, 0, "Yes votes should be 0");
        assertEq(noVotes, 0, "No votes should be 0");
        assertTrue(active, "Proposal should be active");
        assertFalse(approved, "Proposal should not be approved");
    }

    /// @notice Test hasVoted mapping for voter who hasn't voted
    function test_HasVotedForNonVoter() public {
        uint256 proposalId = createProposal("Has Voted Test", 1 days);
        
        assertFalse(votingContract.hasVoted(proposalId, voter1), "Voter1 should not have voted");
        assertFalse(votingContract.hasVoted(proposalId, voter2), "Voter2 should not have voted");
    }

    /// @notice Test hasVoted mapping after voting
    function test_HasVotedAfterVoting() public {
        uint256 proposalId = createProposal("Has Voted Test", 1 days);
        
        vm.prank(voter1);
        votingContract.vote(proposalId, true);
        
        assertTrue(votingContract.hasVoted(proposalId, voter1), "Voter1 should have voted");
        assertFalse(votingContract.hasVoted(proposalId, voter2), "Voter2 should not have voted");
    }

    /// @notice Test hasVoted for different proposals
    function test_HasVotedForDifferentProposals() public {
        uint256 proposalId1 = createProposal("Proposal 1", 1 days);
        uint256 proposalId2 = createProposal("Proposal 2", 1 days);
        
        vm.prank(voter1);
        votingContract.vote(proposalId1, true);
        
        assertTrue(votingContract.hasVoted(proposalId1, voter1), "Should have voted on proposal 1");
        assertFalse(votingContract.hasVoted(proposalId2, voter1), "Should not have voted on proposal 2");
    }

    /// @notice Test isApprovedProposer for owner
    function test_IsApprovedProposerForOwner() public {
        assertTrue(votingContract.isApprovedProposer(owner), "Owner should be approved proposer");
    }

    /// @notice Test isApprovedProposer for non-approved user
    function test_IsApprovedProposerForNonApproved() public {
        assertFalse(votingContract.isApprovedProposer(voter1), "Voter1 should not be approved proposer");
    }

    /// @notice Test isApprovedProposer after approval
    function test_IsApprovedProposerAfterApproval() public {
        votingContract.approveProposer(voter1);
        assertTrue(votingContract.isApprovedProposer(voter1), "Voter1 should be approved proposer");
    }

    /// @notice Test isApprovedProposer after removal
    function test_IsApprovedProposerAfterRemoval() public {
        votingContract.approveProposer(voter1);
        votingContract.removeProposer(voter1);
        assertFalse(votingContract.isApprovedProposer(voter1), "Voter1 should not be approved proposer");
    }

    /// @notice Test owner public variable
    function test_OwnerPublicVariable() public {
        assertEq(votingContract.owner(), owner, "Owner should match deployer");
    }

    /// @notice Test getProposal for multiple proposals
    function test_GetProposalForMultipleProposals() public {
        uint256 id1 = createProposal("Proposal 1", 1 days);
        uint256 id2 = createProposal("Proposal 2", 2 days);
        uint256 id3 = createProposal("Proposal 3", 3 days);
        
        (string memory desc1, , , , , ) = votingContract.getProposal(id1);
        (string memory desc2, , , , , ) = votingContract.getProposal(id2);
        (string memory desc3, , , , , ) = votingContract.getProposal(id3);
        
        assertEq(desc1, "Proposal 1", "Proposal 1 description should match");
        assertEq(desc2, "Proposal 2", "Proposal 2 description should match");
        assertEq(desc3, "Proposal 3", "Proposal 3 description should match");
    }

    /// @notice Test getProposal with empty description
    function test_GetProposalWithEmptyDescription() public {
        uint256 proposalId = createProposal("", 1 days);
        
        (string memory description, , , , , ) = votingContract.getProposal(proposalId);
        
        assertEq(description, "", "Description should be empty");
    }

    /// @notice Test getProposal with very long description
    function test_GetProposalWithLongDescription() public {
        string memory longDesc = "This is a very long description that contains a lot of text to test if the contract can handle long strings properly";
        uint256 proposalId = createProposal(longDesc, 1 days);
        
        (string memory description, , , , , ) = votingContract.getProposal(proposalId);
        
        assertEq(description, longDesc, "Description should match");
    }

    /// @notice Fuzz test for getProposal with valid IDs
    function testFuzz_GetProposalWithValidIds(uint8 numProposals) public {
        vm.assume(numProposals > 0 && numProposals <= 50);
        
        for (uint i = 0; i < numProposals; i++) {
            createProposal(string(abi.encodePacked("Proposal ", i)), 1 days);
        }
        
        assertEq(votingContract.getProposalCount(), numProposals, "Proposal count should match");
        
        // Test getting a random valid proposal
        uint256 randomId = uint256(keccak256(abi.encodePacked(block.timestamp))) % numProposals;
        (string memory description, , , bool active, , ) = votingContract.getProposal(randomId);
        
        assertTrue(bytes(description).length > 0, "Description should not be empty");
        assertTrue(active, "Proposal should be active");
    }

    /// @notice Fuzz test for getProposal with invalid IDs
    function testFuzz_GetProposalWithInvalidIds(uint256 invalidId) public {
        createProposal("Test", 1 days);
        vm.assume(invalidId >= votingContract.getProposalCount());
        
        vm.expectRevert("Proposal does not exist");
        votingContract.getProposal(invalidId);
    }

    /// @notice Test hasVoted for non-existent proposal
    function test_HasVotedForNonExistentProposal() public {
        // hasVoted doesn't revert for non-existent proposals, it just returns false
        assertFalse(votingContract.hasVoted(999, voter1), "Should return false for non-existent proposal");
    }

    /// @notice Test view functions don't modify state
    function test_ViewFunctionsDontModifyState() public {
        uint256 proposalId = createProposal("State Test", 1 days);
        
        uint256 countBefore = votingContract.getProposalCount();
        votingContract.getProposal(proposalId);
        votingContract.getProposalCount();
        votingContract.hasVoted(proposalId, voter1);
        votingContract.isApprovedProposer(voter1);
        uint256 countAfter = votingContract.getProposalCount();
        
        assertEq(countBefore, countAfter, "View functions should not modify state");
    }
}
