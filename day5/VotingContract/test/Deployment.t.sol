// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/VotingContract.sol";

/// @title Deployment and Initialization Tests
/// @notice Tests for contract deployment and initial state
contract DeploymentTest is Test {
    VotingContract public votingContract;
    address public owner;
    address public user1;
    address public user2;

    function setUp() public {
        owner = address(this);
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        votingContract = new VotingContract();
    }

    /// @notice Test that owner is set correctly on deployment
    function test_OwnerSetCorrectly() public {
        assertEq(votingContract.owner(), owner, "Owner should be deployer");
    }

    /// @notice Test that owner is automatically approved as proposer
    function test_OwnerIsApprovedProposer() public {
        assertTrue(votingContract.isApprovedProposer(owner), "Owner should be approved proposer");
    }

    /// @notice Test that non-owner addresses are not approved proposers by default
    function test_NonOwnerNotApprovedProposer() public {
        assertFalse(votingContract.isApprovedProposer(user1), "User1 should not be approved proposer");
        assertFalse(votingContract.isApprovedProposer(user2), "User2 should not be approved proposer");
    }

    /// @notice Test that proposal count is zero on deployment
    function test_InitialProposalCountIsZero() public {
        assertEq(votingContract.getProposalCount(), 0, "Initial proposal count should be 0");
    }

    /// @notice Test deployment with different deployer addresses (fuzz test)
    function testFuzz_DeploymentWithDifferentAddresses(address deployer) public {
        vm.assume(deployer != address(0));
        vm.prank(deployer);
        VotingContract newContract = new VotingContract();
        assertEq(newContract.owner(), deployer, "Owner should be deployer");
        assertTrue(newContract.isApprovedProposer(deployer), "Deployer should be approved proposer");
    }
}
