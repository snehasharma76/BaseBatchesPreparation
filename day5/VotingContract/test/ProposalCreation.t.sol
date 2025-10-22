// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/VotingContract.sol";

/// @title Proposal Creation Tests
/// @notice Tests for creating proposals
contract ProposalCreationTest is Test {
    VotingContract public votingContract;
    address public owner;
    address public approvedProposer;
    address public unapprovedUser;

    event ProposalCreated(uint256 proposalId, string description, uint256 endTime);

    function setUp() public {
        owner = address(this);
        approvedProposer = makeAddr("approvedProposer");
        unapprovedUser = makeAddr("unapprovedUser");
        votingContract = new VotingContract();
        votingContract.approveProposer(approvedProposer);
    }

    /// @notice Test approved proposer can create proposal
    function test_ApprovedProposerCanCreateProposal() public {
        vm.prank(approvedProposer);
        uint256 proposalId = votingContract.createProposal("Test Proposal", 1 days);
        
        assertEq(proposalId, 0, "First proposal should have ID 0");
        assertEq(votingContract.getProposalCount(), 1, "Proposal count should be 1");
    }

    /// @notice Test owner can create proposal
    function test_OwnerCanCreateProposal() public {
        uint256 proposalId = votingContract.createProposal("Owner Proposal", 1 days);
        
        assertEq(proposalId, 0, "First proposal should have ID 0");
        assertEq(votingContract.getProposalCount(), 1, "Proposal count should be 1");
    }

    /// @notice Test unapproved user cannot create proposal
    function test_UnapprovedUserCannotCreateProposal() public {
        vm.prank(unapprovedUser);
        vm.expectRevert("Not an approved Proposer");
        votingContract.createProposal("Unauthorized Proposal", 1 days);
    }

    /// @notice Test ProposalCreated event is emitted correctly
    function test_CreateProposalEmitsEvent() public {
        uint256 expectedEndTime = block.timestamp + 1 days;
        
        vm.expectEmit(true, false, false, true);
        emit ProposalCreated(0, "Test Proposal", expectedEndTime);
        
        votingContract.createProposal("Test Proposal", 1 days);
    }

    /// @notice Test proposal is created with correct initial state
    function test_ProposalCreatedWithCorrectState() public {
        uint256 duration = 7 days;
        uint256 expectedEndTime = block.timestamp + duration;
        
        uint256 proposalId = votingContract.createProposal("Test Proposal", duration);
        
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
        assertFalse(approved, "Proposal should not be approved initially");
    }

    /// @notice Test creating multiple proposals increments IDs correctly
    function test_MultipleProposalsIncrementIds() public {
        uint256 id1 = votingContract.createProposal("Proposal 1", 1 days);
        uint256 id2 = votingContract.createProposal("Proposal 2", 2 days);
        uint256 id3 = votingContract.createProposal("Proposal 3", 3 days);
        
        assertEq(id1, 0, "First proposal ID should be 0");
        assertEq(id2, 1, "Second proposal ID should be 1");
        assertEq(id3, 2, "Third proposal ID should be 2");
        assertEq(votingContract.getProposalCount(), 3, "Total proposals should be 3");
    }

    /// @notice Test creating proposal with zero duration
    function test_CreateProposalWithZeroDuration() public {
        uint256 proposalId = votingContract.createProposal("Zero Duration", 0);
        
        (, , , bool active, uint256 endTime, ) = votingContract.getProposal(proposalId);
        
        assertTrue(active, "Proposal should be active");
        assertEq(endTime, block.timestamp, "End time should be current timestamp");
    }

    /// @notice Test creating proposal with very long duration
    function test_CreateProposalWithLongDuration() public {
        uint256 longDuration = 365 days;
        uint256 expectedEndTime = block.timestamp + longDuration;
        
        uint256 proposalId = votingContract.createProposal("Long Duration", longDuration);
        
        (, , , , uint256 endTime, ) = votingContract.getProposal(proposalId);
        
        assertEq(endTime, expectedEndTime, "End time should match long duration");
    }

    /// @notice Test creating proposal with empty description
    function test_CreateProposalWithEmptyDescription() public {
        uint256 proposalId = votingContract.createProposal("", 1 days);
        
        (string memory description, , , , , ) = votingContract.getProposal(proposalId);
        
        assertEq(description, "", "Description should be empty");
    }

    /// @notice Test creating proposal with very long description
    function test_CreateProposalWithLongDescription() public {
        string memory longDescription = "This is a very long description that contains a lot of text to test if the contract can handle long strings properly without any issues";
        
        uint256 proposalId = votingContract.createProposal(longDescription, 1 days);
        
        (string memory description, , , , , ) = votingContract.getProposal(proposalId);
        
        assertEq(description, longDescription, "Description should match");
    }

    /// @notice Test multiple proposers can create proposals
    function test_MultipleProposersCanCreateProposals() public {
        address proposer2 = makeAddr("proposer2");
        votingContract.approveProposer(proposer2);
        
        vm.prank(approvedProposer);
        uint256 id1 = votingContract.createProposal("Proposal by proposer1", 1 days);
        
        vm.prank(proposer2);
        uint256 id2 = votingContract.createProposal("Proposal by proposer2", 2 days);
        
        assertEq(id1, 0, "First proposal ID should be 0");
        assertEq(id2, 1, "Second proposal ID should be 1");
    }

    /// @notice Fuzz test for creating proposals with random durations
    function testFuzz_CreateProposalWithRandomDuration(uint256 duration) public {
        vm.assume(duration < 365 days * 100); // Reasonable upper bound
        
        uint256 expectedEndTime = block.timestamp + duration;
        uint256 proposalId = votingContract.createProposal("Fuzz Proposal", duration);
        
        (, , , , uint256 endTime, ) = votingContract.getProposal(proposalId);
        
        assertEq(endTime, expectedEndTime, "End time should match");
    }

    /// @notice Test creating proposal after being removed as proposer fails
    function test_RemovedProposerCannotCreateProposal() public {
        vm.prank(approvedProposer);
        votingContract.createProposal("First Proposal", 1 days);
        
        // Remove proposer
        votingContract.removeProposer(approvedProposer);
        
        vm.prank(approvedProposer);
        vm.expectRevert("Not an approved Proposer");
        votingContract.createProposal("Second Proposal", 1 days);
    }
}
